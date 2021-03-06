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
var Submission_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const typeorm_1 = require("typeorm");
const Judging_1 = require("./judging/Judging");
const Round_1 = require("./Round");
const Team_1 = require("./Team");
let Submission = Submission_1 = class Submission extends typeorm_1.BaseEntity {
    static fillAndSave(information, round, team, fileId, submission) {
        if (!submission) {
            submission = new Submission_1();
        }
        submission.information = information;
        submission.round = round;
        submission.team = team;
        submission.originalPath = fileId;
        return submission.save();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Submission.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Submission.prototype, "originalPath", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Submission.prototype, "anonymisedAs", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Submission.prototype, "teamId", void 0);
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], Submission.prototype, "information", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Team_1.Team, (team) => team.submissions, { nullable: false }),
    __metadata("design:type", Team_1.Team)
], Submission.prototype, "team", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Round_1.Round, (round) => round.submissions, { nullable: false }),
    __metadata("design:type", Round_1.Round)
], Submission.prototype, "round", void 0);
__decorate([
    typeorm_1.OneToMany(() => Judging_1.Judging, (judging) => judging.submission),
    __metadata("design:type", Array)
], Submission.prototype, "judging", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Submission.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Submission.prototype, "updatedAt", void 0);
Submission = Submission_1 = __decorate([
    typeorm_1.Entity()
], Submission);
exports.Submission = Submission;
