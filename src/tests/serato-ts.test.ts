import os from 'os';
import path from 'path';
import * as fs from 'fs';
import {listCratesSync,listCrates,Crate} from '../index'; 
const { localPath, externalPath } = require("./utils");

/**
 * These tests create a folder in the repo root called "_TestSerato_"
 * and populates it with 1 crate before each test. Tests usually use this
 * instead of the default ones.
 */
const TEST_SERATO_FOLDER = path.join(".", "_TestSerato_");
const TEST_SUBCRATES_FOLDER = path.join(TEST_SERATO_FOLDER, "Subcrates");

function safelyDeleteSeratoFolder(folder:string) {
  const subCrateFolder = path.join(folder, "Subcrates");
  const files = fs.readdirSync(subCrateFolder);
  for (let filename of files) {
    fs.unlinkSync(path.join(subCrateFolder, filename));
  }
  fs.rmdirSync(subCrateFolder);
  fs.rmdirSync(folder);
}

beforeEach(() => {
  fs.mkdirSync(TEST_SERATO_FOLDER);
  fs.mkdirSync(TEST_SUBCRATES_FOLDER);
  fs.copyFileSync(
    path.join(".", "Serato Demo Tracks.crate"),
    path.join(TEST_SUBCRATES_FOLDER, "Serato Demo Tracks.crate")
  );
});

afterEach(() => {
  safelyDeleteSeratoFolder(TEST_SERATO_FOLDER);
});

// ===== List crates
test("list crates in sync", () => {
  const crates = listCratesSync([TEST_SERATO_FOLDER]);
  expect(crates.length).toBe(1);
});

