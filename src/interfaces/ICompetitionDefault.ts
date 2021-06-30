import CompetitionCode from '@enums/CompetitionCode';
import CompetitionType from '@enums/CompetitionType';

interface ICompetitionDefault {
  name: string;
  code: CompetitionCode;
  type: CompetitionType;
  years?: Array<any>;
  aux?: any;
}

export default ICompetitionDefault;
