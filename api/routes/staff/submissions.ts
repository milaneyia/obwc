import Router from '@koa/router';
import validator from 'validator';
import { downloadFile } from '../../helpers/drive';
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

staffSubmissionsRouter.get('/:id/download', async (ctx) => {
    const submissionId = validator.toInt(ctx.params.id);

    const submission = await Submission.findOneOrFail({
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
    ctx.body = await downloadFile(submission.originalPath);
});

export default staffSubmissionsRouter;
