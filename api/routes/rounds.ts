import Router from '@koa/router';
import { CreateRound } from '../interfaces';
import { authenticate, isStaff } from '../middlewares/authentication';
import { JudgeToRound } from '../models/judging/JudgeToRound';
import { Round } from '../models/Round';
import { Song } from '../models/Song';

const roundsRouter = new Router();
roundsRouter.prefix('/api/rounds');

roundsRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    ctx.body = rounds;
});

roundsRouter.post('/:id?', authenticate, isStaff, async (ctx) => {
    const input: CreateRound = ctx.request.body;
    const roundId: string | undefined = ctx.params.id;
    let round: Round;

    if (roundId) {
        round = await Round.findOneOrFail(roundId);
    } else {
        round = new Round();
    }

    round.submissionsStartedAt = input.submissionsStartedAt;
    round.submissionsEndedAt = input.submissionsEndedAt;
    round.judgingStartedAt = input.judgingStartedAt;
    round.judgingEndedAt = input.judgingEndedAt;
    round.resultsAt = input.resultsAt;
    round.judgeToRounds = input.judgeToRounds as JudgeToRound[];
    round.songs = input.songs as Song[];
    await round.save();

    if (!roundId) {
        ctx.status = 201;
    }

    ctx.body = round;
});

export default roundsRouter;
