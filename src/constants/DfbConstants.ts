import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import CompetitionCode from '../enums/CompetitionCode';
import CompetitionType from '../enums/CompetitionType';

export default class DfbConstants {
    public static URL_DEFAULT = "https://www.dfb.de";
    public static COUNTRY = "Germany";
    public static FEDERATION = "DFB - Deutscher Fussball-Bund";
    public static COMPETITIONS: Array<ICompetitionDefault> = [
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.DFB_MALE_A,
            name:"Bundesliga",
            aux: {
                number:"12"
            }
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.DFB_MALE_B,
            name:"2. Bundesliga",
            aux: {
                number:"3"
            }
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.DFB_MALE_C,
            name:"3. Liga",
            aux: {
                number:"4"
            }
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.DFB_FEMALE_A,
            name:"Allianz Frauen-Bundesliga",
            aux: {
                number:"14"
            }
        }
    ];
}