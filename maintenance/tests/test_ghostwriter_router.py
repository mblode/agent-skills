"""The ghostwriter Surfaces table and references/surfaces.md must agree."""
import re
from pathlib import Path
import unittest

SKILL = Path(__file__).resolve().parents[2] / 'skills/ghostwriter'


class GhostwriterRouter(unittest.TestCase):
    def test_surfaces_table_matches_references(self):
        skill_md = (SKILL / 'SKILL.md').read_text()
        table = skill_md[skill_md.index('## Surfaces'):]
        rows = [line for line in table.splitlines() if line.startswith('| ') and not line.startswith('| Surface') and not line.startswith('|---')]
        self.assertGreaterEqual(len(rows), 5)
        for row in rows:
            cells = [c.strip() for c in row.strip('|').split('|')]
            self.assertEqual(len(cells), 3, row)
            for slug in re.findall(r'`([^`]+)`', cells[1]):
                self.assertRegex(slug, r'^[a-z0-9]+(-[a-z0-9]+)*$|^<company>$', slug)
            for target in re.findall(r'\]\(([^)]+)\)', cells[2]):
                self.assertTrue((SKILL / target).exists(), target)
            bare = re.findall(r'\b([a-z]+\.md)\b', cells[2])
            for name in bare:
                self.assertTrue((SKILL / 'references' / name).exists(), name)
        surfaces = (SKILL / 'references/surfaces.md').read_text()
        heads = re.findall(r'^\*\*([^*]+)\.\*\*', surfaces, re.M)
        self.assertGreaterEqual(len(heads), 8)
        for head in heads:
            first = head.split(',')[0].split(' (')[0].strip().split(' ')[0].lower()
            self.assertIn(first.rstrip('s'), table.lower(), head)


if __name__ == '__main__':
    unittest.main()
