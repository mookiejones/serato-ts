export type ICrateType = {
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
};
