import { getDbConnection } from './banco';

// CREATE
export const inserirAluno = async (ra, nome) => {
  const db = await getDbConnection();
  await db.runAsync(
    `INSERT INTO Aluno (RA, Nome) VALUES (?, ?);`,
    [ra, nome]
  );
};

// READ - Buscar todos
export const buscarAlunos = async () => {
  const db = await getDbConnection();
  const result = await db.getAllAsync(`SELECT * FROM Aluno;`);
  return result.rows ?? [];
};

// READ - Buscar por RA
export const buscarAlunoPorRA = async (ra) => {
  const db = await getDbConnection();
  const result = await db.getFirstAsync(
    `SELECT * FROM Aluno WHERE RA = ?;`,
    [ra]
  );
  return result ?? null;
};

// UPDATE
export const atualizarAluno = async (ra, nome) => {
  const db = await getDbConnection();
  await db.runAsync(
    `UPDATE Aluno SET Nome = ? WHERE RA = ?;`,
    [nome, ra]
  );
};

// DELETE
export const deletarAluno = async (ra) => {
  const db = await getDbConnection();
  await db.runAsync(
    `DELETE FROM Aluno WHERE RA = ?;`,
    [ra]
  );
};