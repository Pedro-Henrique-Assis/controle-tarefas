export const createTables = (db) => {
  // Executa todas as criações de tabela em uma única chamada síncrona
  db.execSync(`
    CREATE TABLE IF NOT EXISTS Aluno (
      RA VARCHAR PRIMARY KEY NOT NULL,
      Nome VARCHAR NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Trabalho (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      Nome VARCHAR NOT NULL,
      Situacao VARCHAR NOT NULL,
      Data_entrega DATE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Aluno_x_Trabalho (
      ID_Trabalho INTEGER NOT NULL,
      RA_Aluno VARCHAR NOT NULL,
      PRIMARY KEY (ID_Trabalho, RA_Aluno),
      FOREIGN KEY (ID_Trabalho) REFERENCES Trabalho(ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (RA_Aluno) REFERENCES Aluno(RA)
        ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Atividade (
      ID_Atividade INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      Descricao VARCHAR NOT NULL,
      Status VARCHAR NOT NULL,
      Horas_trabalhadas REAL NOT NULL DEFAULT 0,
      Trabalho_ID INTEGER NOT NULL,
      Aluno_RA VARCHAR NOT NULL,
      FOREIGN KEY (Trabalho_ID) REFERENCES Trabalho(ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (Aluno_RA) REFERENCES Aluno(RA)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
};