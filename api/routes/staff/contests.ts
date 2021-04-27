import Router from '@koa/router';
import validator from 'validator';
import { CreateContest } from '../../../shared/integration';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Contest } from '../../models/Contest';

const staffContestsRouter = new Router();
staffContestsRouter.prefix('/api/staff/contests');
staffContestsRouter.use(authenticate);
staffContestsRouter.use(isStaff);

staffContestsRouter.put('/:id', async (ctx) => {
    const contestId = validator.toInt(ctx.params.id);
    const body: CreateContest = ctx.request.body;
    body.name = validator.trim(body.name);

    const contest = await Contest.findOneOrFail({ id: contestId });
    contest.name = body.name;
    contest.announcementAt = body.announcementAt;
    contest.registrationStartedAt = body.registrationStartedAt;
    contest.registrationEndedAt = body.registrationEndedAt;
    await contest.save();

    ctx.body = contest;
});

export default staffContestsRouter;
