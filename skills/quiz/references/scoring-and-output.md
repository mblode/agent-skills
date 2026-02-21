# Scoring and Output

Rubric for scoring answers and the final result template.

## Scoring Rubric

### Multiple choice (Easy and Medium)

- Correct: 1 point
- Incorrect: 0 points

### Open-ended (Hard)

Score each answer on a 0-1 scale:
- **1 point:** Correct identification of the core issue/approach with reasonable explanation
- **0.5 points:** Partially correct (identifies the right area but misses key details)
- **0 points:** Incorrect or no meaningful attempt

## Per-Question Output

After each answer, show:

```text
[Correct] or [Incorrect] or [Partial Credit: 0.5/1]

Explanation: <why, with file:line references> (medium and hard only)
```

## Final Scorecard

After all questions, present:

```text
## Quiz Results

**Score: {{correct}}/{{total}} ({{percentage}}%)**
**Difficulty: {{difficulty}} | Cards: {{count}}**
**Codebase: {{project_name}}**

### Rating

| Rating | Range |
|--------|-------|
| Expert | 90-100% |
| Proficient | 70-89% |
| Learning | 50-69% |
| Getting started | 0-49% |

Your rating: **{{rating}}**

### Breakdown

| Area | Correct | Total |
|------|---------|-------|
| {{area_1}} | {{n}} | {{m}} |
| {{area_2}} | {{n}} | {{m}} |

### Questions to Revisit

- Question {{n}}: {{brief description}} — see `{{file_path}}`

### Recommended Next Steps

- {{actionable suggestion based on weak areas}}
```

## Rating Thresholds

| Percentage | Rating | Message |
|------------|--------|---------|
| 90-100% | Expert | Strong understanding of this codebase |
| 70-89% | Proficient | Good grasp with some gaps to explore |
| 50-69% | Learning | Solid foundation, review the missed areas |
| 0-49% | Getting started | Focus on the areas listed above |
