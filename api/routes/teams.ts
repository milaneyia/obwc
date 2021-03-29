import Router from '@koa/router';
import { Team } from '../models/Team';

const teamsRouter = new Router();
teamsRouter.prefix('/api/teams');

teamsRouter.post('/', async (ctx) => {
    const input = ctx.request.body;
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
