import request from 'supertest';
import { createConnection, FindOperator, getConnection, getConnectionOptions, Not } from 'typeorm';
import Router from '@koa/router';
import { Server } from 'node:http';
import app from '../app';
import { Round as IRound, CreateTeam } from '../interfaces';
import { Team } from '../models/Team';
import { Round } from '../models/Round';
import { User } from '../models/User';
import { Country } from '../models/Country';
import { ROLE } from '../models/Role';

let server: Server;
let user: User;

beforeAll(async () => {
    let connectionOptions = await getConnectionOptions();
    connectionOptions = {
        ...connectionOptions,
        dropSchema: true,
        migrationsRun: true,
        synchronize: true,
    };
    await createConnection(connectionOptions);

    user = await User.findOneOrFail(1);

    app.use(
        new Router().all('(.*)', async (ctx, next) => {
        ctx.session!.userId = user.id;
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
        const round: IRound = {
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
        expect(await Round.count()).toBe(1);
    });
});

async function executeRequest (team: CreateTeam) {
    return await request(server)
        .post('/api/teams')
        .send(team);
}

interface ValidCondition {
    country?: Country;
    countryId?: FindOperator<number>;
    id: FindOperator<number>;
}

async function getUsers (take: number, condition?: ValidCondition) {
    const validCondition = {
        country: user.country,
        id: Not(user.id),
    };

    return await User.find({
        where: condition || validCondition,
        take,
    });
}

describe('teams endpoints', () => {
    let team: CreateTeam;

    beforeEach(async () => {
        team = {
            name: ' My Team ',
            users: [],
        };

        await Team.delete({});
    });

    it('should not accept long team name', async () => {
        team.name = 'Very long team name';
        team.users = await getUsers(3);
        const res = await executeRequest(team);

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept less than 2 members', async () => {
        team.users = await getUsers(1);
        const res = await executeRequest(team);

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept more than 5 members', async () => {
        team.users = await getUsers(6);
        const res = await executeRequest(team);

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept members from another country', async () => {
        team.users = await getUsers(3, {
            countryId: Not(user.country.id),
            id: Not(user.id),
        });
        const res = await executeRequest(team);

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(await Team.count()).toBe(0);
    });

    it('should not accept themselves as member', async () => {
        team.users = [
            ...await getUsers(3),
            user,
        ];
        const res = await executeRequest(team);

        expect(res.status).toEqual(201);
        expect(await Team.count()).toBe(1);
        expect(res.body).toHaveProperty('users');
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users).toHaveLength(3); // Excluding themselves
    });

    it('should insert a new team and trim its name', async () => {
        team.users = await getUsers(3);
        const res = await executeRequest(team);

        expect(res.status).toEqual(201);
        expect(await Team.count()).toBe(1);
        expect(res.body).toHaveProperty('name', 'My Team');
        expect(res.body).toHaveProperty('users');
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users).toHaveLength(3);
    });

    it('should not be able to create two teams', async () => {
        team.users = await getUsers(3);
        await executeRequest(team);
        const res = await executeRequest(team);
        expect(res.status).toEqual(400);
        expect(await Team.count()).toBe(1);
    });
});

describe('users endpoints', () => {
    it('should query by username', async () => {
        const res = await request(server)
            .get('/api/users?user=milan');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].username).toBe('Milan-');
    });

    it('should query by osu ID', async () => {
        const res = await request(server)
            .get('/api/users?user=1052994');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].osuId).toBe(1052994);
    });

    it('should update user role', async () => {
        const updatedUser = await User.findOneOrFail({
            id: Not(user.id),
            roleId: ROLE.User,
        });

        const res = await request(server)
            .put('/api/users/' + updatedUser.id)
            .send({
                roleId: ROLE.Restricted,
            });

        await updatedUser.reload();

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('roleId', ROLE.Restricted);
        expect(updatedUser.roleId).toBe(ROLE.Restricted);
    });
});
