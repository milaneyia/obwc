import Router from '@koa/router';
import validator from 'validator';
import { JUDGING_TYPE } from '../../shared/models';
import { getRoundResults } from '../helpers/results';
import { simpleAuthenticate } from '../middlewares/authentication';
import { ResultsScope, Round } from '../models/Round';

const roundsRouter = new Router();
roundsRouter.prefix('/api/rounds');

roundsRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    ctx.body = rounds;
});

roundsRouter.get('/:id/results', simpleAuthenticate, async ctx => {
    const id = validator.toInt(ctx.params.id);
    const judgingType = ctx.query.type ? validator.toInt(ctx.query.type.toString()) : JUDGING_TYPE.Mappers;
    const scope: ResultsScope = ctx.state?.user?.isStaff ? ResultsScope.Staff : ResultsScope.User;

    return ctx.body = await getRoundResults(id, judgingType, scope);
});

export default roundsRouter;
