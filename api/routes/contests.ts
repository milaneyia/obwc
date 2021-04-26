import Router from '@koa/router';
import { Contest } from '../models/Contest';

const contestsRouter = new Router();
contestsRouter.prefix('/api/contests');

contestsRouter.get('/', async (ctx) => {
    const contests = await Contest.open().getMany();

    ctx.body = contests;
});

export default contestsRouter;
