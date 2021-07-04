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
import staffTeamsRouter from './routes/staff/teams';
import staffContestsRouter from './routes/staff/contests';
import staffRoundsRouter from './routes/staff/rounds';
import staffSubmissionsRouter from './routes/staff/submissions';
import staffLogsRouter from './routes/staff/logs';
import { Log, LOG_TYPE } from './models/Log';

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
    signed: true,
    maxAge: 86400000 * 5, // 5 days
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

// Staff routes
app.use(staffTeamsRouter.routes());
app.use(staffContestsRouter.routes());
app.use(staffRoundsRouter.routes());
app.use(staffSubmissionsRouter.routes());
app.use(staffLogsRouter.routes());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.on('error', (err, ctx) => {
    if (app.env === 'development') {
        console.log('Error caught', err);
    } else {
        Log.createAndSave(JSON.stringify(err), LOG_TYPE.Error);
    }
});

export default app;
