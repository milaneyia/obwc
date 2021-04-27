import Router from '@koa/router';
import validator from 'validator';
import { Contest } from '../models/Contest';
import { Round } from '../models/Round';

const contestsRouter = new Router();
contestsRouter.prefix('/api/contests');

contestsRouter.get('/', async (ctx) => {
    const contests = await Contest.find();

    ctx.body = contests;
});

contestsRouter.get('/open', async (ctx) => {
    const contests = await Contest.open().getMany();

    ctx.body = contests;
});

contestsRouter.get('/:id/rounds', async (ctx) => {
    const contestId = validator.toInt(ctx.params.id);

    const contest = await Contest.findOneOrFail({ id: contestId });
    const rounds = await Round.find({
        where: {
            contest,
        },
        relations: [
            'judgeToRounds',
            'judgeToRounds.user',
            'judgeToRounds.judgingType',
            'songs',
        ],
    });

    ctx.body = rounds;
});

export default contestsRouter;
