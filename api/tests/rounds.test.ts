import { Server } from 'node:http';
import { getConnection } from 'typeorm';
import request from 'supertest';
import { JudgeToRound } from '../models/judging/JudgeToRound';
import { Round } from '../models/Round';
import { clearDB, fakeSession, setupDB } from './helpers';
import { ROLE } from '../models/Role';
import { createRound, createUser, createUsers } from './factory';
import { CreateJudgeToRound } from '../../shared/interfaces';
import { JUDGING_TYPE } from '../models/judging/JudgingType';
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

describe('rounds endpoints', () => {

    it('should list all created rounds', async () => {
        const res = await request(server)
            .get('/api/rounds');

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should insert a new round', async () => {
        const staff = await createUser({
            roleId: ROLE.Staff,
        });
        const users = await createUsers(3);
        const mappersJudges: CreateJudgeToRound[] = users.map(user => ({
            user,
            judgingTypeId: JUDGING_TYPE.Mappers,
        }));
        const playersJudges: CreateJudgeToRound[] = users.map(user => ({
            user,
            judgingTypeId: JUDGING_TYPE.Players,
        }));
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await request(server)
            .post('/api/rounds')
            .set('Cookie', fakeSession(staff.id))
            .send({
                submissionsStartedAt: now,
                submissionsEndedAt: tomorrow,
                judgingStartedAt: now,
                judgingEndedAt: tomorrow,
                resultsAt: tomorrow,
                judgeToRounds: [
                    ...mappersJudges,
                    ...playersJudges,
                ],
                songs: [{
                    title: 'new song',
                    link: 'https://osu.ppy.sh/beatmaps/artists',
                }],
            });

        expect(res.status).toEqual(201);
        expect(res.body).toBeTruthy();
        expect(await Round.count()).toBe(1);
        expect(await JudgeToRound.count()).toBe(6);
    });

    it('should update a created round', async () => {
        const staff = await createUser({
            roleId: ROLE.Staff,
        });
        const round = await createRound();
        const users = await createUsers(3);
        round.judgeToRounds = [{
            user: users[0],
            judgingTypeId: JUDGING_TYPE.Mappers,
        } as JudgeToRound];
        await round.save();

        expect(round.judgeToRounds).toHaveLength(1);
        expect(round.songs).toHaveLength(1);

        const mappersJudges: CreateJudgeToRound[] = users.slice(1).map(user => ({
            user,
            judgingTypeId: JUDGING_TYPE.Mappers,
        }));
        const now = new Date();

        const res = await request(server)
            .put('/api/rounds/' + round.id)
            .set('Cookie', fakeSession(staff.id))
            .send({
                submissionsStartedAt: now,
                submissionsEndedAt: now,
                judgingStartedAt: now,
                judgingEndedAt: now,
                resultsAt: now,
                judgeToRounds: mappersJudges,
                songs: [{
                    title: 'A new song',
                    link: 'https://osu.ppy.sh/beatmaps/artists',
                }],
            });

        const updatedRound: Round = res.body;

        expect(res.status).toEqual(200);
        expect(updatedRound.judgeToRounds).toHaveLength(2);
        expect(updatedRound.songs).toHaveLength(1);
        expect(round.songs[0].title).not.toBe(updatedRound.songs[0].title);
    });

});
