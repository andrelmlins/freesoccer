import { Stage, IStage } from '@schemas/Stage';

class StageRepository {
  public async save(stage: IStage): Promise<IStage | null> {
    const stageOld = await Stage.findOne({ hash: stage.hash });
    if (stageOld) {
      const stageAux: any = stage.toObject();
      delete stageAux._id;

      await Stage.updateOne({ _id: stageOld._id }, stageAux);

      const stageResult = await Stage.findOne({ hash: stage.hash });
      return stageResult;
    }
    const stageResult = await Stage.create(stage);
    return stageResult;
  }
}

export default StageRepository;
