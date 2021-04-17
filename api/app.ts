import Koa from 'koa';
import helmet from 'koa-helmet';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import config from '../config.json';

import authRouter from './routes/auth';
import contestsRouter from './routes/contests';
import roundsRouter from './routes/rounds';
import teamsRouter from './routes/teams';
import usersRouter from './routes/users';
import judgingRouter from './routes/judging';
import submissionsRouter from './routes/submissions';

const app = new Koa();
app.keys = config.KOA.SESSION_KEYS;

// Middlewares
if (app.env === 'development') {
    app.use(logger());
}

app.use(helmet());
app.use(session({
    key: 'obwc.sess',
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
app.use(usersRouter.routes());
app.use(contestsRouter.routes());
app.use(roundsRouter.routes());
app.use(teamsRouter.routes());
app.use(judgingRouter.routes());
app.use(submissionsRouter.routes());

app.on('error', (err, ctx) => {
    if (app.env === 'development') {
        console.log('Error caught', err);
    }
});

export default app;
