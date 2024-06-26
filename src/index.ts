import * as fs from "fs";
import util from "util";
import os from "os";
import path from "path";
import Crate, { ICrateData } from "./Crate";
import { ICrateType } from "./ICrateType";
// Singleton for Serato Folder Path (I doubt it'll change during runtime)
const PLATFORM_DEFAULT_SERATO_FOLDER = path.join(
  os.homedir(),
  "Music",
  "_Serato_",
);

function getSubcratesFolder(seratoFolder: string = "") {
  return path.join(seratoFolder, "SubCrates");
}

/**
 * For each Serato Folder location, collect crates and returns a list
 * of all of these.
 */
function listCratesSync(seratoFolders = [PLATFORM_DEFAULT_SERATO_FOLDER]) {
  const allCrates: Crate[] = [];
  seratoFolders.forEach((seratoFolder) => {
    const subcratesFolder = getSubcratesFolder(seratoFolder);
    const crates = fs.readdirSync(subcratesFolder).map((x) => {
      const name = path.basename(x, ".crate");
      return new Crate(name, seratoFolder);
    });
    allCrates.push(...crates);
  });
  return allCrates;
}

async function listCrates(seratoFolders = [PLATFORM_DEFAULT_SERATO_FOLDER]) {
  const allCrates: Crate[] = [];
  for (const seratoFolder of seratoFolders) {
    const subcratesFolder = getSubcratesFolder(seratoFolder);
    const files = await util.promisify(fs.readdir)(subcratesFolder);
    const crates = files.map((x) => {
      const name = path.basename(x, ".crate");
      return new Crate(name, seratoFolder);
    });
    allCrates.push(...crates);
  }
  return allCrates;
}

export { ICrateData, ICrateType, Crate, listCrates, listCratesSync };
const Serato = { Crate, listCrates, listCratesSync };
export default Serato;
