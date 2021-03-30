import Router from '@koa/router';
import { Not } from 'typeorm';
import validator from 'validator';
import { Team } from '../models/Team';
import { authenticate } from '../middlewares/authentication';
import { User } from '../models/User';

const teamsRouter = new Router();
teamsRouter.prefix('/api/teams');
teamsRouter.use(authenticate);

teamsRouter.post('/', async (ctx) => {
    const user: User = ctx.state.user;
    const input = ctx.request.body;
    const name = validator.trim(input.name);
    const users = await User.findByIds(input.users, {
        countryId: user.country.id,
        id: Not(user.id),
    });

    if (
        !validator.isLength(name, {
            min: 1,
            max: 16,
        }) ||
        users.length < 2 ||
        users.length > 5
    ) {
        ctx.status = 400;

        return ctx.body = {
            error: 'Invalid submission',
        };
    }

    const team = new Team();
    team.country = user.country;
    team.captain = user;
    team.name = name;
    team.users = users;
    await team.save();

    ctx.status = 201;
    ctx.body = team;
});

export default teamsRouter;
