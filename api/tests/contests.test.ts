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
            .get('/api/contests');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should insert a new contest', async () => {
        const staff = await createUser({
            roleId: ROLE.Staff,
        });
        const data: CreateContest = {
            name: 'A Contest',
            isOpen: true,
        };

        const res = await request(server)
            .post('/api/contests')
            .set('Cookie', fakeSession(staff.id))
            .send(data);

        expect(res.status).toEqual(201);
        expect(res.body).toBeTruthy();
        expect(await Contest.count()).toBe(2); // +1 from the seed
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
            isOpen: !contest.isOpen,
        };

        const res = await request(server)
            .put('/api/contests/' + contest.id)
            .set('Cookie', fakeSession(staff.id))
            .send(data);

        const updatedContest: Contest = res.body;

        expect(res.status).toEqual(200);
        expect(updatedContest).toBeTruthy();
        expect(updatedContest.name).not.toBe(contest.name);
        expect(updatedContest.isOpen).not.toBe(contest.isOpen);
    });

});
