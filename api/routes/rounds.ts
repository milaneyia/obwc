import Router from '@koa/router';
import validator from 'validator';
import { JUDGING_TYPE } from '../../shared/models';
import { calculateScores } from '../helpers/results';
import { simpleAuthenticate } from '../middlewares/authentication';
import { Criteria } from '../models/judging/Criteria';
import { ResultsScope, Round } from '../models/Round';

const roundsRouter = new Router();
roundsRouter.prefix('/api/rounds');

roundsRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    ctx.body = rounds;
});

roundsRouter.get('/:id/results/:judgingType', simpleAuthenticate, async (ctx) => {
    const id = validator.toInt(ctx.params.id);
    const judgingType = ctx.params.judgingType ? validator.toInt(ctx.params.judgingType) : JUDGING_TYPE.Mappers;
    const scope: ResultsScope = ctx.state?.user?.isStaff ? ResultsScope.Staff : ResultsScope.User;

    const [round, criterias] = await Promise.all([
        Round.findResults(id, judgingType, scope),
        Criteria.find({
            judgingTypeId: judgingType,
        }),
    ]);
    const judges = round?.judgeToRounds.map(j => j.user);
    const { teamsScores, judgesCorrel } = await calculateScores(round);

    return ctx.body = {
        criterias,
        round,
        judges,
        teamsScores,
        judgesCorrel,
    };
});

export default roundsRouter;
