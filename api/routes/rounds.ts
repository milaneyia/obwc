import Router from '@koa/router';
import { authenticate, isStaff } from '../middlewares/authentication';
import { Round } from '../models/Round';

const roundsRouter = new Router();
roundsRouter.prefix('/api/rounds');

roundsRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    ctx.body = rounds;
});

roundsRouter.post('/', authenticate, isStaff, async (ctx) => {
    const input: Round = ctx.request.body;
    const round = new Round();
    round.submissionsStartedAt = input.submissionsStartedAt;
    round.submissionsEndedAt = input.submissionsEndedAt;
    round.judgingStartedAt = input.judgingStartedAt;
    round.judgingEndedAt = input.judgingEndedAt;
    round.resultsAt = input.resultsAt;
    round.judgeToRounds = input.judgeToRounds;
    round.songs = input.songs;
    await round.save();

    ctx.status = 201;
    ctx.body = round;
});

export default roundsRouter;
