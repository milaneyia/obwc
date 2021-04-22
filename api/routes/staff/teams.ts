import Router from '@koa/router';
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

export default staffTeamsRouter;
