// Every reachable state is designed: loading, error with a retry, empty with a
// first action, and populated. Input and context are preserved across each.
export function MemberList({ members, status, onRetry, onInvite }) {
  if (status === 'loading') return <MemberListSkeleton />;

  if (status === 'error') {
    return (
      <EmptyState
        title="Could not load members"
        description="Check your connection and try again."
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    );
  }

  if (members.length === 0) {
    return (
      <EmptyState
        title="No members yet"
        description="Invite a teammate to start collaborating."
        action={<Button onClick={onInvite}>Invite member</Button>}
      />
    );
  }

  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>{member.name}</li>
      ))}
    </ul>
  );
}
