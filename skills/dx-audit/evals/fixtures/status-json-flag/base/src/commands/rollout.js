import { readState } from "../state.js";

export function rollout(args, options) {
  const [name, tag] = args;
  if (!name || !tag) {
    console.error("heron: rollout needs a service and a tag, for example: heron rollout gateway 4.13.0");
    process.exitCode = 2;
    return;
  }
  let state;
  try {
    state = readState(options.state);
  } catch (error) {
    console.error(`heron: cannot read state file ${options.state}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  const service = state.services.find((entry) => entry.name === name);
  if (!service) {
    const known = state.services.map((entry) => entry.name).join(", ");
    console.error(`heron: no service named "${name}" on ${state.cluster} (known: ${known})`);
    process.exitCode = 1;
    return;
  }
  console.log(`plan: ${name} ${service.version} -> ${tag} across ${service.replicas} replicas`);
}
