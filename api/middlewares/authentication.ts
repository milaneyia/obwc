import { Next, ParameterizedContext } from 'koa';
import { User } from '../models/User';

function sendResponse(ctx: ParameterizedContext, status?: number) {
    ctx.status = status || 401;
}

export async function simpleAuthenticate(ctx: ParameterizedContext, next: Next): Promise<any> {
    if (ctx.session!.userId) {
        const user = await User.findOne({
            where: {
                id: ctx.session!.userId,
            },
            relations: [
                'captainFor',
                'team',
                'invitations',
                'invitations.captain',
            ],
        });

        ctx.state.user = user;
    }

    return await next();
}

export async function authenticate(ctx: ParameterizedContext, next: Next): Promise<any> {
    const user = await User.findOne({
        id: ctx.session!.userId,
    });

    if (!user || user.isRestricted) {
        return sendResponse(ctx);
    }

    ctx.state.user = user;

    await next();
}

export async function isStaff(ctx: ParameterizedContext, next: Next): Promise<any> {
    if (!ctx.state.user.isStaff) {
        return sendResponse(ctx, 403);
    }

    await next();
}
