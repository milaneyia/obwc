"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const typeorm_1 = require("typeorm");
const validator_1 = __importDefault(require("validator"));
const authentication_1 = require("../middlewares/authentication");
const User_1 = require("../models/User");
const usersRouter = new router_1.default();
usersRouter.prefix('/api/users');
usersRouter.get('/me', authentication_1.simpleAuthenticate, (ctx) => {
    ctx.body = ctx.state.user;
});
usersRouter.get('/', authentication_1.authenticate, async (ctx) => {
    const user = ctx.state.user;
    const query = validator_1.default.trim(ctx.query.user?.toString() || '');
    const countryId = validator_1.default.toInt(ctx.query.country?.toString() || '');
    let users = [];
    if (query) {
        users = await User_1.User.find({
            where: [
                { username: typeorm_1.Like(`%${query}%`) },
                { osuId: query },
            ],
            take: 50,
        });
    }
    else if (countryId) {
        users = await User_1.User.find({
            countryId,
            teamId: typeorm_1.IsNull(),
            id: typeorm_1.Not(user.id),
        });
    }
    ctx.body = users;
});
usersRouter.put('/:id', authentication_1.authenticate, authentication_1.isStaff, async (ctx) => {
    const user = await User_1.User.findOneOrFail(ctx.params.id);
    user.roleId = ctx.request.body.roleId;
    await user.save();
    ctx.body = user;
});
exports.default = usersRouter;
