"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const validator_1 = __importDefault(require("validator"));
const drive_1 = require("../../helpers/drive");
const authentication_1 = require("../../middlewares/authentication");
const Submission_1 = require("../../models/Submission");
const staffSubmissionsRouter = new router_1.default();
staffSubmissionsRouter.prefix('/api/staff/submissions');
staffSubmissionsRouter.use(authentication_1.authenticate);
staffSubmissionsRouter.use(authentication_1.isStaff);
staffSubmissionsRouter.put('/:id', async (ctx) => {
    const submissionId = validator_1.default.toInt(ctx.params.id);
    const anonymisedAs = validator_1.default.trim(ctx.request.body.anonymisedAs);
    const submission = await Submission_1.Submission.findOneOrFail({
        where: {
            id: submissionId,
        },
        relations: [
            'team',
            'team.country',
        ],
    });
    submission.anonymisedAs = anonymisedAs;
    await submission.save();
    ctx.body = submission;
});
staffSubmissionsRouter.get('/:id/download', async (ctx) => {
    const submissionId = validator_1.default.toInt(ctx.params.id);
    const submission = await Submission_1.Submission.findOneOrFail({
        where: {
            id: submissionId,
        },
        relations: [
            'team',
            'team.country',
        ],
    });
    ctx.attachment(`${submission.team.country.name} - ${submission.team.name}.osz`);
    ctx.type = 'application/octet-stream';
    ctx.body = await drive_1.downloadFile(submission.originalPath);
});
exports.default = staffSubmissionsRouter;
