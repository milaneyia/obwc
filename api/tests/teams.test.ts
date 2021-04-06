import { Server } from 'node:http';
import request from 'supertest';
import { getConnection } from 'typeorm';
import { Team } from '../models/Team';
import { CreateTeam } from '../interfaces';
import { clearDB, fakeSession, setupDB } from './helpers';
import app from '../app';
import { createUser, createUsers, createCountries, createTeam } from './factory';

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

describe('teams creation', () => {

    async function executeRequest (captainId: number, team: CreateTeam) {
        return await request(server)
            .post('/api/teams')
            .set('Cookie', fakeSession(captainId))
            .send(team);
    }

    it('should not accept long team name', async () => {
        const captain = await createUser();
        const users = await createUsers(3, {
            countryId: captain.countryId,
        });

        const res = await executeRequest(captain.id, {
            name: 'Very long team name',
            invitations: users,
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
            invitations: users,
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
            invitations: users,
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
            invitations: users,
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
            invitations: [
                ...users,
                captain,
            ],
        });

        expect(res.status).toEqual(201);
        expect(await Team.count()).toBe(1);
        expect(res.body).toHaveProperty('invitations');
        expect(Array.isArray(res.body.invitations)).toBe(true);
        expect(res.body.invitations).toHaveLength(3); // Excluding themselves
    });

    it('should not be able to create two teams', async () => {
        const captain = await createUser();
        const users = await createUsers(2, {
            countryId: captain.countryId,
        });

        await executeRequest(captain.id, {
            name: 'First team',
            invitations: users,
        });

        const res = await executeRequest(captain.id, {
            name: 'Second team',
            invitations: users,
        });

        expect(res.status).toEqual(400);
        expect(await Team.count()).toBe(1);
    });

    it('should insert a new team and trim its name', async () => {
        const captain = await createUser();
        const users = await createUsers(3, {
            countryId: captain.countryId,
        });

        const res = await executeRequest(captain.id, {
            name: '   My Team   ',
            invitations: users,
        });

        expect(res.status).toEqual(201);
        expect(await Team.count()).toBe(1);
        expect(res.body).toHaveProperty('name', 'My Team');
        expect(res.body).toHaveProperty('invitations');
        expect(Array.isArray(res.body.invitations)).toBe(true);
        expect(res.body.invitations).toHaveLength(3);
    });

});

describe('teams invitations', () => {

    it('should fail when user is captain', async () => {
        const captain = await createUser();
        const team = await createTeam(captain);
        team.invitations = [captain];
        await team.save();

        const res = await request(server)
            .post(`/api/teams/${team.id}/acceptInvitation`)
            .set('Cookie', fakeSession(captain.id));

        await captain.reload();

        expect(res.status).toEqual(400);
        expect(captain.teamId).toBeFalsy();
    });

    it('should fail when user has a team', async () => {
        const captain = await createUser();
        const users = await createUsers(2, {
            countryId: captain.countryId,
        });
        const user = users[0];

        let team = await createTeam(captain);
        team.invitations = [user];
        await team.save();

        const captain2 = users[1];
        const team2 = await createTeam(captain2);
        team2.users = [user];
        await team2.save();

        const res = await request(server)
            .post(`/api/teams/${team.id}/acceptInvitation`)
            .set('Cookie', fakeSession(user.id));

        await user.reload();
        team = await Team.findOneOrFail(team.id, {
            relations: ['users'],
        });

        expect(res.status).toEqual(400);
        expect(team.users).toHaveLength(0);
        expect(user.teamId).toBe(team2.id);
    });

    it('should fail when invitation doesnt exist', async () => {
        const captain = await createUser();
        const team = await createTeam(captain);
        const user = await createUser({
            countryId: captain.countryId,
        });

        const res = await request(server)
            .post(`/api/teams/${team.id}/acceptInvitation`)
            .set('Cookie', fakeSession(user.id));

        await user.reload();

        expect(res.status).toEqual(400);
        expect(user.teamId).toBeFalsy();
    });

    it('should accept an invitation', async () => {
        const captain = await createUser();
        const team = await createTeam(captain);
        const user = await createUser({
            countryId: captain.countryId,
        });
        team.invitations = [user];
        await team.save();

        expect(user.teamId).toBeFalsy();

        const res = await request(server)
            .post(`/api/teams/${team.id}/acceptInvitation`)
            .set('Cookie', fakeSession(user.id));

        await user.reload();

        expect(res.status).toEqual(200);
        expect(res.body.users).toHaveLength(1);
        expect(user.teamId).toBe(team.id);
    });

});
