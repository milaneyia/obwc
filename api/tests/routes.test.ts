import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import app from '../app';
import { Round, CreateTeam } from '../interfaces';

beforeAll(async () => {
    const connection = await createConnection();
    const entities = connection.entityMetadatas;
    const deletes = entities.map(e =>
        connection.getRepository(e.name).query(`DELETE FROM ${e.tableName}`)
    );
    await Promise.all(deletes);
});

afterAll(() => {
    app.close();
    getConnection().close();
});

describe('rounds endpoints', () => {
    it('should list all created rounds', async () => {
        const res = await request(app)
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

        const res = await request(app)
            .post('/api/rounds')
            .send(round);

        expect(res.status).toEqual(201);
        expect(res.body).toBeTruthy();
    });
});

describe('teams endpoints', () => {
    it('should insert a new team', async () => {
        const team: CreateTeam = {
            name: 'My Team',
            users: [{
                id: 1,
                username: 'someone',
            }],
        };

        const res = await request(app)
            .post('/api/teams')
            .send(team);

        expect(res.status).toEqual(201);
        expect(res.body).toBeTruthy();
    });
});
