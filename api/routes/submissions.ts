import Router from '@koa/router';
import { authenticate } from '../middlewares/authentication';
import { getCurrentRound } from '../middlewares/rounds';
import { Submission } from '../models/Submission';
import { Round, RoundScope } from '../models/Round';
import { User } from '../models/User';
import { Team } from '../models/Team';

const submissionsRouter = new Router();
submissionsRouter.prefix('/api/submissions');
submissionsRouter.use(authenticate);
submissionsRouter.use(getCurrentRound(RoundScope.Submission));

submissionsRouter.use(async (ctx, next) => {
    const user: User = ctx.state.user;
    const team = await Team.findOne({
        captain: user,
    });

    if (!team) {
        return ctx.status = 401;
    }

    ctx.state.team = team;
    await next();
});

submissionsRouter.post('/', async (ctx) => {
    const team: Team = ctx.state.team;
    const currentRound: Round = ctx.state.currentRound;

    let submission = await Submission.findOne({
        round: currentRound,
        team,
    });

    if (!submission) {
        ctx.status = 201;
        submission = new Submission();
    }

    submission = await Submission.fillAndSave(currentRound, team, submission);

    ctx.body = submission;
});

export default submissionsRouter;
