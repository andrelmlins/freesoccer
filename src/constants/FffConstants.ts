import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import CompetitionCode from '../enums/CompetitionCode';
import CompetitionType from '../enums/CompetitionType';

export default class FffConstants {
  public static URL_DEFAULT = 'https://www.ligue1.com';
  public static COUNTRY = 'France';
  public static FEDERATION = 'FFF - Fédération Française de Football';
  public static START_SEASON = 69;
  public static COMPETITIONS: Array<ICompetitionDefault> = [
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.FFF_MALE_A,
      name: 'Ligue 1'
    },
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.FFF_MALE_B,
      name: 'Ligue 2'
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.FFF_CUP_MALE,
      name: 'Coupe de La Ligue',
      aux: {
        url: 'coupeLigue'
      }
    }
  ];
}
