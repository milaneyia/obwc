import crypto from 'crypto';
import Router from '@koa/router';
import config from '../../config.json';
import { User } from '../models/User';
import { ROLE } from '../models/Role';
import { Country } from '../models/Country';
import * as osu from '../helpers/osu';

interface State {
    state: string;
    redirectUrl: string;
}

const router = new Router();
router.prefix('/api');

router.get('/login', (ctx) => {
    const state = crypto.randomBytes(48).toString('base64');

    ctx.session!.state = {
        state,
        redirectUrl: ctx.get('referer'),
    } as State;

    ctx.redirect(
        'https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=' + config.OAUTH.ID +
        '&redirect_uri=' + encodeURIComponent(config.OAUTH.REDIRECT) +
        '&state=' + encodeURIComponent(state) +
        '&scope=identify'
    );
});

router.get('/logout', (ctx) => {
    ctx.session = null;
    ctx.redirect('/');
});

/* GET user's token and user's info to login */
router.get('/callback', async (ctx) => {
    if (!ctx.query.code || ctx.query.error) {
        ctx.status = 500;

        return ctx.redirect('http://localhost:8000/error');
    }

    const rawState = ctx.query.state?.toString() || '';
    const decodedState = decodeURIComponent(rawState);
    const savedState: State = ctx.session!.state;
    ctx.session!.state = undefined;

    if (decodedState !== savedState.state) {
        ctx.status = 403;

        return ctx.redirect('http://localhost:8000/error');
    }

    let oauthData;
    let userData;

    try {
        const code = ctx.query.code.toString() || '';
        oauthData = await osu.getToken(code);
        userData = await osu.getUserInfo(oauthData.access_token);
    } catch (error) {
        console.log(error);
        ctx.status = 500;

        return ctx.redirect('http://localhost:8000/error');
    }

    const osuId = userData.id;
    const username = userData.username;
    let user = await User.findOne({ osuId });

    if (!user) {
        let country = await Country.findOne({ name: userData.country.name });

        if (!country) {
            country = new Country();
            country.code = userData.country.code;
            country.name = userData.country.name;
            country.save();
        }

        user = new User();
        user.osuId = osuId;
        user.username = username;
        user.roleId = ROLE.User;

        user.country = country;
        await user.save();
    }

    ctx.session!.userId = user.id;
    ctx.session!.expiresAt = Date.now() + (oauthData.expires_in * 1000);
    ctx.session!.accessToken = oauthData.access_token;
    ctx.session!.refreshToken = oauthData.refresh_token;

    ctx.redirect(savedState.redirectUrl || '/');
});

export default router;
