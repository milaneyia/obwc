import Router from '@koa/router';
import { IsNull, Not } from 'typeorm';
import validator from 'validator';
import { Team } from '../models/Team';
import { authenticate } from '../middlewares/authentication';
import { User } from '../models/User';
import { CreateTeam } from '../../shared/integration';
import { Contest } from '../models/Contest';

const teamsRouter = new Router();
teamsRouter.prefix('/api/teams');

teamsRouter.get('/', async (ctx) => {
    ctx.body = await Team.find({
        where: {
            wasConfirmed: true,
        },
        relations: [
            'users',
        ],
    });
});

teamsRouter.get('/mine', authenticate, async (ctx) => {
    const user: User = ctx.state.user;

    ctx.body = await Team.findOne({
        where: {
            captain: user,
        },
        relations: [
            'users',
            'invitations',
        ],
    });
});

teamsRouter.post('/', authenticate, async (ctx) => {
    const user: User = ctx.state.user;
    const input: CreateTeam = ctx.request.body;
    const name = validator.trim(input.name);
    const [users, currentTeam, contest] = await Promise.all([
        User.findByIds(input.invitations, {
            countryId: user.country.id,
            teamId: IsNull(),
            id: Not(user.id),
        }),
        Team.findOne({
            captain: user,
        }),
        Contest.open()
            .where('id = :id', { id: input.contest.id })
            .getOne(),
    ]);

    if (
        !validator.isLength(name, {
            min: 1,
            max: 16,
        }) ||
        users.length < 2 ||
        users.length > 5 ||
        user.teamId ||
        !contest
    ) {
        ctx.status = 400;

        return ctx.body = {
            error: 'Invalid submission',
        };
    }

    let team = currentTeam;

    if (!team) {
        ctx.status = 201;
        team = new Team();
    }

    team.contest = contest;
    team.country = user.country;
    team.captain = user;
    team.name = name;
    team.invitations = users;
    await team.save();

    ctx.body = team;
});

teamsRouter.post('/:id/acceptInvitation', authenticate, async (ctx) => {
    const team = await Team.findOneOrFail(ctx.params.id, {
        relations: [
            'invitations',
            'users',
        ],
    });

    const user: User = ctx.state.user;
    const invitation = team.invitations.find(i => i.id === user.id);
    const isCaptain = await Team.findOne({
        captainId: user.id,
    });
    const hasTeam = user.teamId;

    if (!invitation || isCaptain || hasTeam) {
        ctx.status = 400;

        return ctx.body = {
            error: `Invalid invitation`,
        };
    }

    team.users.push(user);
    await team.save();

    ctx.body = team;
});

export default teamsRouter;
