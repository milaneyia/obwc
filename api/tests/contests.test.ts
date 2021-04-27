import { Server } from 'node:http';
import { getConnection } from 'typeorm';
import request from 'supertest';
import { clearDB, fakeSession, setupDB } from './helpers';
import { createContest, createUser } from './factory';
import { ROLE } from '../models/Role';
import { Contest } from '../models/Contest';
import { CreateContest } from '../../shared/integration';
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

describe('contests endpoints', () => {

    it('should list all open contests', async () => {
        const res = await request(server)
            .get('/api/contests/open');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should update a created contest', async () => {
        const [staff, contest] = await Promise.all([
            createUser({
                roleId: ROLE.Staff,
            }),
            createContest(),
        ]);
        const data: CreateContest = {
            name: 'A Contest',
            announcementAt: contest.announcementAt,
            registrationStartedAt: contest.registrationStartedAt,
            registrationEndedAt: new Date(),
        };

        const res = await request(server)
            .put('/api/staff/contests/' + contest.id)
            .set('Cookie', fakeSession(staff.id))
            .send(data);

        const updatedContest: Contest = res.body;

        expect(res.status).toEqual(200);
        expect(updatedContest).toBeTruthy();
        expect(updatedContest.name).not.toBe(contest.name);
        expect(updatedContest.registrationEndedAt).not.toBe(contest.registrationEndedAt);
    });

});
