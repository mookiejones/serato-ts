# seratots

Manage Serato Crates Programatically in NodeJS.

## Installing

```
npm install seratots
```

## Usage

```javascript
import seratoTs from "serato-ts";

// List all crates defined by user.
const crates = seratoTs.listCratesSync();
console.log(crates);

// List all song filepaths in a given crate.
const crate = crates[0];
const songs = crate.getSongPathsSync();
console.log(songs);

// Create a crate
const newCrate = new seratoTs.Crate("ProgramaticallyCreatedCrate");
newCrate.addSong("Users/bcollazo/Music/song.mp3");
newCrate.addSong("C:\\Users\\bcollazo\\Music\\second_song.mp3");
newCrate.saveSync();
```

Asynchronous (await-async / promise-based) API:

```javascript
const seratoTs = require("seratoTs");

(async function () {
  const crates = await seratoTs.listCrates();
  const songs = await crates[0].getSongPaths();
  const newCrate = new seratoTs.Crate("ProgramaticallyCreatedCrate");
  newCrate.addSong("Users/bcollazo/Music/song.mp3");
  await newCrate.save();
})();
```

Adding songs from different drives will replicate Serato's behavior
of saving the crate in all drives participating in the crate.

```javascript
const crate = new seratoTs.Crate("MyCrate");
crate.addSong("D:\\Music\\song1.mp3");
crate.addSong("C:\\Users\\bcollazo\\Music\\song2.mp3");
crate.saveSync(); // will save in D:\\_Serato_ and C:\\Users\\bcollazo\\Music\\_Serato_
```

## Notes

seratoTs tries to sanitize crate name before creation. This is to allow crates named 'Some / Name' to be created without giving trouble. It will be created as 'Some - Name' instead.

### Migrating from 1.x to 2.x

- Change `crate.getSongPaths()` to `crate.getSongPathsSync()` or `await crate.getSongPaths()`.
- Change `newCrate.save()` to `newCrate.saveSync()` or `await newCrate.save()`.
