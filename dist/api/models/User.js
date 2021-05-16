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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Country_1 = require("./Country");
const JudgeToRound_1 = require("./judging/JudgeToRound");
const Role_1 = require("./Role");
const Team_1 = require("./Team");
let User = class User extends typeorm_1.BaseEntity {
    getVirtuals() {
        this.isUser = this.roleId === Role_1.ROLE.User;
        this.isRestricted = this.roleId === Role_1.ROLE.Restricted;
        this.isStaff = this.roleId === Role_1.ROLE.Staff;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", Number)
], User.prototype, "osuId", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Role_1.Role, { nullable: false }),
    __metadata("design:type", Role_1.Role)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "countryId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, (country) => country.users, { nullable: false, eager: true }),
    __metadata("design:type", Country_1.Country)
], User.prototype, "country", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "teamId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Team_1.Team, (team) => team.users, {
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Object)
], User.prototype, "team", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Team_1.Team, (team) => team.invitations),
    __metadata("design:type", Array)
], User.prototype, "invitations", void 0);
__decorate([
    typeorm_1.OneToOne(() => Team_1.Team, (team) => team.captain),
    __metadata("design:type", Team_1.Team)
], User.prototype, "captainFor", void 0);
__decorate([
    typeorm_1.OneToMany(() => JudgeToRound_1.JudgeToRound, (judgeToRound) => judgeToRound.user),
    __metadata("design:type", Array)
], User.prototype, "judgeToRounds", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "getVirtuals", null);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
