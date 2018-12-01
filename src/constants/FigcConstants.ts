import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import CompetitionCode from '../enums/CompetitionCode';
import CompetitionType from '../enums/CompetitionType';

export default class FigcConstants {
    public static URL_DEFAULT = "http://www.legaseriea.it";
    public static COUNTRY = "Italy";
    public static FEDERATION = "FIGC - Federazione Italiana Giuoco Calcio";
    public static COMPETITIONS: Array<ICompetitionDefault> = [
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.FIGC_MALE_A,
            name:"Serie A - Italiano",
            years:["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"],
            aux: {
                url:"http://www.legaseriea.it/en/serie-a"
            }
        },
        
        {
            type:CompetitionType.ELIMINATION,
            code:CompetitionCode.FIGC_CUP_MALE,
            name:"Serie A - Italiano",
            years:["2015","2016","2017","2018"],
            aux: {
                url:"http://www.legaseriea.it/it/coppa-italia"
            }
        }
    ];
}