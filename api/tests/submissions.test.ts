import request from 'supertest';
import { getConnection } from 'typeorm';
import { Server } from 'node:http';
import { createContest, createRound, createTeam, createUser } from './factory';
import { clearDB, fakeSession, setupDB } from './helpers';
import app from '../app';

let server: Server;

beforeAll(async () => {
    await setupDB();
    server = app.listen();
});

afterAll(() => {
    getConnection().close();
    server.close();
});

beforeEach(async () => {
    await clearDB();
});

describe('submissions endpoints', () => {

    it('should stop an unconfirmed team', async () => {
        const [user, contest] = await Promise.all([
            createUser(),
            createContest(),
        ]);
        await createRound(contest);
        await createTeam(user, contest);

        const res = await request(server)
            .post('/api/submissions')
            .set('Cookie', fakeSession(user.id));

        expect(res.status).toEqual(401);
    });

    it('should insert a new submission', async () => {
        const [user, contest] = await Promise.all([
            createUser(),
            createContest(),
        ]);
        await createRound(contest);
        await createTeam(user, contest, true);

        const res = await request(server)
            .post('/api/submissions')
            .set('Cookie', fakeSession(user.id));

        expect(res.status).toEqual(201);
        expect(res.body).toBeTruthy();
    });

});
