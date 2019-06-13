import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import CompetitionCode from '../enums/CompetitionCode';
import CompetitionType from '../enums/CompetitionType';

export default class RfefConstants {
  public static URL_DEFAULT = 'http://www.rfef.es/competiciones';
  public static COUNTRY = 'Spain';
  public static FEDERATION = 'RFEF - Real Federación Española de Fútbol';
  public static COMPETITIONS: Array<ICompetitionDefault> = [
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.RFEF_MALE_A,
      name: 'La Liga - Primera División',
      years: ['2014', '2015', '2016', '2017', '2018', '2019'],
      aux: {
        url: '/futbol-masculino',
        name: 'Campeonato Nacional de Liga de Primera División'
      }
    },
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.RFEF_MALE_B,
      name: 'La Liga - Segunda División',
      years: ['2014', '2015', '2016', '2017', '2018', '2019'],
      aux: {
        url: '/futbol-masculino',
        name: 'Campeonato Nacional de Liga de Segunda División'
      }
    },
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.RFEF_FEMALE_A,
      name: 'Primera División Femenina',
      years: ['2014', '2015', '2016', '2017', '2018', '2019'],
      aux: {
        url: '/futbol-femenino',
        name: 'Primera División Femenina'
      }
    }
  ];
}
