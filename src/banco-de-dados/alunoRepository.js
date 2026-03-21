import { getDatabase } from './banco';

// CREATE
export const inserirAluno = (ra, nome) => {
  const db = getDatabase();
  db.execute(
    `INSERT INTO Aluno (RA, Nome) VALUES (?, ?);`,
    [ra, nome]
  );
};

// READ - Buscar todos
export const buscarAlunos = () => {
  const db = getDatabase();
  const result = db.execute(`SELECT * FROM Aluno;`);
  return result.rows?._array ?? [];
};

// READ - Buscar por RA
export const buscarAlunoPorRA = (ra) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Aluno WHERE RA = ?;`,
    [ra]
  );
  return result.rows?._array[0] ?? null;
};

// UPDATE
export const atualizarAluno = (ra, nome) => {
  const db = getDatabase();
  db.execute(
    `UPDATE Aluno SET Nome = ? WHERE RA = ?;`,
    [nome, ra]
  );
};

// DELETE
export const deletarAluno = (ra) => {
  const db = getDatabase();
  db.execute(
    `DELETE FROM Aluno WHERE RA = ?;`,
    [ra]
  );
};