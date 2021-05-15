import Router from '@koa/router';
import koaBody from 'koa-body';
import { File as FFile } from 'formidable';
import { authenticate } from '../middlewares/authentication';
import { getCurrentRound } from '../middlewares/rounds';
import { Submission } from '../models/Submission';
import { Round, RoundScope } from '../models/Round';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { cleanUpload, createFile, updateFile } from '../helpers/drive';

const submissionsRouter = new Router();
submissionsRouter.prefix('/api/submissions');
submissionsRouter.use(authenticate);

submissionsRouter.use(async (ctx, next) => {
    const user: User = ctx.state.user;
    const team = await Team.findOne({
        captain: user,
        wasConfirmed: true,
    });

    if (!team) {
        return ctx.status = 401;
    }

    ctx.state.team = team;
    await next();
});

submissionsRouter.get('/', async (ctx) => {
    ctx.body = await Submission.find({
        team: ctx.state.team,
    });
});

submissionsRouter.post('/', getCurrentRound(RoundScope.Submission), koaBody({
    multipart: true,
    formidable: {
        multiples: false,
        maxFileSize: 15 * 1024 * 1024, // 15mb
    },
}), async (ctx) => {
    const team: Team = ctx.state.team;
    const currentRound: Round = ctx.state.currentRound;
    const oszFile = ctx.request.files?.oszFile as FFile | undefined;

    let submission = await Submission.findOne({
        where: {
            round: currentRound,
            team,
        },
        relations: [
            'team',
            'team.country',
        ],
    });

    let fileId = '';
    const fileName = `${team.country.name} - ${team.name} - ${new Date().toLocaleString()}`;

    if (!submission) {
        ctx.status = 201;
        submission = new Submission();
        fileId = await createFile(oszFile, fileName);
    } else {
        fileId = await updateFile(submission.originalPath, oszFile, fileName);
    }

    submission = await Submission.fillAndSave(currentRound, team, fileId, submission);

    ctx.body = submission;

    await cleanUpload(oszFile!.path);
});

export default submissionsRouter;
