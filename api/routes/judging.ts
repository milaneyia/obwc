import Router from '@koa/router';
import validator from 'validator';
import { authenticate } from '../middlewares/authentication';
import { getCurrentRound } from '../middlewares/rounds';
import { Criteria } from '../models/judging/Criteria';
import { Judging } from '../models/judging/Judging';
import { JudgingToCriteria } from '../models/judging/JudgingToCriteria';
import { JUDGING_TYPE } from '../models/judging/JudgingType';
import { Round, RoundScope } from '../models/Round';
import { Submission } from '../models/Submission';
import { User } from '../models/User';

const judgingRouter = new Router();
judgingRouter.prefix('/api/judging');
judgingRouter.use(authenticate);
judgingRouter.use(getCurrentRound(RoundScope.Judging));

judgingRouter.use(async (ctx, next) => {
    const currentRound: Round = ctx.state.currentRound;
    const user: User = ctx.state.user;

    const judgingType = currentRound.getJudgeType(user.id);

    if (!judgingType) {
        return ctx.status = 401;
    }

    ctx.state.judgingType = judgingType;
    await next();
});

judgingRouter.get('/', async (ctx) => {
    const currentRound: Round = ctx.state.currentRound;
    const judgingType: JUDGING_TYPE = ctx.state.judgingType;

    const [criterias, judgingDone] = await Promise.all([
        Criteria.find({ judgingTypeId: judgingType }),
        Judging.find({
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
    const currentRound: Round = ctx.state.currentRound;
    const judgingType: JUDGING_TYPE = ctx.state.judgingType;

    const judgingInput: Judging = ctx.request.body.judging;
    const judgingToCriteriaInput: JudgingToCriteria = ctx.request.body.judgingToCriteria;

    if (
        !validator.isNumeric(judgingInput.submissionId + '') ||
        !validator.isNumeric(judgingToCriteriaInput.criteriaId + '') ||
        !validator.isNumeric(judgingToCriteriaInput.score + '')
    ) {
        ctx.status = 400;

        return ctx.body = { error: 'Invalid submission' };
    }

    const comment = validator.trim(judgingInput.comment);
    const criteriaComment = validator.trim(judgingToCriteriaInput.comment);

    const [criteria, submission] = await Promise.all([
        Criteria.findOneOrFail({
            id: judgingToCriteriaInput.criteriaId,
            judgingTypeId: judgingType,
        }),
        Submission.findOneOrFail({
            id: judgingInput.submissionId,
            round: currentRound,
        }),
    ]);

    if (judgingToCriteriaInput.score < 1 || judgingToCriteriaInput.score > criteria.maxScore) {
        ctx.status = 400;

        return ctx.body = { error: 'Invalid score' };
    }

    let judging = await Judging.findOne({
        judgeId: ctx.state.user.id,
        submissionId: submission.id,
    });

    if (!judging) {
        judging = new Judging();
        judging.judgeId = ctx.state.user.id;
        judging.submissionId = submission.id;
    }

    judging.comment = comment;
    await judging.save();

    let judgingToCriteria = await JudgingToCriteria.findOne({
        criteria,
        judgingId: judging.id,
    });

    if (!judgingToCriteria) {
        judgingToCriteria = new JudgingToCriteria();
        judgingToCriteria.criteria = criteria;
        judgingToCriteria.judgingId = judging.id;
    }

    judgingToCriteria.score = judgingToCriteriaInput.score;
    judgingToCriteria.comment = criteriaComment;
    await judgingToCriteria.save();

    ctx.body = {
        success: 'Saved!',
    };

});

export default judgingRouter;
