import Router from '@koa/router';
import validator from 'validator';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Team } from '../../models/Team';

const staffTeamsRouter = new Router();
staffTeamsRouter.prefix('/api/staff/teams');
staffTeamsRouter.use(authenticate);
staffTeamsRouter.use(isStaff);

staffTeamsRouter.get('/', async (ctx) => {
    ctx.body = await Team.find({
        relations: [
            'users',
            'invitations',
            'country',
            'captain',
        ],
    });
});

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

export default staffTeamsRouter;
