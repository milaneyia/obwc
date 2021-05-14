import Router from '@koa/router';
import { Brackets, IsNull, Not } from 'typeorm';
import validator from 'validator';
import { Team } from '../models/Team';
import { authenticate } from '../middlewares/authentication';
import { User } from '../models/User';
import { CreateTeam } from '../../shared/integration';
import { Contest } from '../models/Contest';
import { Log, LOG_TYPE } from '../models/Log';

const teamsRouter = new Router();
teamsRouter.prefix('/api/teams');

teamsRouter.get('/', async (ctx) => {
    ctx.body = await Team.find({
        where: {
            wasConfirmed: true,
        },
        relations: [
            'country',
            'captain',
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
            'contest',
            'users',
            'invitations',
        ],
    });
});

teamsRouter.post('/', authenticate, async (ctx) => {
    const user: User = ctx.state.user;
    const input: CreateTeam = ctx.request.body;
    const name = validator.trim(input.name);
    const [currentTeam, contest] = await Promise.all([
        Team.findOne({
            captain: user,
        }),
        Contest.open()
            .andWhere('id = :id', { id: input.contest.id })
            .getOne(),
    ]);

    if (currentTeam?.wasConfirmed) {
        ctx.status = 400;

        return ctx.body = {
            error: 'Team was locked by a staff member',
        };
    }

    let users: User[] = [];

    if (currentTeam) {
        users = await User.createQueryBuilder('user')
            .where('countryId = :countryId', { countryId: user.country.id })
            .andWhere('id != :userId', { userId: user.id })
            .andWhere('id IN (:ids)', { ids: input.invitations.map(i => i.id) })
            .andWhere(new Brackets(qb => {
                qb.where('teamId IS NULL')
                    .orWhere('teamId = :teamId', { teamId: currentTeam.id });
            }))
            .getMany();
    } else {
        users = await User.findByIds(input.invitations, {
            id: Not(user.id),
            countryId: user.country.id,
            teamId: IsNull(),
        });
    }

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

    Log.createAndSave(`Team created: "${team.name}" for "${user.country.name}"`, LOG_TYPE.User, user.id);
});

teamsRouter.post('/:id/acceptInvitation', authenticate, async (ctx) => {
    const team = await Team.findOneOrFail(ctx.params.id, {
        where: {
            wasConfirmed: false,
        },
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

    Log.createAndSave(`Accepted invite: "${user.username}" from "${team.name}" for "${user.country.name}"`, LOG_TYPE.User, user.id);
});

export default teamsRouter;
