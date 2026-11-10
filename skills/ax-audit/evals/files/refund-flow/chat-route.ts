import { runAgentLoop } from "./agent-loop";
import { getSession } from "./auth";
import { issueRefund } from "./refund-executor";

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ ok: false, error: { code: "UNAUTHENTICATED" } }, { status: 401 });
  }
  const { messages } = await request.json();

  const stream = runAgentLoop({
    messages,
    signal: request.signal,
    tools: {
      issue_refund: (input, { signal }) => issueRefund(input, session, signal),
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
}
