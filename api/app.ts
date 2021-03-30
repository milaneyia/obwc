import Koa from 'koa';
import helmet from 'koa-helmet';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import config from '../config.json';

import authRouter from './routes/auth';
import roundsRouter from './routes/rounds';
import teamsRouter from './routes/teams';

const app = new Koa();
app.keys = config.KOA.SESSION_KEYS;

// Middlewares
if (app.env === 'development') {
    app.use(logger());
}

app.use(helmet());
app.use(session({
    key: 'obwc:sess',
    renew: true,
    sameSite: 'lax',
}, app));
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
app.use(authRouter.routes());
app.use(roundsRouter.routes());
app.use(teamsRouter.routes());

app.on('error', (err, ctx) => {
    console.log(err);
});

export default app.listen(config.KOA.PORT);
