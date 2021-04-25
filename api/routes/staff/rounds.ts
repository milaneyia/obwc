import Router from '@koa/router';
import validator from 'validator';
import { CreateRound } from '../../../shared/integration';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/Round';
import { Submission } from '../../models/Submission';

const staffRoundsRouter = new Router();
staffRoundsRouter.prefix('/api/staff/rounds');
staffRoundsRouter.use(authenticate);
staffRoundsRouter.use(isStaff);

staffRoundsRouter.put('/:id', async (ctx) => {
    const input: CreateRound = ctx.request.body;
    const roundId = ctx.params.id;
    let round = await Round.findOneOrFail(roundId, {
        relations: [
            'judgeToRounds',
            'judgeToRounds.user',
            'judgeToRounds.judgingType',
            'songs',
        ],
    });
    round = await Round.fillAndSave(input, round);

    ctx.body = round;
});

staffRoundsRouter.get('/:id/submissions', async (ctx) => {
    const roundId = validator.toInt(ctx.params.id);

    const round = await Round.findOneOrFail({ id: roundId });
    const submissions = await Submission.find({
        where: {
            round,
        },
        relations: [
            'team',
        ],
    });

    ctx.body = submissions;
});

export default staffRoundsRouter;
