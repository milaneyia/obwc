import { Next, ParameterizedContext } from 'koa';
import { User } from '../models/User';

function sendResponse(ctx: ParameterizedContext) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
}

export async function simpleAuthenticate(ctx: ParameterizedContext, next: Next): Promise<any> {
    const user = await User.findOne(ctx.session!.userId);
    ctx.state.user = user;

    return await next();
}

export async function authenticate(ctx: ParameterizedContext, next: Next): Promise<any> {
    const user = await User.findOne(ctx.session!.userId);

    if (!user || user.isRestricted) {
        return sendResponse(ctx);
    }

    ctx.state.user = user;

    await next();
}

export async function isStaff(ctx: ParameterizedContext, next: Next): Promise<any> {
    if (!ctx.state.user.isStaff) {
        return sendResponse(ctx);

    }

    await next();
}
