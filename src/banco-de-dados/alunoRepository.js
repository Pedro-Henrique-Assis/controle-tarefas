import { getDatabase } from './banco';

// CREATE
export const inserirAluno = async (ra, nome) => {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO Aluno (RA, Nome) VALUES (?, ?);`,
    [ra, nome]
  );
};

// READ - Buscar todos
export const buscarAlunos = async () => {
  const db = getDatabase();
  const result = await db.getAllAsync(`SELECT * FROM Aluno;`);
  // CORREÇÃO: Removido o ".rows". O getAllAsync já retorna o array com os alunos
  return result ?? [];
};

// READ - Buscar por RA
export const buscarAlunoPorRA = async (ra) => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    `SELECT * FROM Aluno WHERE RA = ?;`,
    [ra]
  );
  return result ?? null;
};

// UPDATE
export const atualizarAluno = async (ra, nome) => {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE Aluno SET Nome = ? WHERE RA = ?;`,
    [nome, ra]
  );
};

// DELETE
export const deletarAluno = async (ra) => {
  // CORREÇÃO: Trocado 'await getDbConnection()' por 'getDatabase()'
  const db = getDatabase(); 
  await db.runAsync(
    `DELETE FROM Aluno WHERE RA = ?;`,
    [ra]
  );
};