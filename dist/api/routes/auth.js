"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const router_1 = __importDefault(require("@koa/router"));
const config_json_1 = __importDefault(require("../../config.json"));
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const Country_1 = require("../models/Country");
const osu = __importStar(require("../helpers/osu"));
const Log_1 = require("../models/Log");
const router = new router_1.default();
router.prefix('/api');
router.get('/login', (ctx) => {
    const state = crypto_1.default.randomBytes(48).toString('base64');
    let redirectUrl = ctx.get('referer');
    const url = new URL(redirectUrl);
    if (url.searchParams.has('redirect')) {
        redirectUrl = url.origin + url.searchParams.get('redirect');
    }
    ctx.session.state = {
        state,
        redirectUrl,
    };
    ctx.redirect('https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=' + config_json_1.default.OAUTH.ID +
        '&redirect_uri=' + encodeURIComponent(config_json_1.default.OAUTH.REDIRECT) +
        '&state=' + encodeURIComponent(state) +
        '&scope=identify');
});
router.get('/logout', (ctx) => {
    ctx.session = null;
    ctx.redirect('/');
});
/* GET user's token and user's info to login */
router.get('/callback', async (ctx) => {
    if (!ctx.query.code || ctx.query.error) {
        ctx.status = 500;
        return ctx.redirect('/error');
    }
    const rawState = ctx.query.state?.toString() || '';
    const decodedState = decodeURIComponent(rawState);
    const savedState = ctx.session.state;
    ctx.session.state = undefined;
    if (decodedState !== savedState.state) {
        ctx.status = 403;
        return ctx.redirect('/error');
    }
    let oauthData;
    let userData;
    try {
        const code = ctx.query.code.toString() || '';
        oauthData = await osu.getToken(code);
        userData = await osu.getUserInfo(oauthData.access_token);
    }
    catch (error) {
        ctx.status = 500;
        return ctx.redirect('/error');
    }
    const osuId = userData.id;
    const username = userData.username;
    let user = await User_1.User.findOne({ osuId });
    if (!user) {
        let country = await Country_1.Country.findOne({ name: userData.country.name });
        if (!country) {
            country = new Country_1.Country();
            country.code = userData.country.code;
            country.name = userData.country.name;
            await country.save();
        }
        user = new User_1.User();
        user.osuId = osuId;
        user.username = username;
        user.roleId = Role_1.ROLE.User;
        user.country = country;
        await user.save();
        Log_1.Log.createAndSave(`User created: "${user.username}" - "${user.osuId}"`, Log_1.LOG_TYPE.User, user.id);
    }
    else if (user.username !== username) {
        const oldUsername = user.username;
        user.username = username;
        await user.save();
        Log_1.Log.createAndSave(`User updated: "${oldUsername}" to "${username}"`, Log_1.LOG_TYPE.User, user.id);
    }
    ctx.session.userId = user.id;
    ctx.session.expiresAt = Date.now() + (oauthData.expires_in * 1000);
    ctx.session.accessToken = oauthData.access_token;
    ctx.session.refreshToken = oauthData.refresh_token;
    ctx.redirect(savedState.redirectUrl || '/');
});
exports.default = router;
