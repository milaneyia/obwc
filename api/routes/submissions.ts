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
import validator from 'validator';
import { Log, LOG_TYPE } from '../models/Log';

const submissionsRouter = new Router();
submissionsRouter.prefix('/api/submissions');
submissionsRouter.use(authenticate);

submissionsRouter.use(async (ctx, next) => {
    const user: User = ctx.state.user;
    const team = await Team.findOne({
        where: {
            captain: user,
            wasConfirmed: true,
        },
        relations: [
            'country',
        ],
    });

    if (!team) {
        return ctx.status = 401;
    }

    ctx.state.team = team;
    await next();
});

submissionsRouter.get('/', async (ctx) => {
    ctx.body = await Submission.find({
        where: {
            team: ctx.state.team,
        },
        relations: [
            'round',
        ],
    });
});

submissionsRouter.post('/', getCurrentRound(RoundScope.Submission), koaBody({
    multipart: true,
    formidable: {
        multiples: false,
        maxFileSize: 30 * 1024 * 1024, // 30mb
    },
}), async (ctx) => {
    const team: Team = ctx.state.team;
    const currentRound: Round = ctx.state.currentRound;
    const oszFile = ctx.request.files?.oszFile as FFile | undefined;
    const information = validator.trim(ctx.request.body.information);

    if (!information) throw new Error('Need Information');

    let submission = await Submission.findOne({
        round: currentRound,
        team,
    });

    let fileId = '';
    const fileName = `${team.country.name} - ${team.name} - ${new Date().toLocaleString()}.osz`;

    if (!submission) {
        ctx.status = 201;
        submission = new Submission();
        fileId = await createFile(oszFile, fileName);
    } else {
        fileId = await updateFile(submission.originalPath, oszFile, fileName);
    }

    submission = await Submission.fillAndSave(information, currentRound, team, fileId, submission);

    ctx.body = submission;

    await cleanUpload(oszFile!.path);
    const user: User = ctx.state.user;
    Log.createAndSave(`Entry ${ctx.status === 201 ? 'submitted' : 'updated'}: "${team.name}" (round ${currentRound.id}) - by "${user.username}"`, LOG_TYPE.User, user.id);
});

submissionsRouter.get('/check', getCurrentRound(RoundScope.Results), async (ctx) => {
    const team: Team = ctx.state.team;
    const currentRound: Round = ctx.state.currentRound;

    return ctx.body = await team.getElimination(currentRound);
});

export default submissionsRouter;
