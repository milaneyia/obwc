import { Server } from 'node:http';
import request from 'supertest';
import { getConnection } from 'typeorm';
import { Team } from '../models/Team';
import { CreateTeam } from '../interfaces';
import { clearDB, fakeSession, setupDB } from './helpers';
import app from '../app';
import { createUser, createUsers, createCountries } from './factory';

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

async function executeRequest (captainId: number, team: CreateTeam) {
    return await request(server)
        .post('/api/teams')
        .set(fakeSession(captainId))
        .send(team);
}

describe('teams creation', () => {

    it('should not accept long team name', async () => {
        const captain = await createUser();
        const users = await createUsers(3, {
            countryId: captain.countryId,
        });

        const res = await executeRequest(captain.id, {
            name: 'Very long team name',
            users,
        });

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept less than 2 members', async () => {
        const captain = await createUser();
        const users = await createUsers(1, {
            countryId: captain.countryId,
        });

        const res = await executeRequest(captain.id, {
            name: 'A team',
            users,
        });

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept more than 5 members', async () => {
        const captain = await createUser();
        const users = await createUsers(6, {
            countryId: captain.countryId,
        });

        const res = await executeRequest(captain.id, {
            name: 'A team',
            users,
        });

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept members from another country', async () => {
        const countries = await createCountries(2);
        const captain = await createUser({
            countryId: countries[0].id,
        });
        const users = await createUsers(3, {
            countryId: countries[1].id,
        });

        const res = await executeRequest(captain.id, {
            name: 'A team',
            users,
        });

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept themselves as member', async () => {
        const captain = await createUser();
        const users = await createUsers(3, {
            countryId: captain.countryId,
        });

        const res = await executeRequest(captain.id, {
            name: 'A team',
            users: [
                ...users,
                captain,
            ],
        });

        expect(res.status).toEqual(201);
        expect(await Team.count()).toBe(1);
        expect(res.body).toHaveProperty('users');
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users).toHaveLength(3); // Excluding themselves
    });

    it('should insert a new team and trim its name', async () => {
        const captain = await createUser();
        const users = await createUsers(3, {
            countryId: captain.countryId,
        });

        const res = await executeRequest(captain.id, {
            name: '   My Team   ',
            users,
        });

        expect(res.status).toEqual(201);
        expect(await Team.count()).toBe(1);
        expect(res.body).toHaveProperty('name', 'My Team');
        expect(res.body).toHaveProperty('users');
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users).toHaveLength(3);
    });

    it('should not be able to create two teams', async () => {
        const captain = await createUser();
        const users = await createUsers(2, {
            countryId: captain.countryId,
        });

        await executeRequest(captain.id, {
            name: 'First team',
            users,
        });

        const res = await executeRequest(captain.id, {
            name: 'Second team',
            users,
        });

        expect(res.status).toEqual(400);
        expect(await Team.count()).toBe(1);
    });

});
