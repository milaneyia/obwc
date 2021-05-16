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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgeToRound = void 0;
const typeorm_1 = require("typeorm");
const Round_1 = require("../Round");
const User_1 = require("../User");
const JudgingType_1 = require("./JudgingType");
let JudgeToRound = class JudgeToRound extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], JudgeToRound.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], JudgeToRound.prototype, "roundId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Round_1.Round, round => round.judgeToRounds, {
        orphanedRowAction: 'delete',
    }),
    __metadata("design:type", Round_1.Round)
], JudgeToRound.prototype, "round", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], JudgeToRound.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.judgeToRounds),
    __metadata("design:type", User_1.User)
], JudgeToRound.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], JudgeToRound.prototype, "judgingTypeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => JudgingType_1.JudgingType),
    __metadata("design:type", JudgingType_1.JudgingType)
], JudgeToRound.prototype, "judgingType", void 0);
JudgeToRound = __decorate([
    typeorm_1.Entity()
], JudgeToRound);
exports.JudgeToRound = JudgeToRound;
