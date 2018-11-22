import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import CompetitionCode from '../enums/CompetitionCode';
import CompetitionType from '../enums/CompetitionType';

class DfbConstants {
    public static URL_DEFAULT = "https://www.dfb.de";
    public static COUNTRY = "Germany";
    public static COMPETITIONS: Array<ICompetitionDefault> = [
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.DBC_MALE_A,
            name:"Bundesliga",
            aux: {
                number:"12"
            }
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.DBC_MALE_B,
            name:"2. Bundesliga",
            aux: {
                number:"3"
            }
        }
    ];
}

export default DfbConstants;