import ICompetitionDefault from "../interfaces/ICompetitionDefault";

import CompetitionCode from "../enums/CompetitionCode";
import CompetitionType from "../enums/CompetitionType";

export default class FaConstants {
  public static URL_DEFAULT = "https://www.premierleague.com";
  public static COUNTRY = "England";
  public static FEDERATION = "FA - The Football Association";
  public static COMPETITIONS: Array<ICompetitionDefault> = [
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.FA_MALE_A,
      name: "Premier League",
      aux: {
        code: "1"
      }
    }
  ];
}
