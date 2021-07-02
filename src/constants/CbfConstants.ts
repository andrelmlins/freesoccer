import ICompetitionDefault from '@interfaces/ICompetitionDefault';

import CompetitionCode from '@enums/CompetitionCode';
import CompetitionType from '@enums/CompetitionType';

class CbfConstants {
  public static URL_DEFAULT = 'https://www.cbf.com.br/futebol-brasileiro/competicoes';
  public static COUNTRY = 'Brazil';
  public static FEDERATION = 'CBF - Confederação Brasileira de Futebol';
  public static COMPETITIONS: Array<ICompetitionDefault> = [
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.CBF_MALE_A,
      name: 'Campeonato Brasileiro De Futebol - Série A',
    },
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.CBF_MALE_B,
      name: 'Campeonato Brasileiro De Futebol - Série B',
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_MALE,
      name: 'Copa Do Brasil De Futebol',
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_MALE_SUB20,
      name: 'Copa do Brasil de Futebol Sub-20',
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_MALE_SUB17,
      name: 'Copa do Brasil de Futebol Sub-17',
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_GREEN,
      name: 'Copa Verde',
    },
  ];
}

export default CbfConstants;
