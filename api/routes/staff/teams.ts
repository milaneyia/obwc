import Router from '@koa/router';
import validator from 'validator';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Team } from '../../models/Team';
import { User } from '../../models/User';

const staffTeamsRouter = new Router();
staffTeamsRouter.prefix('/api/staff/teams');
staffTeamsRouter.use(authenticate);
staffTeamsRouter.use(isStaff);

staffTeamsRouter.put('/:id/confirm', async (ctx) => {
    const teamId = validator.toInt(ctx.params.id);
    const team = await Team.findOneOrFail({ id: teamId });
    team.wasConfirmed = true;
    await team.save();

    ctx.body = team;
});

staffTeamsRouter.put('/:id/deny', async (ctx) => {
    const teamId = validator.toInt(ctx.params.id);
    const team = await Team.findOneOrFail({ id: teamId });
    team.wasConfirmed = false;
    await team.save();

    ctx.body = team;
});

staffTeamsRouter.put('/:id', async (ctx) => {
    const teamId = validator.toInt(ctx.params.id);
    const name = validator.trim(ctx.request.body.name);
    const team = await Team.findOneOrFail({
        where: {
            id: teamId,
        },
        relations: [
            'users',
            'invitations',
            'country',
            'captain',
        ],
    });
    team.name = name;
    await team.save();

    ctx.body = team;
});

staffTeamsRouter.put('/:id/transferOwnership', async (ctx) => {
    const teamId = validator.toInt(ctx.params.id);
    const userId = ctx.request.body.userId;
    const [user, team] = await Promise.all([
        User.findOneOrFail({ id: userId }),
        Team.findOneOrFail({
            where: { id: teamId },
            relations: ['users', 'captain'],
        }),
    ]);

    if (user.teamId !== team.id) {
        throw new Error();
    }

    team.users.push(team.captain);
    team.users.splice(team.users.findIndex(u => u.id === user.id), 1);
    team.captain = user;
    await team.save();

    ctx.body = await Team.findOneOrFail({
        where: {
            id: teamId,
        },
        relations: [
            'users',
            'invitations',
            'country',
            'captain',
        ],
    });
});

staffTeamsRouter.put('/:id/removeUser', async (ctx) => {
    const teamId = validator.toInt(ctx.params.id);
    const userId = ctx.request.body.userId;
    const user = await User.findOneOrFail({ id: userId });

    if (user.teamId === teamId) {
        user.teamId = null;
        await user.save();
    }

    const team = await Team.findOneOrFail({
        where: {
            id: teamId,
        },
        relations: [
            'users',
            'invitations',
            'country',
            'captain',
        ],
    });

    ctx.body = team;
});

staffTeamsRouter.delete('/:id', async (ctx) => {
    const teamId = validator.toInt(ctx.params.id);
    const team = await Team.findOneOrFail({
        id: teamId,
    });
    await team.remove();

    ctx.body = {
        success: 'Deleted',
    };
});

export default staffTeamsRouter;
