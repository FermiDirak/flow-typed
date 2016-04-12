// @flow

import {fs, path} from "../lib/node.js";

import {versionToString} from "../lib/semver.js";
import {getLocalLibDefs, getLocalLibDefFlowVersions} from "../lib/libDef.js";

const P = Promise;

export const name = "validate-defs";
export const description =
  "Validates the structure of the definitions in the local repo.";
export async function run(args: {}): Promise<number> {
  const validationErrors = new Map();
  const localLibDefs = await getLocalLibDefs(validationErrors);
  const localLibDefFlowVersions = await getLocalLibDefFlowVersions(
    localLibDefs,
    validationErrors
  );
  console.log(" ");

  validationErrors.forEach((errors, pkgNameVersion) => {
    console.log("Found some problems with %s:", pkgNameVersion);
    errors.forEach((err) => console.log("  * " + err));
    console.log("");
  });

  if (validationErrors.size === 0) {
    console.log(
      `All library definitions are named and structured correctedly. ` +
      `(Found ${localLibDefFlowVersions.length})`
    );
    return 0;
  }

  return 1;
};