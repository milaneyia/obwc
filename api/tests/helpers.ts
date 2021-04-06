import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import config from '../../config.json';
import Keygrip from 'keygrip';

export async function setupDB (): Promise<void> {
    const connectionOptions = await getConnectionOptions('test');

    await createConnection({
        ...connectionOptions,
        name: 'default', // ActiveRecord won't use another connection name...?
        database: `obwc2021_test_${process.env.JEST_WORKER_ID}` as any,
    });
}

export async function clearDB (): Promise<void> {
    const connection = getConnection();
    await connection.synchronize(true);
    await connection.runMigrations();
}

/**
 * Use in requests like `.set(fakeSession(user.id))`
 * @param userId
 */
export function fakeSession (userId: number): string[] {
    const name = 'obwc.sess';
    const data = Buffer.from(JSON.stringify({ userId })).toString('base64');
    const hash = Keygrip(config.KOA.SESSION_KEYS).sign(name + '=' + data);

    return [name + '=' + data + '; ' + name + '.sig=' + hash + ';'];
}
