import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import CompetitionCode from '../enums/CompetitionCode';
import CompetitionType from '../enums/CompetitionType';

export default class FpfConstants {
    public static URL_DEFAULT = "http://ligaportugal.pt/en/liga";
    public static COUNTRY = "Portugal";
    public static FEDERATION = "FPF - Federação Portuguesa de Futebol";
    public static COMPETITIONS: Array<ICompetitionDefault> = [
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.FPF_MALE_A,
            name:"Primeira Liga - Liga NOS",
            years:["2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"],
            aux:{
                urls:["ligasagres","ligazonsagres","ligazonsagres","ligazonsagres","ligazonsagres","liganos","liganos","liganos","liganos","liganos"]
            }
        },
        {
            type:CompetitionType.LEAGUE,
            code:CompetitionCode.FPF_MALE_B,
            name:"Segunda Liga - Ledman LigaPro",
            years:["2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"],
            aux:{
                urls:["ligavitalis","ligaorangina","ligaorangina","segundaliga","liga2cabovisao","segundaliga","ledmanligapro","ledmanligapro","ledmanligapro","ledmanligapro"]
            }
        }
    ];
}