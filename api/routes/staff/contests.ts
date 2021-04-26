import Router from '@koa/router';
import validator from 'validator';
import { CreateContest } from '../../../shared/integration';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Contest } from '../../models/Contest';
import { Round } from '../../models/Round';

const staffContestsRouter = new Router();
staffContestsRouter.prefix('/api/staff/contests');
staffContestsRouter.use(authenticate);
staffContestsRouter.use(isStaff);

staffContestsRouter.get('/', async (ctx) => {
    ctx.body = await Contest.find();
});

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

staffContestsRouter.get('/:id/rounds', async (ctx) => {
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

export default staffContestsRouter;
