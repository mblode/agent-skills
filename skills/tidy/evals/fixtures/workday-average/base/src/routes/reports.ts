import { entryStore } from "../entries/store.ts";
import { weeklyReport } from "../reports/weekly.ts";
import { teamStore } from "../teams/store.ts";
import { makePeriod } from "../time/period.ts";

export interface ReportQuery {
  from?: string;
  to?: string;
}

export interface RouteResult {
  status: number;
  body: unknown;
}

export async function getWeeklyReport(teamId: string, query: ReportQuery): Promise<RouteResult> {
  const team = await teamStore.find(teamId);
  if (!team) return { status: 404, body: { error: "team not found" } };
  try {
    const week = makePeriod(query.from ?? "", query.to ?? "");
    const entries = await entryStore.forTeam(team.memberIds, week);
    return { status: 200, body: weeklyReport(entries, week) };
  } catch (error) {
    if (error instanceof RangeError) return { status: 422, body: { error: error.message } };
    throw error;
  }
}
