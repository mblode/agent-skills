import { green, red } from "../color.js";
import { readState } from "../state.js";

export function status(options) {
  let state;
  try {
    state = readState(options.state);
  } catch (error) {
    console.log(`error: cannot read state file ${options.state}: ${error.message}`);
    return;
  }
  console.log(`Checking ${state.services.length} services on ${state.cluster}...`);
  for (const service of state.services) {
    const paint = service.state === "running" ? green : red;
    console.log(`${service.name.padEnd(10)} ${service.version.padEnd(8)} ${paint(service.state)}`);
  }
}
