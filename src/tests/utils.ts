
import path from 'path';

function externalPath(posixPath:string) {
  if (process.platform === "win32") {
    return path.resolve("D:\\", posixPath);
  } else if (process.platform === "darwin") {
    return path.resolve("/Volumes/SampleExternalHardDrive", posixPath);
  } else {
    throw new Error("Not Implemented");
  }
}

function localPath(posixPath:string) {
  if (process.platform === "win32") {
    return path.resolve("C:\\", posixPath);
  } else if (process.platform === "darwin") {
    return path.resolve("/", posixPath);
  } else {
    throw new Error("Not Implemented");
  }
}

export {
  externalPath,
  localPath,
};
