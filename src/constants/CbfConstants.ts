import CompetitionsCbf from '../enum/CompetitionsCbf';
import CompetitionType from '../enum/CompetitionType';

class CbfConstants {
    public static URL_DEFAULT = "https://www.cbf.com.br/futebol-brasileiro/competicoes";
    public static COUNTRY = "Brazil";
    public static COMPETITIONS = [
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionsCbf.MALE_A,
            name:"Campeonato Brasileiro De Futebol - Série A",
            years:["2012","2013","2014","2015","2016","2017","2018"]
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionsCbf.MALE_B,
            name:"Campeonato Brasileiro De Futebol - Série B",
            years:["2012","2013","2014","2015","2016","2017","2018"]
        }
    ];
}

export default CbfConstants;