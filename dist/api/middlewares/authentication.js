"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaff = exports.authenticate = exports.simpleAuthenticate = void 0;
const User_1 = require("../models/User");
function sendResponse(ctx, status) {
    ctx.status = status || 401;
}
async function simpleAuthenticate(ctx, next) {
    if (ctx.session.userId) {
        const user = await User_1.User.findOne({
            where: {
                id: ctx.session.userId,
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
exports.simpleAuthenticate = simpleAuthenticate;
async function authenticate(ctx, next) {
    const user = await User_1.User.findOne({
        id: ctx.session.userId,
    });
    if (!user || user.isRestricted) {
        return sendResponse(ctx);
    }
    ctx.state.user = user;
    await next();
}
exports.authenticate = authenticate;
async function isStaff(ctx, next) {
    if (!ctx.state.user.isStaff) {
        return sendResponse(ctx, 403);
    }
    await next();
}
exports.isStaff = isStaff;
