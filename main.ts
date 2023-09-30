/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

const RunningOnDeploy = !!Deno.env.get("DENO_REGION")
console.log(`Running on Deploy? `, RunningOnDeploy)

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
await start(manifest);
