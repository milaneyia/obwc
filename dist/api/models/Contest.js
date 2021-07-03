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
var Contest_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contest = void 0;
const typeorm_1 = require("typeorm");
const Round_1 = require("./Round");
const Team_1 = require("./Team");
let Contest = Contest_1 = class Contest extends typeorm_1.BaseEntity {
    static open() {
        return Contest_1.createQueryBuilder('contest')
            .where('registrationStartedAt <= :now')
            .andWhere('registrationEndedAt > :now')
            .setParameter('now', new Date());
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Contest.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Contest.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Contest.prototype, "announcementAt", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Contest.prototype, "registrationStartedAt", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Contest.prototype, "registrationEndedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => Round_1.Round, (round) => round.contest),
    __metadata("design:type", Array)
], Contest.prototype, "rounds", void 0);
__decorate([
    typeorm_1.OneToMany(() => Team_1.Team, (team) => team.contest),
    __metadata("design:type", Array)
], Contest.prototype, "teams", void 0);
Contest = Contest_1 = __decorate([
    typeorm_1.Entity()
], Contest);
exports.Contest = Contest;
