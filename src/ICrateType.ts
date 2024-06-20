
export type ICrate ={
  /**
   * @description Name of Crate
   */
  name: string;

  /**
   * @description Filename for crate
   */
  filename: string;

  /**
   *@description Song Pahts
   */
  songPaths: string[];

  /**
   * @description Save locations
   */
  saveLocations?: string[] | null;
  /**
   * Serato folder
   */
  seratoFolder?: string | null;
}


const crate:ICrate = {
  name: "",
  filename: "",
  songPaths: []
}

export type ICrateType = typeof crate;
 