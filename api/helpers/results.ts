import { Round } from '../models/Round';
import { Team } from '../models/Team';
import { JUDGING_TYPE, Team as ITeam } from '../../shared/models';

export interface TeamScore {
    team: ITeam;
    criteriaSum: {
        criteriaId: number;
        sum: number;
    }[];
    judgingSum: {
        judgeId: number;
        sum: number;
        standardized: number;
    }[];
    rawFinalScore: number;
    standardizedFinalScore: number;
    isEliminated: boolean;
}

export interface JudgeCorrel {
    id: number;
    rawAvg: number;
    avg: number;
    sd: number;
    correl: number;
}

export async function calculateScores(round?: Round, judingType?: JUDGING_TYPE): Promise<{ teamsScores: TeamScore[]; judgesCorrel: JudgeCorrel[] }> {
    const teamsScores: TeamScore[] = [];
    const judgesCorrel: JudgeCorrel[] = [];

    if (!round) {
        return {
            teamsScores,
            judgesCorrel,
        };
    }

    const judges = round.judgeToRounds.map(j => j.user);
    const submissions = round.submissions;

    if (!submissions?.length) {
        const teams = await Team.find({
            where: {
                wasConfirmed: true,
            },
            relations: [
                'users',
                'captain',
                'country',
            ],
        });

        return {
            teamsScores: teams.map(team => ({
                team,
                criteriaSum: [],
                judgingSum: [],
                rawFinalScore: 0,
                standardizedFinalScore: 0,
                isEliminated: false,
            })),
            judgesCorrel,
        };
    }

    for (const submission of submissions) {
        const teamScore: TeamScore = {
            team: submission.team,
            criteriaSum: [],
            judgingSum: [],
            rawFinalScore: 0,
            standardizedFinalScore: 0,
            isEliminated: false,
        };

        for (const judging of submission.judging) {
            let judgeSum = 0;

            for (const judgingToCriteria of judging.judgingToCriterias) {
                judgeSum += judgingToCriteria.score;
                const i = teamScore.criteriaSum.findIndex(j => j.criteriaId === judgingToCriteria.criteriaId);

                if (i !== -1) {
                    teamScore.criteriaSum[i].sum += judgingToCriteria.score;
                } else {
                    teamScore.criteriaSum.push({
                        criteriaId: judgingToCriteria.criteriaId,
                        sum: judgingToCriteria.score,
                    });
                }
            }

            teamScore.judgingSum.push({
                judgeId: judging.judgeId,
                sum: judgeSum,
                standardized: 0,
            });
        }

        teamScore.rawFinalScore = teamScore.criteriaSum.reduce((acc, c) => acc + c.sum, 0);
        teamsScores.push(teamScore);
    }

    if (teamsScores.length) {
        const judgesIds = judges.map(j => j.id);

        for (const judgeId of judgesIds) {
            let judgeSum = 0;
            let judgeAvg = 0;
            let judgeSd = 0;
            let judgeStdSum = 0;

            // Get score avg for the current judge
            for (const teamScore of teamsScores) {
                judgeSum += teamScore.judgingSum.find(j => j.judgeId === judgeId)?.sum || 0;
            }

            judgeAvg = judgeSum / teamsScores.length;

            // Get SD for the current judge
            for (const teamScore of teamsScores) {
                const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                if (judgingSum) {
                    judgeSd += Math.pow(judgingSum.sum - judgeAvg, 2);
                }
            }

            judgeSd = Math.sqrt(judgeSd / teamsScores.length);

            // Set standard score for each entry for the current judge
            for (let i = 0; i < teamsScores.length; i++) {
                const j = teamsScores[i].judgingSum.findIndex(j => j.judgeId === judgeId);

                if (j !== -1) {
                    // S* = S - S(avg) / SD
                    const stdScore = (teamsScores[i].judgingSum[j].sum - judgeAvg) / judgeSd;
                    teamsScores[i].standardizedFinalScore += stdScore;
                    teamsScores[i].judgingSum[j].standardized = stdScore;
                    judgeStdSum += stdScore || 0;
                }
            }

            // Set standard score average for the current judge
            judgesCorrel.push({
                id: judgeId,
                rawAvg: judgeAvg,
                avg: judgeStdSum / teamsScores.length,
                sd: judgeSd,
                correl: 0,
            });
        }

        // Get final standard scores average
        const totalStdAvg = teamsScores.reduce((acc, s) => acc + s.standardizedFinalScore, 0) / teamsScores.length;

        // Set correlation coefficient per judge
        for (const judgeId of judgesIds) {
            const i = judgesCorrel.findIndex(j => j.id === judgeId);
            const judgeAvg = judgesCorrel?.[i]?.avg || 0;

            let sum1 = 0;
            let sum2 = 0;
            let sum3 = 0;

            for (const teamScore of teamsScores) {
                const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                if (judgingSum) {
                    const x = (judgingSum.standardized - judgeAvg);
                    const y = (teamScore.standardizedFinalScore - totalStdAvg);
                    sum1 += x * y;
                    sum2 += Math.pow(x, 2);
                    sum3 += Math.pow(y, 2);
                }
            }

            judgesCorrel[i].correl = sum1 / (Math.sqrt(sum2 * sum3));
        }
    }

    teamsScores.sort((a, b) => b.standardizedFinalScore - a.standardizedFinalScore);

    if (judingType === JUDGING_TYPE.Mappers) {
        const countryIds = new Set(teamsScores.map(t => t.team.country.id));

        // Eliminate teams from countries with more than 1 team
        for (const countryId of countryIds) {
            const countryScores = teamsScores.filter(t => t.team.country.id === countryId);

            for (let i = 1; i < countryScores.length; i++) {
                countryScores[i].isEliminated = true;
            }
        }
    }

    return {
        teamsScores,
        judgesCorrel,
    };
}
