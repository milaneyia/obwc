"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("lru-cache"));
const cache = new lru_cache_1.default({
    max: 100,
    maxAge: 1000 * 60 * 60 * 24 * 7,
});
exports.default = cache;
