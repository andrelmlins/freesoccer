import CompetitionsRfef from '../enum/CompetitionsRfef';
import CompetitionType from '../enum/CompetitionType';

class RfefConstants {
    public static URL_DEFAULT = "http://www.rfef.es/competiciones";
    public static TEMPORADAS = ["2014","2015","2016","2017","2018","2019"]
    public static COMPETITIONS = [
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionsRfef.MALE_A,
            url:"/futbol-masculino",
            number:1,
            name:"La Liga - Primera División",
            years:["2014","2015","2016","2017","2018","2019"]
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionsRfef.MALE_B,
            url:"/futbol-masculino",
            number:2,
            name:"La Liga - Segunda División",
            years:["2014","2015","2016","2017","2018","2019"]
        }
    ];
}

export default RfefConstants;