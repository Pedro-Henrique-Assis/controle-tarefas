import * as SQLite from 'expo-sqlite';
import { createTables } from './migration';

let db = null;

export const getDatabase = () => {
  if (!db) {
    // Abre o banco de dados de forma síncrona
    db = SQLite.openDatabaseSync('ControleTrabalho.db');

    // Habilita o suporte a chaves estrangeiras no SQLite (usando execSync)
    db.execSync('PRAGMA foreign_keys = ON;');

    // Cria as tabelas se ainda não existirem
    createTables(db);
  }

  return db;
};