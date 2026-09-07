"""Exercise the shared CLI contract against disposable repositories."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

VALIDATOR = Path(__file__).resolve().parents[2] / 'skills/agent-skills-creator/scripts/validate.sh'


class ValidatorContract(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name)
        self.skill = self.repo / 'skills/example'
        self.skill.mkdir(parents=True)
        self.md = self.skill / 'SKILL.md'
        self.md.write_text('---\nname: example\ndescription: Reviews examples. Use when reviewing examples.\n---\n\n# Example\n\nReviews examples.\n')
        (self.repo / 'README.md').write_text('1 skills\n\n[example](skills/example/SKILL.md)\n')

    def run_validator(self, policy='public'):
        result = subprocess.run([str(VALIDATOR), '--format', 'tsv', '--policy', policy,
                                 '--repo', str(self.repo)], capture_output=True, text=True)
        rows = [line.split('\t') for line in result.stdout.splitlines()]
        self.assertTrue(rows, result.stderr)
        self.assertTrue(all(len(row) == 5 for row in rows), result.stdout)
        return result.returncode, rows

    def test_public_and_private_contract(self):
        self.assertEqual(self.run_validator()[0], 0)
        (self.repo / 'README.md').write_text('| Skill | Description |\n| `example` | Example |\n')
        self.md.write_text(self.md.read_text() + '\nUse /Users/example/private-vault.\n')
        self.assertEqual(self.run_validator('private')[0], 0)
        code, rows = self.run_validator()
        self.assertEqual(code, 1)
        self.assertTrue(any(r[1] == 'FAIL' and r[3] == 'no-absolute-paths' for r in rows))

    def test_portable_metadata_rejected_by_both_policies(self):
        self.md.write_text(self.md.read_text().replace('name: example', 'metadata: {version: 1}\nname: example'))
        for policy in ['public', 'private']:
            code, rows = self.run_validator(policy)
            self.assertEqual(code, 1)
            self.assertTrue(any(r[1] == 'FAIL' and r[3] == 'metadata-types' for r in rows))

    def test_empty_leftovers_and_nonempty_broken_skills(self):
        leftover = self.repo / 'skills/retired'
        leftover.mkdir()
        self.assertEqual(self.run_validator()[0], 0)
        (leftover / 'notes.txt').write_text('Not a skill')
        code, rows = self.run_validator()
        self.assertEqual(code, 1)
        self.assertTrue(any(r[:4] == ['retired', 'FAIL', 'format', 'skill-md-present'] for r in rows))

    def test_stale_catalogue_entry_is_rejected(self):
        with (self.repo / 'README.md').open('a') as file:
            file.write('[gone](skills/gone/SKILL.md)\n')
        self.assertEqual(self.run_validator()[0], 1)

    def test_long_reference_uses_canonical_100_line_threshold(self):
        reference = self.skill / 'references/details.md'
        reference.parent.mkdir()
        with self.md.open('a') as file:
            file.write('\nRead [details](references/details.md).\n')
        reference.write_text('# Details\n' + 'Detail.\n' * 100)
        code, rows = self.run_validator()
        self.assertEqual(code, 1)
        self.assertTrue(any(r[1] == 'FAIL' and r[3] == 'toc-over-100-lines' for r in rows))
        reference.write_text('# Details\n\n## Contents\n' + 'Detail.\n' * 100)
        self.assertEqual(self.run_validator()[0], 0)

    def test_empty_cases_cannot_claim_coverage(self):
        cases = self.skill / 'evals/evals.json'
        cases.parent.mkdir()
        cases.write_text(json.dumps({'skill_name': 'example', 'evals': []}))
        for policy in ['public', 'private']:
            code, rows = self.run_validator(policy)
            self.assertEqual(code, 1)
            self.assertTrue(any(r[1] == 'FAIL' and r[3] == 'eval-scenarios' for r in rows))


if __name__ == '__main__':
    unittest.main()
