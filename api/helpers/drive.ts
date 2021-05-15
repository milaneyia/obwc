import fs from 'fs';
import { drive_v3, google } from 'googleapis';
import { File as FFile } from 'formidable';
import credentials from '../../drive.json';
import config from '../../config.json';

const scopes = [
    'https://www.googleapis.com/auth/drive',
];

export function init (): void {
    const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes,
    });

    google.options({ auth });
}

function generateParams (file: FFile): drive_v3.Params$Resource$Files$Create | drive_v3.Params$Resource$Files$Update {
    return {
        media: {
            body: fs.createReadStream(file.path),
        },
        fields: 'id',
    };
}

function verifyFile (file: FFile | undefined): void {
    if (!file?.name?.endsWith('.osz')) {
        throw new Error('Invalid file');
    }
}

export async function createFile (file: FFile | undefined, fileName: string): Promise<string> {
    verifyFile(file);
    init();

    const drive = google.drive('v3');
    const { data } = await drive.files.create({
        ...generateParams(file!),
        requestBody: {
            name: fileName,
            parents: [config.DRIVE.OSU_FOLDER],
        },
    });

    if (!data.id) {
        throw new Error();
    }

    return data.id;
}

export async function updateFile (id: string, file: FFile | undefined, fileName: string): Promise<string> {
    verifyFile(file);
    init();

    const drive = google.drive('v3');
    const { data } = await drive.files.update({
        ...generateParams(file!),
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

export async function findFile (id: string): Promise<drive_v3.Schema$File[]> {
    const drive = google.drive('v3');

    const { data } = await drive.files.list({
        q: `id = '${id}' and parents in '${config.DRIVE.OSU_FOLDER}'`,
        fields: 'id, name',
    });

    return data.files || [];
}

export async function cleanUpload (filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
}
