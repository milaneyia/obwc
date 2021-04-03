import { Next, ParameterizedContext } from 'koa';
import { Round, RoundScope } from '../models/Round';

export function getCurrentRound (scope: RoundScope) {
    return async (ctx: ParameterizedContext, next: Next): Promise<any> => {
        const currentRound = await Round.currentRound(scope).getOne();

        if (!currentRound) {
            return ctx.status = 401;
        }

        ctx.state.currentRound = currentRound;
        await next();
    };
}
