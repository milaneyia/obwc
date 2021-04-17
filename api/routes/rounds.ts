import Router from '@koa/router';
import { CreateRound } from '../../shared/integration';
import { authenticate, isStaff } from '../middlewares/authentication';
import { Round } from '../models/Round';

const roundsRouter = new Router();
roundsRouter.prefix('/api/rounds');

roundsRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    ctx.body = rounds;
});

roundsRouter.post('/', authenticate, isStaff, async (ctx) => {
    const input: CreateRound = ctx.request.body;
    const round = await Round.fillAndSave(input);

    ctx.status = 201;
    ctx.body = round;
});

roundsRouter.put('/:id', authenticate, isStaff, async (ctx) => {
    const input: CreateRound = ctx.request.body;
    const roundId = ctx.params.id;
    let round = await Round.findOneOrFail(roundId, {
        relations: [
            'judgeToRounds',
            'songs',
        ],
    });
    round = await Round.fillAndSave(input, round);

    ctx.body = round;
});

export default roundsRouter;
