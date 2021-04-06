import { Server } from 'node:http';
import request from 'supertest';
import { getConnection } from 'typeorm';
import { ROLE } from '../models/Role';
import { clearDB, fakeSession, setupDB } from './helpers';
import app from '../app';
import { createUser } from './factory';

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

describe('query users', () => {

    it('should query by username', async () => {
        const user = await createUser();

        const res = await request(server)
            .get(`/api/users?user=${user.username}`);

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].username).toBe(user.username);
    });

    it('should query by osu ID', async () => {
        const user = await createUser();

        const res = await request(server)
            .get(`/api/users?user=${user.osuId}`);

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].osuId).toBe(user.osuId);
    });

});

describe('update users', () => {

    it('should fail auth on update user role', async () => {
        const user = await createUser();

        const res = await request(server)
            .put(`/api/users/${user.id}`)
            .set(fakeSession(user.id))
            .send({
                roleId: ROLE.Restricted,
            });

        expect(res.status).toEqual(403);
    });

    it('should update user role', async () => {
        const user = await createUser({ roleId: ROLE.Staff });

        const res = await request(server)
            .put(`/api/users/${user.id}`)
            .set(fakeSession(user.id))
            .send({
                roleId: ROLE.Restricted,
            });

        await user.reload();

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('roleId', ROLE.Restricted);
        expect(user.roleId).toBe(ROLE.Restricted);
    });

});
