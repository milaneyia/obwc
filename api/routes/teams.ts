import validator from 'validator';
import Router from '@koa/router';
import { Team } from '../models/Team';
import { authenticate } from '../middlewares/authentication';

const teamsRouter = new Router();
teamsRouter.prefix('/api/teams');
teamsRouter.use(authenticate);

teamsRouter.post('/', async (ctx) => {
    const input = ctx.request.body;

    if (
        !validator.isLength(input.name, {
            min: 1,
            max: 10,
        })
    ) {
        ctx.status = 400;

        return ctx.body = {
            error: 'Invalid name',
        };
    }

    const team = new Team();
    team.country = ctx.state.user.country;
    team.captain = ctx.state.user;
    team.name = input.name;
    team.users = input.users;
    await team.save();

    ctx.status = 201;
    ctx.body = team;
});

export default teamsRouter;
