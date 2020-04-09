import { Stage, IStage } from '../schemas/Stage';

export default class StageRepository {
  public async save(stage: IStage): Promise<IStage | null> {
    let stageOld = await Stage.findOne({ hash: stage.hash });
    if (stageOld) {
      let stageAux: any = stage.toObject();
      delete stageAux._id;

      await Stage.updateOne({ _id: stageOld._id }, stageAux);

      let stageResult = await Stage.findOne({ hash: stage.hash });
      return stageResult;
    } else {
      let stageResult = await Stage.create(stage);
      return stageResult;
    }
  }
}
