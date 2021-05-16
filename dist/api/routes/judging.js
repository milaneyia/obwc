"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const validator_1 = __importDefault(require("validator"));
const authentication_1 = require("../middlewares/authentication");
const rounds_1 = require("../middlewares/rounds");
const Criteria_1 = require("../models/judging/Criteria");
const Judging_1 = require("../models/judging/Judging");
const JudgingToCriteria_1 = require("../models/judging/JudgingToCriteria");
const Round_1 = require("../models/Round");
const Submission_1 = require("../models/Submission");
const judgingRouter = new router_1.default();
judgingRouter.prefix('/api/judging');
judgingRouter.use(authentication_1.authenticate);
judgingRouter.use(rounds_1.getCurrentRound(Round_1.RoundScope.Judging));
judgingRouter.use(async (ctx, next) => {
    const currentRound = ctx.state.currentRound;
    const user = ctx.state.user;
    const judgingType = currentRound.getJudgeType(user.id);
    if (!judgingType) {
        return ctx.status = 401;
    }
    ctx.state.judgingType = judgingType;
    await next();
});
judgingRouter.get('/', async (ctx) => {
    const currentRound = ctx.state.currentRound;
    const judgingType = ctx.state.judgingType;
    const [criterias, judgingDone] = await Promise.all([
        Criteria_1.Criteria.find({ judgingTypeId: judgingType }),
        Judging_1.Judging.find({
            where: { judgeId: ctx.state.user.id },
            relations: ['judgingToCriterias'],
        }),
    ]);
    ctx.body = {
        currentRound,
        criterias,
        judgingDone,
    };
});
judgingRouter.post('/', async (ctx) => {
    const currentRound = ctx.state.currentRound;
    const judgingType = ctx.state.judgingType;
    const judgingInput = ctx.request.body;
    const score = judgingInput.judgingToCriteria.score;
    const submissionId = judgingInput.judging.submission.id;
    const criteriaId = judgingInput.judgingToCriteria.criteria.id;
    const comment = validator_1.default.trim(judgingInput.judging.comment);
    const criteriaComment = validator_1.default.trim(judgingInput.judgingToCriteria.comment);
    if (!validator_1.default.isNumeric(submissionId + '') ||
        !validator_1.default.isNumeric(criteriaId + '') ||
        !validator_1.default.isNumeric(score + '')) {
        ctx.status = 400;
        return ctx.body = { error: 'Invalid submission' };
    }
    const [criteria, submission] = await Promise.all([
        Criteria_1.Criteria.findOneOrFail({
            id: criteriaId,
            judgingTypeId: judgingType,
        }),
        Submission_1.Submission.findOneOrFail({
            id: submissionId,
            round: currentRound,
        }),
    ]);
    if (score < 1 || score > criteria.maxScore) {
        ctx.status = 400;
        return ctx.body = { error: 'Invalid score' };
    }
    let judging = await Judging_1.Judging.findOne({
        judgeId: ctx.state.user.id,
        submissionId: submission.id,
    });
    if (!judging) {
        judging = new Judging_1.Judging();
        judging.judgeId = ctx.state.user.id;
        judging.submissionId = submission.id;
    }
    judging.comment = comment;
    await judging.save();
    let judgingToCriteria = await JudgingToCriteria_1.JudgingToCriteria.findOne({
        criteria,
        judgingId: judging.id,
    });
    if (!judgingToCriteria) {
        judgingToCriteria = new JudgingToCriteria_1.JudgingToCriteria();
        judgingToCriteria.criteria = criteria;
        judgingToCriteria.judgingId = judging.id;
    }
    judgingToCriteria.score = score;
    judgingToCriteria.comment = criteriaComment;
    await judgingToCriteria.save();
    ctx.body = {
        success: 'Saved!',
    };
});
exports.default = judgingRouter;
