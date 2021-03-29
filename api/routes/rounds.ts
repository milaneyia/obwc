import Router from '@koa/router';
import { Round } from '../models/Round';

const roundsRouter = new Router();
roundsRouter.prefix('/api/rounds');

roundsRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    ctx.body = rounds;
});

roundsRouter.post('/', async (ctx) => {
    const input = ctx.request.body;
    const round = new Round();
    round.submissionsStartedAt = input.submissionsStartedAt;
    round.submissionsEndedAt = input.submissionsEndedAt;
    round.judgingStartedAt = input.judgingStartedAt;
    round.judgingEndedAt = input.judgingEndedAt;
    round.resultsAt = input.resultsAt;
    round.judges = input.judges;
    round.songs = input.songs;
    await round.save();

    ctx.status = 201;
    ctx.body = round;
});

export default roundsRouter;
