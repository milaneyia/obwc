import { getConnection } from 'typeorm';
import { Country } from '../models/Country';
import { ROLE } from '../models/Role';
import { User } from '../models/User';
import { Round } from '../models/Round';
import { Submission } from '../models/Submission';
import { JudgeToRound } from '../models/judging/JudgeToRound';
import faker from 'faker';
import { Judging } from '../models/judging/Judging';
import { Team } from '../models/Team';
import { Contest } from '../models/Contest';

export async function createCountries (count: number): Promise<Country[]> {
    const countries: Partial<Country>[] = [];

    for (let i = 0; i < count; i++) {
        countries.push({
            name: faker.unique(faker.address.country),
            code: faker.unique(faker.address.countryCode),
        });
    }

    const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Country)
        .values(countries)
        .execute();

    return await Country.findByIds(result.identifiers);
}

export async function createCountry (): Promise<Country> {
    const countries = await createCountries(1);

    return countries[0];
}

interface CreateUsersOptions {
    roleId?: ROLE;
    countryId?: number;
}

export async function createUsers (count: number, options?: CreateUsersOptions): Promise<User[]> {
    let countries: Country[] = [];

    if (!options?.countryId) {
        countries = await createCountries(count);
    }

    const users: Partial<User>[] = [];

    for (let i = 0; i < count; i++) {
        users.push({
            username: faker.unique(faker.name.findName),
            osuId: faker.unique(faker.datatype.number),
            countryId: options?.countryId || countries[i].id,
            roleId: options?.roleId || ROLE.User,
        });
    }

    const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(users)
        .execute();

    return await User.findByIds(result.identifiers);
}

export async function createUser (options?: CreateUsersOptions): Promise<User> {
    const users = await createUsers(1, options);

    return users[0];
}

interface CreateContestOptions {
    isOpen?: boolean;
}

export function createContest (options?: CreateContestOptions): Promise<Contest> {
    const contest = new Contest();
    contest.name = faker.name.jobDescriptor();
    contest.isOpen = options?.isOpen !== undefined ? options.isOpen : true;

    return contest.save();
}

export async function createRound (contest: Contest): Promise<Round> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await Round.fillAndSave({
        submissionsStartedAt: yesterday,
        submissionsEndedAt: tomorrow,
        judgingStartedAt: yesterday,
        judgingEndedAt: tomorrow,
        resultsAt: tomorrow,
        songs: [{
            title: 'new song',
            link: 'https://osu.ppy.sh/beatmaps/artists',
        }],
        judgeToRounds: [],
        contest,
    });
}

export async function createJudging (judgeToRound: JudgeToRound, submission: Submission): Promise<Judging> {
    const judging = new Judging();
    judging.submission = submission;
    judging.judge = judgeToRound.user;
    judging.comment = faker.lorem.text();

    return await judging.save();
}

export async function createTeam (captain: User, contest: Contest): Promise<Team> {
    const team = new Team();
    team.name = faker.company.companyName();
    team.countryId = captain.countryId;
    team.captainId = captain.id;
    team.contest = contest;

    return await team.save();
}
