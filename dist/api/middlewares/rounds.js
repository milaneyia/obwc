"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentRound = void 0;
const Round_1 = require("../models/Round");
function getCurrentRound(scope) {
    return async (ctx, next) => {
        const currentRound = await Round_1.Round.currentRound(scope).getOne();
        if (!currentRound) {
            return ctx.status = 401;
        }
        ctx.state.currentRound = currentRound;
        await next();
    };
}
exports.getCurrentRound = getCurrentRound;
