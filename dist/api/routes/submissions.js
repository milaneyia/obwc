"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const koa_body_1 = __importDefault(require("koa-body"));
const authentication_1 = require("../middlewares/authentication");
const rounds_1 = require("../middlewares/rounds");
const Submission_1 = require("../models/Submission");
const Round_1 = require("../models/Round");
const Team_1 = require("../models/Team");
const drive_1 = require("../helpers/drive");
const submissionsRouter = new router_1.default();
submissionsRouter.prefix('/api/submissions');
submissionsRouter.use(authentication_1.authenticate);
submissionsRouter.use(async (ctx, next) => {
    const user = ctx.state.user;
    const team = await Team_1.Team.findOne({
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
    ctx.body = await Submission_1.Submission.find({
        where: {
            team: ctx.state.team,
        },
        relations: [
            'round',
        ],
    });
});
submissionsRouter.post('/', rounds_1.getCurrentRound(Round_1.RoundScope.Submission), koa_body_1.default({
    multipart: true,
    formidable: {
        multiples: false,
        maxFileSize: 15 * 1024 * 1024, // 15mb
    },
}), async (ctx) => {
    const team = ctx.state.team;
    const currentRound = ctx.state.currentRound;
    const oszFile = ctx.request.files?.oszFile;
    let submission = await Submission_1.Submission.findOne({
        round: currentRound,
        team,
    });
    let fileId = '';
    const fileName = `${team.country.name} - ${team.name} - ${new Date().toLocaleString()}.osz`;
    if (!submission) {
        ctx.status = 201;
        submission = new Submission_1.Submission();
        fileId = await drive_1.createFile(oszFile, fileName);
    }
    else {
        fileId = await drive_1.updateFile(submission.originalPath, oszFile, fileName);
    }
    submission = await Submission_1.Submission.fillAndSave(currentRound, team, fileId, submission);
    ctx.body = submission;
    await drive_1.cleanUpload(oszFile.path);
});
exports.default = submissionsRouter;
