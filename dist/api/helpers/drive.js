"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.cleanUpload = exports.findFile = exports.updateFile = exports.createFile = exports.init = void 0;
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const drive_json_1 = __importDefault(require("../../drive.json"));
const config_json_1 = __importDefault(require("../../config.json"));
const scopes = [
    'https://www.googleapis.com/auth/drive',
];
function init() {
    const auth = new googleapis_1.google.auth.JWT({
        email: drive_json_1.default.client_email,
        key: drive_json_1.default.private_key,
        scopes,
    });
    googleapis_1.google.options({ auth });
}
exports.init = init;
function generateParams(file) {
    return {
        media: {
            body: fs_1.default.createReadStream(file.path),
        },
        fields: 'id',
    };
}
function verifyFile(file) {
    if (!file?.name?.endsWith('.osz')) {
        throw new Error('Invalid file');
    }
}
async function createFile(file, fileName) {
    verifyFile(file);
    init();
    const drive = googleapis_1.google.drive('v3');
    const { data } = await drive.files.create({
        ...generateParams(file),
        requestBody: {
            name: fileName,
            parents: [config_json_1.default.DRIVE.OSU_FOLDER],
        },
    });
    if (!data.id) {
        throw new Error();
    }
    return data.id;
}
exports.createFile = createFile;
async function updateFile(id, file, fileName) {
    verifyFile(file);
    init();
    const drive = googleapis_1.google.drive('v3');
    const { data } = await drive.files.update({
        ...generateParams(file),
        requestBody: {
            name: fileName,
        },
        fileId: id,
    });
    if (!data.id) {
        throw new Error();
    }
    return data.id;
}
exports.updateFile = updateFile;
async function findFile(id) {
    const drive = googleapis_1.google.drive('v3');
    const { data } = await drive.files.list({
        q: `id = '${id}' and parents in '${config_json_1.default.DRIVE.OSU_FOLDER}'`,
        fields: 'id, name',
    });
    return data.files || [];
}
exports.findFile = findFile;
async function cleanUpload(filePath) {
    await fs_1.default.promises.unlink(filePath);
}
exports.cleanUpload = cleanUpload;
async function downloadFile(id) {
    init();
    const drive = googleapis_1.google.drive('v3');
    const { data } = await drive.files.get({
        fileId: id,
        alt: 'media',
    }, { responseType: 'stream' });
    return data;
}
exports.downloadFile = downloadFile;
