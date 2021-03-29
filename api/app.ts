import Koa from 'koa';
import helmet from 'koa-helmet';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';

import indexRouter from './routes/index';
import roundsRouter from './routes/rounds';
import teamsRouter from './routes/teams';

const app = new Koa();
app.keys = process.env.KOA_SESSION_KEYS as any;

// Middlewares
if (app.env === 'development') {
    app.use(logger());
}

app.use(helmet());
app.use(session({ key: 'obwc:sess' }, app));
app.use(bodyParser());

// Error handler
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.app.emit('error', err, ctx);
    }
});

// Public routes
app.use(indexRouter.routes());
app.use(roundsRouter.routes());
app.use(teamsRouter.routes());

app.on('error', (err, ctx) => {
    console.log(err);
});

export default app.listen(process.env.KOA_SERVER_PORT);
