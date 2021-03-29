import Router from '@koa/router';

const indexRouter = new Router();
indexRouter.prefix('/api');

indexRouter.get('/test', (ctx) => {
    ctx.body = 'ok3';
});

export default indexRouter;
