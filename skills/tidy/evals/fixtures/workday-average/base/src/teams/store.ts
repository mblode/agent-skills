export interface Team {
  id: string;
  name: string;
  memberIds: string[];
}

const teams = new Map<string, Team>();

export const teamStore = {
  async find(id: string): Promise<Team | undefined> {
    return teams.get(id);
  },
  async save(team: Team): Promise<void> {
    teams.set(team.id, team);
  },
};
