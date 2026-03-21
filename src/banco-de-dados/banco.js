import { open } from '@op-engineering/op-sqlite';
import { createTables } from './migration';

let db = null;

export const getDatabase = () => {
  if (!db) {
    db = open({ name: 'ControleTrabalho.db' });

    // Habilita o suporte a chaves estrangeiras no SQLite
    db.execute('PRAGMA foreign_keys = ON;');

    // Cria as tabelas se ainda não existirem
    createTables(db);
  }

  return db;
};