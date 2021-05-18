import Router from '@koa/router';
import { Not } from 'typeorm';
import validator from 'validator';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Log, LOG_TYPE } from '../../models/Log';

const staffLogsRouter = new Router();
staffLogsRouter.prefix('/api/staff/logs');
staffLogsRouter.use(authenticate);
staffLogsRouter.use(isStaff);

staffLogsRouter.get('/', async (ctx) => {
    ctx.body = await Log.find({
        where: {
            type: Not(LOG_TYPE.Error),
        },
        order: {
            createdAt: 'DESC',
        },
        take: 30,
        skip: 30 * validator.toInt(ctx.query.page?.toString() || '0'),
    });
});

export default staffLogsRouter;
