import Router from '@koa/router';
import { CreateRound } from '../../../shared/integration';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/Round';

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

export default staffRoundsRouter;
