import CompetitionsFff from '../enum/CompetitionsFff';
import CompetitionType from '../enum/CompetitionType';

class FffConstants {
    public static URL_DEFAULT = "https://www.ligue1.com";
    public static COUNTRY = "France";
    public static START_SEASON = 69;
    public static END_SEASON = 102;
    public static COMPETITIONS = [
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionsFff.MALE_A,
            name:"Ligue 1"
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionsFff.MALE_B,
            name:"Ligue 2"
        }
    ];
}

export default FffConstants;