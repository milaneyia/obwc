import Router from '@koa/router';
import validator from 'validator';
import { JUDGING_TYPE } from '../../shared/models';
import cache from '../cache';
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

roundsRouter.get('/:id/results', simpleAuthenticate, async (ctx) => {
    const id = validator.toInt(ctx.params.id);
    const judgingType = ctx.query.type ? validator.toInt(ctx.query.type.toString()) : JUDGING_TYPE.Mappers;
    const scope: ResultsScope = ctx.state?.user?.isStaff ? ResultsScope.Staff : ResultsScope.User;
    const cacheKey = 'results' + id + scope + judgingType;
    const cached = cache.get(cacheKey);

    if (cached) {
        return ctx.body = cached;
    }

    const [round, criterias] = await Promise.all([
        Round.findResults(id, judgingType, scope),
        Criteria.find({
            judgingTypeId: judgingType,
        }),
    ]);
    const judges = round?.judgeToRounds.map(j => j.user);
    const { teamsScores, judgesCorrel } = await calculateScores(round);

    if (round && new Date(round.resultsAt) < new Date()) {
        cache.set(cacheKey, {
            criterias,
            round,
            judges,
            teamsScores,
            judgesCorrel,
        });
    }

    return ctx.body = {
        criterias,
        round,
        judges,
        teamsScores,
        judgesCorrel,
    };
});

export default roundsRouter;
