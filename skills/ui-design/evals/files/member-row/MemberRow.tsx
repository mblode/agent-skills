import type { Member } from "./member";

type Props = {
  member: Member;
  onRemove: (id: string) => void;
  onChangeRole: (id: string) => void;
};

function daysSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / 86_400_000);
}

export function MemberRow({ member, onRemove, onChangeRole }: Props) {
  return (
    <li className="flex h-16 items-center gap-4 border-b border-border px-4">
      <img src={member.avatarUrl} alt="" className="size-10 rounded-full" />

      <div className="flex flex-col">
        <span className="whitespace-nowrap text-base font-medium">{member.displayName}</span>
        <span className="whitespace-nowrap text-sm text-muted-foreground">{member.email}</span>
      </div>

      <span className="w-20 rounded-full bg-muted px-2 py-1 text-center text-xs capitalize">
        {member.role}
      </span>

      <div className="flex gap-1">
        {member.teams.map((team) => (
          <span key={team} className="whitespace-nowrap rounded bg-muted px-2 py-0.5 text-xs">
            {team}
          </span>
        ))}
      </div>

      <span className="w-8 text-right text-sm tabular-nums">{member.openTasks}</span>

      <span className="text-sm text-muted-foreground">
        Active {daysSince(member.lastActiveAt as string)} days ago
      </span>

      <div className="ml-auto flex gap-2">
        <button type="button" className="h-9 rounded-control border border-border px-3 text-sm" onClick={() => onChangeRole(member.id)}>
          Change role
        </button>
        <button type="button" className="h-9 rounded-control border border-border px-3 text-sm" onClick={() => onRemove(member.id)}>
          Remove
        </button>
      </div>
    </li>
  );
}
