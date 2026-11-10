export interface Member {
  id: string;
  email: string;
  name: string;
}

const members = new Map<string, Member>();

export const memberStore = {
  async find(id: string): Promise<Member | undefined> {
    return members.get(id);
  },
  async save(member: Member): Promise<void> {
    members.set(member.id, member);
  },
};
