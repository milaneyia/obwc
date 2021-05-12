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

staffTeamsRouter.put('/:id/removeUser', async (ctx) => {
    const teamId = validator.toInt(ctx.params.id);
    const userId = ctx.request.body.userId;
    const user = await User.findOneOrFail({ id: userId });

    if (user.teamId === teamId) {
        user.teamId = null;
        await user.save();

        console.log(user);

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
