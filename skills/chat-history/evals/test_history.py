"""Deterministic retrieval contracts; synthetic data only."""
import importlib.util
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/history.py'
spec = importlib.util.spec_from_file_location('history', SCRIPT)
history = importlib.util.module_from_spec(spec)
spec.loader.exec_module(history)


def msg(role, text):
    return {'type': 'response_item', 'timestamp': '2026-09-01T00:00:00Z',
            'payload': {'type': 'message', 'role': role,
                        'content': [{'type': 'input_text' if role == 'user' else 'output_text', 'text': text}]}}


class HistoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.path = self.root / 'session with spaces.jsonl'
        rows = [msg('user', '# AGENTS.md instructions\ncurve'), msg('user', 'yen curve regression'),
                msg('assistant', 'Fixed the viewer.'),
                {'type': 'response_item', 'payload': {'type': 'function_call_output', 'output': 'viewer hash verified'}},
                msg('assistant', 'Correction: source remains unrepaired.'),
                {'type': 'event_msg', 'payload': {'type': 'user_message', 'message': 'yen curve regression'}}]
        self.path.write_text('\n'.join(json.dumps(x) for x in rows)+'\n{broken\n')

    def tearDown(self):
        self.temp.cleanup()

    def run_cli(self, *args):
        p = subprocess.run([sys.executable, str(SCRIPT), *map(str,args)], capture_output=True, text=True)
        return p, [json.loads(line) for line in p.stdout.splitlines()]

    def test_search_filters_injected_and_duplicate_events(self):
        p, rows = self.run_cli('search', self.root, '-e', 'curve', '--role', 'user')
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['line'], 2)

    def test_context_includes_tool_and_correction(self):
        p, rows = self.run_cli('read', self.path, '--line', 2, '--before', 0, '--after', 3)
        self.assertEqual(p.returncode, 0)
        self.assertEqual([r['role'] for r in rows], ['user','assistant','tool','assistant'])
        self.assertIn('unrepaired', rows[-1]['text'])

    def test_limits_preview_and_partial_diagnostic(self):
        self.path.write_text(json.dumps(msg('user', 'x'*5000+' NEEDLE tail'))+'\n')
        p, rows = self.run_cli('search', self.path, '-e', 'NEEDLE', '--chars', 80, '--limit', 1)
        self.assertEqual(p.returncode, 0)
        self.assertIn('NEEDLE', rows[0]['text'])
        self.assertLessEqual(len(rows[0]['text']), 80)
        self.assertTrue(rows[0]['truncated'])
        self.assertIn('partial', p.stderr)
        self.assertNotIn('Exception ignored', p.stderr)

    def test_missing_source_and_no_match_are_different(self):
        p, _ = self.run_cli('search', self.root/'missing', '-e', 'curve')
        self.assertEqual(p.returncode, 2)
        p, rows = self.run_cli('search', self.root, '-e', 'does not exist')
        self.assertEqual(p.returncode, 1)
        self.assertEqual(rows, [])

    def test_literal_metacharacters_and_multiple_terms(self):
        self.path.write_text(json.dumps(msg('user', 'literal [x].* $HOME'))+'\n')
        p, rows = self.run_cli('search', self.root, '-e', '[x].*', '-e', 'absent')
        self.assertEqual(p.returncode, 0)
        self.assertEqual(len(rows), 1)

    def test_subagent_exclusion(self):
        folder=self.root/'subagents'; folder.mkdir()
        (folder/'child.jsonl').write_text(json.dumps(msg('user','curve'))+'\n')
        p, rows=self.run_cli('search',self.root,'-e','curve','--role','user')
        self.assertEqual(len(rows),1)

    def test_preview_preserves_short_messages_and_fills_tail_windows(self):
        for body, chars in [('earlier context ends in needle', 40),
                            ('x' * 100 + 'needle', 40)]:
            with self.subTest(body=body):
                self.path.write_text(json.dumps(msg('user', body)) + '\n')
                p, rows = self.run_cli('search', self.path, '-e', 'needle', '--chars', chars)
                self.assertEqual(p.returncode, 0, p.stderr)
                self.assertEqual(rows[0]['text'], body[-chars:])
                self.assertEqual(rows[0]['preview_start'], max(0, len(body) - chars))
                self.assertEqual(rows[0]['truncated'], len(body) > chars)

    def test_claude_tool_and_message(self):
        r=history.decode({'type':'user','message':{'role':'user','content':[{'type':'tool_result','content':'verified'}]}},self.path,1)
        self.assertEqual(r['role'],'tool')
        r=history.decode({'type':'user','message':{'role':'user','content':[{'type':'tool_result','content':'one'},{'type':'tool_result','content':'two'}]}},self.path,1)
        self.assertEqual(r['role'],'tool')
        r=history.decode({'type':'assistant','message':{'content':[{'type':'text','text':'done'}]}},self.path,1)
        self.assertEqual(r['text'],'done')

    def test_cursor_readonly_scoping_and_invalid_dates(self):
        dbpath=self.root/'state.vscdb'
        with sqlite3.connect(dbpath) as db:
            db.execute('CREATE TABLE composerHeaders(composerId TEXT, isSubagent INTEGER, value TEXT)')
            db.execute('CREATE TABLE cursorDiskKV(key TEXT PRIMARY KEY, value TEXT)')
            db.execute('INSERT INTO composerHeaders VALUES(?,?,?)',('abc',0,json.dumps({'name':'Repair','workspaceIdentifier':{'uri':{'fsPath':'/work/a'}}})))
            for key,value in [('bubbleId:abc:z',{'type':1,'text':'curve','createdAt':1}),('bubbleId:abc:a',{'type':2,'text':'source unrepaired','createdAt':'bad'}),('bubbleId:other:x',{'type':1,'text':'curve','createdAt':0}),('bubbleId:abc:bad',{'type':1,'text':{'text':'curve'}})]:
                db.execute('INSERT INTO cursorDiskKV VALUES(?,?)',(key,json.dumps(value)))
        before=dbpath.read_bytes()
        p,rows=self.run_cli('sessions',dbpath,'--project','/work/a')
        self.assertEqual(rows[0]['session'],'abc')
        p,rows=self.run_cli('search',dbpath,'--session','abc','-e','curve')
        self.assertEqual(len(rows),1)
        p,rows=self.run_cli('read',dbpath,'--session','abc','--key','bubbleId:abc:z','--before',0)
        self.assertEqual(rows[-1]['order'],'unknown')
        self.assertEqual(dbpath.read_bytes(),before)

    def test_chatgpt_selected_branch(self):
        path=self.root/'export.json'
        def node(parent,role,text,key):
            return {'parent':parent,'message':{'id':key,'author':{'role':role},'content':{'parts':[text]}}}
        path.write_text(json.dumps([{'id':'conv','current_node':'c','mapping':{'a':node(None,'user','curve','a'),'b':node('a','assistant','abandoned fix','b'),'c':node('a','assistant','selected fix','c')}}]))
        p,rows=self.run_cli('search',path,'-e','fix')
        self.assertEqual(len(rows),1)
        self.assertEqual(rows[0]['text'],'selected fix')

    def test_claude_export(self):
        path=self.root/'export.json'
        path.write_text(json.dumps([{'uuid':'conv','chat_messages':[{'uuid':'m','sender':'human','text':'curve','created_at':None}]}]))
        p,rows=self.run_cli('search',path,'-e','curve')
        self.assertEqual(p.returncode,0,p.stderr)
        self.assertEqual(rows[0]['role'],'user')

    def test_invalid_export_fails_explicitly(self):
        path=self.root/'export.json';path.write_text('{}')
        p,_=self.run_cli('search',path,'-e','curve')
        self.assertEqual(p.returncode,2)

    def test_malformed_shapes_and_mixed_tool_evidence(self):
        self.path.write_text(json.dumps({'type':'response_item','payload':None})+'\n'+json.dumps({'type':'assistant','message':{'role':'assistant','content':[{'type':'text','text':'Running repair'},{'type':'tool_use','name':'shell','input':{'cmd':'repair --viewer-only'}}]}})+'\n')
        p, rows = self.run_cli('read', self.path, '--line', 2, '--before', 0, '--after', 0)
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertIn('repair --viewer-only', rows[0]['text'])

    def test_export_read_requires_session(self):
        path=self.root/'export.json'; path.write_text('[]')
        p,_=self.run_cli('read',path,'--key','m')
        self.assertEqual(p.returncode,2)
        self.assertIn('--session',p.stderr)

    def test_grok_messages_tools_and_synthetic_filter(self):
        path=self.root/'chat_history.jsonl'
        rows=[{'type':'system','content':'curve'},
              {'type':'user','content':[{'type':'text','text':'curve injected'}],'synthetic_reason':'context'},
              {'type':'user','content':[{'type':'text','text':'curve regression'}]},
              {'type':'assistant','content':'Checking viewer','tool_calls':[{'name':'shell','arguments':'repair --viewer-only'}]},
              {'type':'tool_result','tool_call_id':'call','content':'viewer verified'},
              {'type':'assistant','content':'source remains unrepaired'},
              {'type':'reasoning','content':'curve private'}]
        path.write_text('\n'.join(json.dumps(x) for x in rows)+'\n')
        p,found=self.run_cli('search',path,'-e','curve','--role','user')
        self.assertEqual(len(found),1)
        self.assertEqual(found[0]['source'],'grok')
        self.assertEqual(found[0]['line'],3)
        self.assertIsNone(found[0]['timestamp'])
        p,found=self.run_cli('read',path,'--line',3,'--before',0,'--after',3)
        self.assertEqual([r['role'] for r in found],['user','assistant','tool','assistant'])
        self.assertIn('repair --viewer-only',found[1]['text'])
        self.assertIn('unrepaired',found[-1]['text'])

    def test_empty_terms_and_invalid_windows(self):
        p,_=self.run_cli('search',self.path,'-e','')
        self.assertEqual(p.returncode,2)
        p,_=self.run_cli('read',self.path,'--line',2,'--before',-1)
        self.assertEqual(p.returncode,2)


if __name__ == '__main__':
    unittest.main()
