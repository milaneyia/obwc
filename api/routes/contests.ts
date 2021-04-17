import Router from '@koa/router';
import validator from 'validator';
import { CreateContest } from '../../shared/interfaces';
import { authenticate, isStaff } from '../middlewares/authentication';
import { Contest } from '../models/Contest';

const contestsRouter = new Router();
contestsRouter.prefix('/api/contests');

contestsRouter.get('/', async (ctx) => {
    const contests = await Contest.find({
        isOpen: true,
    });

    ctx.body = contests;
});

contestsRouter.post('/', authenticate, isStaff, async (ctx) => {
    const input: CreateContest = ctx.request.body;
    const contest = await Contest.fillAndSave(input);

    ctx.status = 201;
    ctx.body = contest;
});

contestsRouter.put('/:id', authenticate, isStaff, async (ctx) => {
    const input: CreateContest = ctx.request.body;
    const contestId = validator.toInt(ctx.params.id);
    let contest = await Contest.findOneOrFail({
        id: contestId,
    });
    contest = await Contest.fillAndSave(input, contest);

    ctx.body = contest;
});

export default contestsRouter;
