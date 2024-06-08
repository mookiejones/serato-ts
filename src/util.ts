const path = require("path");

const INVALID_CHARACTERS_REGEX = /[^A-Za-z0-9_ ]/gi;

const parse = function (contents:any) {
  // Find all 'ptrk' ocurrances
  const indices:any[] = [];
  for (let i = 0; i < contents.length; i++) {
    if (contents.slice(i, i + 4) === "ptrk") {
      indices.push(i);
    }
  }

  // Content in between these indices are the songs
  const songs:any[] = [];
  indices.forEach((value, index) => {
    const start = value + 9; // + 9 to skip the 'ptrk' itself and the bytes for size
    const isLast = index === indices.length - 1;
    const end = isLast ? contents.length : indices[index + 1] - 8; // -8 to remove 'otrk' and size bytes

    let filepath = contents.slice(start, end);
    filepath = filepath.replace(/\0/g, ""); // remove null-termination bytes
    songs.push(path.resolve("/", filepath));
  });
  return songs;
};

const toSeratoString = function (value:string) {
  return "\0" + value.split("").join("\0");
};

const intToHexbin = function (number:number) {
  const hex = number.toString(16).padStart(8, "0");
  let ret = "";
  for (let idx of [0, 2, 4, 6]) {
    let bytestr = hex.slice(idx, idx + 2);
    ret += String.fromCodePoint(parseInt(bytestr, 16));
  }
  return ret;
};

const sanitizeFilename = function (filename:string) {
  return filename.replace(INVALID_CHARACTERS_REGEX, "-");
};

/** Second param for dependency injection testing */
function removeDriveRoot(absoluteSongPath:string, platformParam?:NodeJS.Platform|null ) {
  const platform = platformParam || process.platform;
  if (platform === "win32") {
    return absoluteSongPath.substring(3); // remove the C: or D: or ...
  } else {
    if (isFromExternalDrive(absoluteSongPath, platform)) {
      const externalDrive = selectExternalRoot(absoluteSongPath, platform);
      return absoluteSongPath.substring(externalDrive.length);
    } else {
      return absoluteSongPath;
    }
  }
}

/**
 * Assumes input is an external path
 * @returns external volume prefix string for external drive paths
 *
 * e.g.
 *  /Volumes/SampleDrive/Some/Path.mp3 => /Volumes/SampleDrive
 *  D:\\Folder\\song.mp3 => D:\\
 */
function selectExternalRoot(externalSongPath:string, platformParam:NodeJS.Platform|null = null) {
  const platform = platformParam || process.platform;
  if (platform === "win32") {
    return path.parse(externalSongPath).root;
  } else {
    return externalSongPath.split("/").slice(0, 3).join("/");
  }
}

function isFromExternalDrive(songPath:string, platformParam?:NodeJS.Platform|null ) {
  const platform = platformParam || process.platform;
  return (
    (platform === "win32" && !songPath.startsWith("C:\\")) ||
    (platform === "darwin" && songPath.startsWith("/Volumes"))
  );
}

 export  {
  parse,
  removeDriveRoot,
  toSeratoString,
  intToHexbin,
  sanitizeFilename,
  selectExternalRoot,
  isFromExternalDrive,
};
