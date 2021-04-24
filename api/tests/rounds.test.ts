import { Server } from 'node:http';
import { getConnection } from 'typeorm';
import request from 'supertest';
import { JudgeToRound } from '../models/judging/JudgeToRound';
import { Round } from '../models/Round';
import { clearDB, fakeSession, setupDB } from './helpers';
import { ROLE } from '../models/Role';
import { createContest, createRound, createUser, createUsers } from './factory';
import { CreateJudgeToRound, CreateRound } from '../../shared/integration';
import app from '../app';
import { JUDGING_TYPE } from '../../shared/models';

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

    it('should update a created round', async () => {
        const [staff, contest] = await Promise.all([
            createUser({
                roleId: ROLE.Staff,
            }),
            createContest(),
        ]);
        const round = await createRound(contest);
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
        const data: CreateRound = {
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
            contest,
        };

        const res = await request(server)
            .put('/api/staff/rounds/' + round.id)
            .set('Cookie', fakeSession(staff.id))
            .send(data);

        const updatedRound: Round = res.body;

        expect(res.status).toEqual(200);
        expect(updatedRound.judgeToRounds).toHaveLength(2);
        expect(updatedRound.songs).toHaveLength(1);
        expect(round.songs[0].title).not.toBe(updatedRound.songs[0].title);
    });

});
