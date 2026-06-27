// Defect: only the populated success state is designed. Loading shows nothing,
// an empty list renders a bare string with no next action, and a failed fetch
// is not handled at all.
export function MemberList({ members }) {
  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>{member.name}</li>
      ))}
    </ul>
  );
}
