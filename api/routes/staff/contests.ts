import Router from '@koa/router';
import validator from 'validator';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Contest } from '../../models/Contest';

const staffContestsRouter = new Router();
staffContestsRouter.prefix('/api/staff/contests');
staffContestsRouter.use(authenticate);
staffContestsRouter.use(isStaff);

staffContestsRouter.get('/', async (ctx) => {
    ctx.body = await Contest.find();
});

staffContestsRouter.put('/:id', async (ctx) => {
    const contestId = validator.toInt(ctx.params.id);
    const name = validator.trim(ctx.request.body.name);
    const isOpen = ctx.request.body.isOpen;
    const contest = await Contest.findOneOrFail({ id: contestId });
    contest.name = name;
    contest.isOpen = isOpen;
    await contest.save();

    ctx.body = contest;
});

export default staffContestsRouter;
