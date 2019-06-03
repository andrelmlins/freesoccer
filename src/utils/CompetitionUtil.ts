import CompetitionCode from "../enums/CompetitionCode";
import Helpers from "../utils/Helpers";

import CbfConstants from "../constants/CbfConstants";
import FffConstants from "../constants/FffConstants";
import FigcConstants from "../constants/FigcConstants";
import FpfConstants from "../constants/FpfConstants";
import RfefConstants from "../constants/RfefConstants";
import DfbConstants from "../constants/DfbConstants";
import FaConstants from "../constants/FaConstants";

import CbfScraping from "../scraping/CbfScraping";
import FffScraping from "../scraping/FffScraping";
import FigcScraping from "../scraping/FigcScraping";
import FpfScraping from "../scraping/FpfScraping";
import RfefScraping from "../scraping/RfefScraping";
import DfbScraping from "../scraping/DfbScraping";
import FaScraping from "../scraping/FaScraping";
import ICompetitionDefault from "../interfaces/ICompetitionDefault";

export default class CompetitionUtil {

  public static getFederation(competition: String): any {
    switch(competition){
      case "CBF": return { Constant: CbfConstants, Scraping: CbfScraping };
      case "FFF": return { Constant: FffConstants, Scraping: FffScraping };
      case "FIGC": return { Constant: FigcConstants, Scraping: FigcScraping };
      case "FPF": return { Constant: FpfConstants, Scraping: FpfScraping };
      case "RFEF": return { Constant: RfefConstants, Scraping: RfefScraping };
      case "DFB": return { Constant: DfbConstants, Scraping: DfbScraping };
      case "FA": return { Constant: FaConstants, Scraping: FaScraping };
      default: return null;
    }
  }

  public static getCompetition(competitions: Array<ICompetitionDefault>, code: String): ICompetitionDefault {
    for (let i = 0; i < competitions.length; i++) {
      if (competitions[i].code == code) return competitions[i];
    }
    throw new Error("Competition does not exist");
  }

  public static async runScraping(competitionName: String, lastYear: Boolean): Promise<void> {
    const competitionEnum = Helpers.getEnumKeyByEnumValue(CompetitionCode, competitionName);

    if(competitionEnum) {
      const federation = CompetitionUtil.getFederation(competitionEnum.split("_")[0]);
      const competition = CompetitionUtil.getCompetition(federation.Constant.COMPETITIONS, competitionName);
      const scraping = new federation.Scraping(lastYear);
      await scraping.run(competition);
    } else {
      throw new Error("Competition does not exist");
    }

    process.exit();
  }
}
