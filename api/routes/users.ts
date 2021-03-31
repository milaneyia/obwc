import Router from '@koa/router';
import { Like } from 'typeorm';
import validator from 'validator';
import { authenticate, isStaff } from '../middlewares/authentication';
import { User } from '../models/User';

const usersRouter = new Router();
usersRouter.prefix('/api/users');
usersRouter.use(authenticate);

usersRouter.get('/', async (ctx) => {
    const query = validator.trim(ctx.query.user?.toString() || '');

    const users = await User.find({
        where: [
            { username: Like(`%${query}%`) },
            { osuId: query },
        ],
        take: 50,
    });

    ctx.body = users;
});

usersRouter.put('/:id', isStaff, async (ctx) => {
    const user = await User.findOneOrFail(ctx.params.id);
    user.roleId = ctx.request.body.roleId;
    await user.save();

    ctx.body = user;
});

export default usersRouter;
