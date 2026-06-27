// Defect: three static, mutually exclusive options hidden behind a select that
// requires a click to open and compare.
export function VisibilityField({ value, onChange }) {
  return (
    <label>
      Visibility
      <Select value={value} onChange={onChange}>
        <option value="private">Private</option>
        <option value="team">Team</option>
        <option value="public">Public</option>
      </Select>
    </label>
  );
}
