// Three static options shown at once as radios, so the user compares without
// opening a menu. Each option carries the consequence of the choice.
export function VisibilityField({ value, onChange }) {
  return (
    <RadioGroup
      label="Visibility"
      value={value}
      onChange={onChange}
      options={[
        { value: 'private', label: 'Private', hint: 'Only you' },
        { value: 'team', label: 'Team', hint: 'Everyone in your team' },
        { value: 'public', label: 'Public', hint: 'Anyone with the link' },
      ]}
    />
  );
}
