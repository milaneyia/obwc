"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Round_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Round = exports.ResultsScope = exports.RoundScope = void 0;
const typeorm_1 = require("typeorm");
const Contest_1 = require("./Contest");
const JudgeToRound_1 = require("./judging/JudgeToRound");
const Song_1 = require("./Song");
const Submission_1 = require("./Submission");
var RoundScope;
(function (RoundScope) {
    RoundScope["Submission"] = "SUBMISSION";
    RoundScope["Judging"] = "JUDGING";
    RoundScope["Results"] = "RESULTS";
})(RoundScope = exports.RoundScope || (exports.RoundScope = {}));
var ResultsScope;
(function (ResultsScope) {
    ResultsScope["User"] = "USER";
    ResultsScope["Staff"] = "STAFF";
})(ResultsScope = exports.ResultsScope || (exports.ResultsScope = {}));
let Round = Round_1 = class Round extends typeorm_1.BaseEntity {
    static currentRound(scope) {
        const query = Round_1.createQueryBuilder('round')
            .leftJoin('round.submissions', 'submissions')
            .leftJoin('round.judgeToRounds', 'judgeToRounds');
        if (scope === RoundScope.Submission) {
            query.where('round.submissionsStartedAt <= :now')
                .andWhere('round.submissionsEndedAt > :now');
        }
        else if (scope === RoundScope.Judging) {
            query.where('round.judgingStartedAt <= :now')
                .andWhere('round.judgingEndedAt > :now');
        }
        else if (scope === RoundScope.Results) {
            query.where('round.resultsAt <= :now');
        }
        return query.setParameter('now', new Date())
            .select([
            'round.id',
            'submissions.id',
            'submissions.anonymisedAs',
            'judgeToRounds',
        ])
            .orderBy('submissions.anonymisedAs');
    }
    static findResults(id, judgingType, scope) {
        const query = this
            .createQueryBuilder('round')
            .leftJoinAndSelect('round.submissions', 'submissions')
            .leftJoinAndSelect('round.judgeToRounds', 'judgeToRounds')
            .leftJoinAndSelect('judgeToRounds.user', 'user')
            .leftJoinAndSelect('submissions.judging', 'judging')
            .leftJoinAndSelect('submissions.team', 'team')
            .leftJoinAndSelect('team.country', 'country')
            .leftJoinAndSelect('judging.judge', 'judge')
            .leftJoinAndSelect('judging.judgingToCriterias', 'judgingToCriterias')
            .leftJoinAndSelect('judgingToCriterias.criteria', 'criteria')
            .where('round.id = :id', { id })
            .andWhere('judgeToRounds.judgingTypeId = :judgingTypeId')
            .andWhere('criteria.judgingTypeId = :judgingTypeId')
            .setParameter('judgingTypeId', judgingType);
        if (scope === ResultsScope.User) {
            query.andWhere('round.resultsAt <= :now', { now: new Date() });
        }
        return query.getOne();
    }
    static fillAndSave(input, round) {
        round.submissionsStartedAt = input.submissionsStartedAt;
        round.submissionsEndedAt = input.submissionsEndedAt;
        round.judgingStartedAt = input.judgingStartedAt;
        round.judgingEndedAt = input.judgingEndedAt;
        round.resultsAt = input.resultsAt;
        round.judgeToRounds = input.judgeToRounds;
        round.songs = input.songs;
        round.downloadLink = input.downloadLink || null;
        return round.save();
    }
    getJudgeType(userId) {
        return this.judgeToRounds.find(j => j.userId === userId)?.judgingTypeId;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Round.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Round.prototype, "submissionsStartedAt", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Round.prototype, "submissionsEndedAt", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Round.prototype, "judgingStartedAt", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Round.prototype, "judgingEndedAt", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Round.prototype, "resultsAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Round.prototype, "downloadLink", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Contest_1.Contest, (contest) => contest.rounds, { nullable: false }),
    __metadata("design:type", Contest_1.Contest)
], Round.prototype, "contest", void 0);
__decorate([
    typeorm_1.OneToMany(() => JudgeToRound_1.JudgeToRound, (judgeToRound) => judgeToRound.round, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Round.prototype, "judgeToRounds", void 0);
__decorate([
    typeorm_1.OneToMany(() => Song_1.Song, (song) => song.round, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Round.prototype, "songs", void 0);
__decorate([
    typeorm_1.OneToMany(() => Submission_1.Submission, (submission) => submission.round),
    __metadata("design:type", Array)
], Round.prototype, "submissions", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Round.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Round.prototype, "updatedAt", void 0);
Round = Round_1 = __decorate([
    typeorm_1.Entity()
], Round);
exports.Round = Round;
