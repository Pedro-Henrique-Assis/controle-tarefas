export const createTables = (db) => {

  // Tabela Aluno
  db.execute(`
    CREATE TABLE IF NOT EXISTS Aluno (
      RA      VARCHAR PRIMARY KEY NOT NULL,
      Nome    VARCHAR NOT NULL
    );
  `);

  // Tabela Trabalho
  db.execute(`
    CREATE TABLE IF NOT EXISTS Trabalho (
      ID            INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      Nome          VARCHAR NOT NULL,
      Situacao      VARCHAR NOT NULL,
      Data_entrega  DATE NOT NULL
    );
  `);

  // Tabela Aluno_x_Trabalho (tabela associativa N:N)
  // Chave primária composta de ID_Trabalho + RA_Aluno
  db.execute(`
    CREATE TABLE IF NOT EXISTS Aluno_x_Trabalho (
      ID_Trabalho   INTEGER NOT NULL,
      RA_Aluno      VARCHAR NOT NULL,
      PRIMARY KEY (ID_Trabalho, RA_Aluno),
      FOREIGN KEY (ID_Trabalho) REFERENCES Trabalho(ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (RA_Aluno)    REFERENCES Aluno(RA)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  // Tabela Atividade
  db.execute(`
    CREATE TABLE IF NOT EXISTS Atividade (
      ID_Atividade  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      Descricao     VARCHAR NOT NULL,
      Status        VARCHAR NOT NULL,
      Trabalho_ID   INTEGER NOT NULL,
      Aluno_RA      VARCHAR NOT NULL,
      FOREIGN KEY (Trabalho_ID) REFERENCES Trabalho(ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (Aluno_RA)    REFERENCES Aluno(RA)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
};