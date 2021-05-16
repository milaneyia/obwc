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
exports.Team = void 0;
const typeorm_1 = require("typeorm");
const Contest_1 = require("./Contest");
const Country_1 = require("./Country");
const Submission_1 = require("./Submission");
const User_1 = require("./User");
let Team = class Team extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Team.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Team.prototype, "wasConfirmed", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Contest_1.Contest, { nullable: false }),
    __metadata("design:type", Contest_1.Contest)
], Team.prototype, "contest", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Team.prototype, "countryId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, (country) => country.teams, { nullable: false }),
    __metadata("design:type", Country_1.Country)
], Team.prototype, "country", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Team.prototype, "captainId", void 0);
__decorate([
    typeorm_1.OneToOne(() => User_1.User, (user) => user.captainFor, { nullable: false }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], Team.prototype, "captain", void 0);
__decorate([
    typeorm_1.OneToMany(() => User_1.User, (user) => user.team),
    __metadata("design:type", Array)
], Team.prototype, "users", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1.User, (user) => user.invitations),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Team.prototype, "invitations", void 0);
__decorate([
    typeorm_1.OneToMany(() => Submission_1.Submission, (submissions) => submissions.team),
    __metadata("design:type", Array)
], Team.prototype, "submissions", void 0);
Team = __decorate([
    typeorm_1.Entity()
], Team);
exports.Team = Team;
