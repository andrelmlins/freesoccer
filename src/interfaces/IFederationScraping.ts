import ICompetitionDefault from './ICompetitionDefault';

interface IFederationScraping {
    lastYear:boolean;
    run(competition: ICompetitionDefault): void;
}

export default IFederationScraping;