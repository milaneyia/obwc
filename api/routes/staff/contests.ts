import Router from '@koa/router';
import validator from 'validator';
import { CreateContest } from '../../../shared/integration';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Contest } from '../../models/Contest';
import { Team } from '../../models/Team';

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

staffContestsRouter.get('/:id/teams', async (ctx) => {
    ctx.body = await Team.createQueryBuilder('team')
        .innerJoinAndSelect('team.captain', 'captain')
        .innerJoinAndSelect('team.country', 'country')
        .leftJoinAndSelect('team.users', 'users')
        .leftJoinAndSelect('team.invitations', 'invitations')
        .where('team.contestId = :contestId', { contestId: ctx.params.id })
        .orderBy('country.name', 'ASC')
        .addOrderBy('team.name', 'ASC')
        .getMany();
});

export default staffContestsRouter;
