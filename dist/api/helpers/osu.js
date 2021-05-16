"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.refreshToken = exports.getToken = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const config_json_1 = __importDefault(require("../../config.json"));
const clientData = {
    client_id: config_json_1.default.OAUTH.ID,
    client_secret: config_json_1.default.OAUTH.SECRET,
};
async function getToken(code) {
    const data = querystring_1.default.stringify({
        ...clientData,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config_json_1.default.OAUTH.REDIRECT,
    });
    const options = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://osu.ppy.sh/oauth/token',
    };
    return (await axios_1.default(options)).data;
}
exports.getToken = getToken;
async function refreshToken(token) {
    const data = querystring_1.default.stringify({
        ...clientData,
        grant_type: 'refresh_token',
        refresh_token: token,
    });
    const options = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://osu.ppy.sh/oauth/token',
    };
    return (await axios_1.default(options)).data;
}
exports.refreshToken = refreshToken;
async function getUserInfo(token) {
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: 'GET',
        url: 'https://osu.ppy.sh/api/v2/me',
    };
    return (await axios_1.default(options)).data;
}
exports.getUserInfo = getUserInfo;
