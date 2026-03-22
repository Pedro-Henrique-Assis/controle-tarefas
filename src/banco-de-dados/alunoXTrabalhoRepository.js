import { getDatabase } from './banco';

// CREATE
export const inserirAlunoXTrabalho = async (idTrabalho, raAluno) => {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO Aluno_x_Trabalho (ID_Trabalho, RA_Aluno) VALUES (?, ?);`,
    [idTrabalho, raAluno]
  );
};

// READ - Buscar todos os vínculos
export const buscarTodosVinculos = async () => {
  const db = getDatabase();
  const result = await db.getAllAsync(`SELECT * FROM Aluno_x_Trabalho;`);
  return result.rows ?? [];
};

// READ - Buscar trabalhos de um aluno
export const buscarTrabalhosPorAluno = async (raAluno) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT t.* FROM Trabalho t
     INNER JOIN Aluno_x_Trabalho at ON t.ID = at.ID_Trabalho
     WHERE at.RA_Aluno = ?;`,
    [raAluno]
  );
  return result.rows ?? [];
};

// READ - Buscar alunos de um trabalho
export const buscarAlunosPorTrabalho = async (idTrabalho) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT a.* FROM Aluno a
     INNER JOIN Aluno_x_Trabalho at ON a.RA = at.RA_Aluno
     WHERE at.ID_Trabalho = ?;`,
    [idTrabalho]
  );
  return result.rows ?? [];
};

// UPDATE - Atualiza o vínculo (troca o aluno ou o trabalho da associação)
export const atualizarAlunoXTrabalho = async (idTrabalhoAntigo, raAlunoAntigo, idTrabalhoNovo, raAlunoNovo) => {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE Aluno_x_Trabalho
     SET ID_Trabalho = ?, RA_Aluno = ?
     WHERE ID_Trabalho = ? AND RA_Aluno = ?;`,
    [idTrabalhoNovo, raAlunoNovo, idTrabalhoAntigo, raAlunoAntigo]
  );
};

// DELETE
export const deletarAlunoXTrabalho = async (idTrabalho, raAluno) => {
  const db = getDatabase();
  await db.runAsync(
    `DELETE FROM Aluno_x_Trabalho WHERE ID_Trabalho = ? AND RA_Aluno = ?;`,
    [idTrabalho, raAluno]
  );
};