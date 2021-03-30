import request from 'supertest';
import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import Router from '@koa/router';
import { Server } from 'node:http';
import app from '../app';
import { Round, CreateTeam } from '../interfaces';

let server: Server;

beforeAll(async () => {
    let connectionOptions = await getConnectionOptions();
    connectionOptions = {
        ...connectionOptions,
        dropSchema: true,
        migrationsRun: true,
        synchronize: true,
    };
    await createConnection(connectionOptions);

    app.use(
        new Router().all('(.*)', async (ctx, next) => {
        ctx.session!.userId = 1;
        await next();
        }).routes()
    );
    server = app.listen();
});

afterAll(() => {
    getConnection().close();
    server.close();
});

describe('rounds endpoints', () => {
    it('should list all created rounds', async () => {
        const res = await request(app.callback())
            .get('/api/rounds');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should insert a new round', async () => {
        const round: Round = {
            submissionsStartedAt: new Date(),
            submissionsEndedAt: new Date(),
            judgingStartedAt: new Date(),
            judgingEndedAt: new Date(),
            resultsAt: new Date(),
            judges: [],
            songs: [{
                title: 'new song',
                link: 'https://osu.ppy.sh/beatmaps/artists',
            }],
        };

        const res = await request(server)
            .post('/api/rounds')
            .send(round);

        expect(res.status).toEqual(201);
        expect(res.body).toBeTruthy();
    });
});

describe('teams endpoints', () => {
    const team: CreateTeam = {
        name: 'My Team',
        users: [{
            id: 1,
            username: 'someone',
        }],
    };

    it('should not accept long team name', async () => {
        const invalidTeam = { ...team };
        invalidTeam.name = 'Very long team name';
        const res = await request(server)
            .post('/api/teams')
            .send(invalidTeam);

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should insert a new team', async () => {
        const res = await request(server)
            .post('/api/teams')
            .send(team);

        expect(res.status).toEqual(201);
        expect(res.body).toBeTruthy();
    });
});
