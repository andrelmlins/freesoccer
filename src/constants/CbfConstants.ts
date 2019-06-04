import ICompetitionDefault from "../interfaces/ICompetitionDefault";

import CompetitionCode from "../enums/CompetitionCode";
import CompetitionType from "../enums/CompetitionType";

export default class CbfConstants {
  public static URL_DEFAULT = "https://www.cbf.com.br/futebol-brasileiro/competicoes";
  public static COUNTRY = "Brazil";
  public static FEDERATION = "CBF - Confederação Brasileira de Futebol";
  public static COMPETITIONS: Array<ICompetitionDefault> = [
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.CBF_MALE_A,
      name: "Campeonato Brasileiro De Futebol - Série A",
      years: ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
    },
    {
      type: CompetitionType.LEAGUE,
      code: CompetitionCode.CBF_MALE_B,
      name: "Campeonato Brasileiro De Futebol - Série B",
      years: ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_MALE,
      name: "Copa Do Brasil De Futebol",
      years: ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_MALE_SUB20,
      name: "Copa do Brasil de Futebol Sub-20",
      years: ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_MALE_SUB17,
      name: "Copa do Brasil de Futebol Sub-17",
      years: ["2013", "2014", "2015", "2016", "2017", "2018", "2019"]
    },
    {
      type: CompetitionType.ELIMINATION,
      code: CompetitionCode.CBF_CUP_GREEN,
      name: "Copa Verde",
      years: ["2014", "2015", "2016", "2017", "2018", "2019"]
    }
  ];
}
