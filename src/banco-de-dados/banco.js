import { createTables } from './migration';

import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDbConnection() {
    return await SQLite.openDatabaseAsync('ControleTrabalho.db');
}

export async function initializeDatabase() {
    const db = await getDbConnection();
    await createTables(db);
}