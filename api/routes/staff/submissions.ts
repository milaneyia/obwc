import Router from '@koa/router';
import validator from 'validator';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Submission } from '../../models/Submission';

const staffSubmissionsRouter = new Router();
staffSubmissionsRouter.prefix('/api/staff/submissions');
staffSubmissionsRouter.use(authenticate);
staffSubmissionsRouter.use(isStaff);

staffSubmissionsRouter.put('/:id', async (ctx) => {
    const submissionId = validator.toInt(ctx.params.id);
    const anonymisedAs = validator.trim(ctx.request.body.anonymisedAs);

    const submission = await Submission.findOneOrFail({
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

export default staffSubmissionsRouter;
