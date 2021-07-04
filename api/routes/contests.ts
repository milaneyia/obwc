import Router from '@koa/router';
import validator from 'validator';
import { authenticate } from '../middlewares/authentication';
import { Contest } from '../models/Contest';
import { Round } from '../models/Round';
import { Team } from '../models/Team';
import { User } from '../models/User';

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

contestsRouter.get('/:id/teams', async (ctx) => {
    ctx.body = await Team.createQueryBuilder('team')
        .innerJoinAndSelect('team.captain', 'captain')
        .innerJoinAndSelect('team.country', 'country')
        .leftJoinAndSelect('team.users', 'users')
        .where('team.wasConfirmed = true')
        .andWhere('team.contestId = :contestId', { contestId: ctx.params.id })
        .orderBy('country.name', 'ASC')
        .addOrderBy('team.name', 'ASC')
        .getMany();
});

contestsRouter.get('/:id/teams/mine', authenticate, async (ctx) => {
    const user: User = ctx.state.user;

    ctx.body = await Team.findOne({
        where: {
            captain: user,
            contestId: ctx.params.id,
        },
        relations: [
            'contest',
            'users',
            'invitations',
        ],
    });
});

export default contestsRouter;
