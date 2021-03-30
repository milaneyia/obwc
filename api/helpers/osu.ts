import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'querystring';
import config from '../../config.json';

interface TokenResponse {
    'token_type': 'Bearer';
    'expires_in': 86400;
    'access_token': string;
    'refresh_token': string;
}

interface OsuAuthResponse {
    id: number;
    username: string;
    country: {
        code: string;
        name: string;
    };
}

const clientData = {
    client_id: config.OAUTH.ID,
    client_secret: config.OAUTH.SECRET,
};

export async function getToken(code: string): Promise<TokenResponse> {
    const data = querystring.stringify({
        ...clientData,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.OAUTH.REDIRECT,
    });

    const options: AxiosRequestConfig = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://osu.ppy.sh/oauth/token',
    };

    return (await axios(options)).data;
}

export async function refreshToken(token: string): Promise<TokenResponse> {
    const data = querystring.stringify({
        ...clientData,
        grant_type: 'refresh_token',
        refresh_token: token,
    });

    const options: AxiosRequestConfig = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://osu.ppy.sh/oauth/token',
    };

    return (await axios(options)).data;
}

export async function getUserInfo(token: string): Promise<OsuAuthResponse> {
    const options: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: 'GET',
        url: 'https://osu.ppy.sh/api/v2/me',
    };

    return (await axios(options)).data;
}
