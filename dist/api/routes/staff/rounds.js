"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const validator_1 = __importDefault(require("validator"));
const authentication_1 = require("../../middlewares/authentication");
const Round_1 = require("../../models/Round");
const Submission_1 = require("../../models/Submission");
const staffRoundsRouter = new router_1.default();
staffRoundsRouter.prefix('/api/staff/rounds');
staffRoundsRouter.use(authentication_1.authenticate);
staffRoundsRouter.use(authentication_1.isStaff);
staffRoundsRouter.put('/:id', async (ctx) => {
    const input = ctx.request.body;
    const roundId = ctx.params.id;
    let round = await Round_1.Round.findOneOrFail(roundId, {
        relations: [
            'judgeToRounds',
            'judgeToRounds.user',
            'judgeToRounds.judgingType',
            'songs',
        ],
    });
    round = await Round_1.Round.fillAndSave(input, round);
    ctx.body = round;
});
staffRoundsRouter.get('/:id/submissions', async (ctx) => {
    const roundId = validator_1.default.toInt(ctx.params.id);
    const round = await Round_1.Round.findOneOrFail({ id: roundId });
    const submissions = await Submission_1.Submission.find({
        where: {
            round,
        },
        relations: [
            'team',
            'team.country',
        ],
    });
    ctx.body = submissions;
});
exports.default = staffRoundsRouter;
