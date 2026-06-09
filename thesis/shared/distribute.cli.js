#!/usr/bin/env node
import { distributeRqArtifacts } from "./rqOutput.js";

const rq = process.argv[2];
if (!rq) {
  console.error("Usage: node shared/distribute.cli.js <rq1|rq2|rq3|rq4|rq5>");
  process.exit(1);
}
distributeRqArtifacts(rq);