test("async list crates and sync song paths", async () => {
  const crates = await listCrates([TEST_SERATO_FOLDER]);
  expect(crates.length).toBe(1);

  const crate = crates[0];
  const songs = crate.getSongPathsSync();

  const baseFolder = localPath(
    "/Users/bcollazo/Music/_Serato_/Imported/Serato Demo Tracks"
  );
  expect(crate.name).toBe("Serato Demo Tracks");
  expect(songs).toEqual([
    path.resolve(baseFolder, "01 - House Track Serato House Starter Pack.mp3"),
    path.resolve(baseFolder, "02 - House Track Serato House Starter Pack.mp3"),
    path.resolve(baseFolder, "03 - House Track Serato House Starter Pack.mp3"),
    path.resolve(
      baseFolder,
      "04 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
    path.resolve(
      baseFolder,
      "05 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
    path.resolve(
      baseFolder,
      "06 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
  ]);
});

// ===== Save locations
test("adding songs from a drive, saves it in drive", () => {
  const crate = new Crate("TestDriveCrate");
  crate.addSong(externalPath("TestFolder/song1.mp3"));
  crate.addSong(externalPath("song2.mp3"));

  const locations = crate.getSaveLocations();
  expect(locations.length).toBe(1);
  expect(locations[0]).toBe(externalPath("_Serato_"));
});

test("adding songs from a drive and local disk, saves it in both", () => {
  const crate = new Crate("TestDriveCrate");
  crate.addSong(externalPath("TestFolder/song1.mp3"));
  crate.addSong(localPath("/Users/bcollazo/Music/song2.mp3"));

  const locations = crate.getSaveLocations();
  expect(locations.length).toBe(2);
  expect(locations).toContain(externalPath("_Serato_"));
  expect(locations).toContain(path.join(os.homedir(), "Music", "_Serato_"));
});

test("adding songs from local disk only, saves it Music folder _Serato_", () => {
  const crate = new Crate("TestDriveCrate");
  crate.addSong("C:\\Users\\bcollazo\\Music\\folder\\song1.mp3");
  crate.addSong("C:\\Users\\bcollazo\\Music\\song2.mp3");

  const locations = crate.getSaveLocations();
  expect(locations.length).toBe(1);
  expect(locations).toContain(path.join(os.homedir(), "Music", "_Serato_"));
});

test("new empty crate saves it Music folder _Serato_", () => {
  const crate = new Crate("TestDriveCrate");

  const locations = crate.getSaveLocations();
  expect(locations.length).toBe(1);
  expect(locations).toContain(path.join(os.homedir(), "Music", "_Serato_"));
});

test("if specify serato folder at creation, saving will use that one. no matter contents", () => {
  const crate = new Crate("TestDriveCrate", TEST_SERATO_FOLDER);
  crate.addSong("D:\\TestFolder\\song1.mp3");
  crate.addSong("C:\\Users\\bcollazo\\Music\\song2.mp3");

  const locations = crate.getSaveLocations();
  expect(locations.length).toBe(1);
  expect(locations).toContain(TEST_SERATO_FOLDER);
});

// ===== Save songs. Can mock and listing crates matches.
test("IntegrationTest: create new crate, add songs, list crates, list songs", () => {
  const crate = new Crate(
    "ProgramaticallyCreatedCrate",
    TEST_SERATO_FOLDER
  );
  crate.addSong("C:\\Users\\bcollazo\\Music\\second_song.mp3");
  crate.saveSync(); // saves to C:\\

  const crates = listCratesSync([TEST_SERATO_FOLDER]);
  expect(crates.length).toBe(2);
  const songPaths = crate.getSongPathsSync();
  expect(songPaths.length).toBe(1);
});

test("IntegrationTest: async mac create new crate, add songs, list crates, list songs", async () => {
  const crate = new Crate(
    "ProgramaticallyCreatedCrate",
    TEST_SERATO_FOLDER
  );
  crate.addSong("Users/bcollazo/Music/song.mp3");
  crate.addSong("/Users/bcollazo/Music/second_song.mp3");
  await crate.save();

  const crates = await listCrates([TEST_SERATO_FOLDER]);
  expect(crates.length).toBe(2);
  const songPaths = await crate.getSongPaths();
  expect(songPaths.length).toBe(2);
});

// ===== Read song lists
test("read crate info", () => {
  const crate = listCratesSync([TEST_SERATO_FOLDER])[0];
  const songs = crate.getSongPathsSync();

  const baseFolder = localPath(
    "/Users/bcollazo/Music/_Serato_/Imported/Serato Demo Tracks"
  );
  expect(crate.name).toBe("Serato Demo Tracks");
  expect(songs).toEqual([
    path.resolve(baseFolder, "01 - House Track Serato House Starter Pack.mp3"),
    path.resolve(baseFolder, "02 - House Track Serato House Starter Pack.mp3"),
    path.resolve(baseFolder, "03 - House Track Serato House Starter Pack.mp3"),
    path.resolve(
      baseFolder,
      "04 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
    path.resolve(
      baseFolder,
      "05 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
    path.resolve(
      baseFolder,
      "06 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
  ]);
});

test("async read song paths", async () => {
  const crate = (await listCrates([TEST_SERATO_FOLDER]))[0];
  const songs = await crate.getSongPaths();

  const baseFolder = localPath(
    "/Users/bcollazo/Music/_Serato_/Imported/Serato Demo Tracks"
  );
  expect(crate.name).toBe("Serato Demo Tracks");
  expect(songs).toEqual([
    path.resolve(baseFolder, "01 - House Track Serato House Starter Pack.mp3"),
    path.resolve(baseFolder, "02 - House Track Serato House Starter Pack.mp3"),
    path.resolve(baseFolder, "03 - House Track Serato House Starter Pack.mp3"),
    path.resolve(
      baseFolder,
      "04 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
    path.resolve(
      baseFolder,
      "05 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
    path.resolve(
      baseFolder,
      "06 - Hip Hop Track Serato Hip Hop Starter Pack.mp3"
    ),
  ]);
});

test("weird names dont break crate creation", async () => {
  const newCrate = new Crate(
    "2000-2010 HipHáp / Reggaeton!?",
    TEST_SERATO_FOLDER
  );
  await newCrate.save();
});

// test("async create when Serato folder doesnt exist", async () => {
//   const newCrate = new seratojs.Crate(
//     "TestCrateSeratoFolderNonExistent",
//     NON_EXISTENT_SERATO_FOLDER
//   );
//   await newCrate.save();
//   safelyDeleteSeratoFolder(NON_EXISTENT_SERATO_FOLDER);
// });

// test("create when Serato folder doesnt exist", async () => {
//   const newCrate = new seratojs.Crate(
//     "TestCrateSeratoFolderNonExistent",
//     NON_EXISTENT_SERATO_FOLDER
//   );
//   newCrate.saveSync();
//   safelyDeleteSeratoFolder(NON_EXISTENT_SERATO_FOLDER);
// });
