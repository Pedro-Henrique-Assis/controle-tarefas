import { getDatabase } from './banco';

// CREATE
export const inserirAlunoXTrabalho = (idTrabalho, raAluno) => {
  const db = getDatabase();
  db.execute(
    `INSERT INTO Aluno_x_Trabalho (ID_Trabalho, RA_Aluno) VALUES (?, ?);`,
    [idTrabalho, raAluno]
  );
};

// READ - Buscar todos os vínculos
export const buscarTodosVinculos = () => {
  const db = getDatabase();
  const result = db.execute(`SELECT * FROM Aluno_x_Trabalho;`);
  return result.rows?._array ?? [];
};

// READ - Buscar trabalhos de um aluno
export const buscarTrabalhosPorAluno = (raAluno) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT t.* FROM Trabalho t
     INNER JOIN Aluno_x_Trabalho at ON t.ID = at.ID_Trabalho
     WHERE at.RA_Aluno = ?;`,
    [raAluno]
  );
  return result.rows?._array ?? [];
};

// READ - Buscar alunos de um trabalho
export const buscarAlunosPorTrabalho = (idTrabalho) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT a.* FROM Aluno a
     INNER JOIN Aluno_x_Trabalho at ON a.RA = at.RA_Aluno
     WHERE at.ID_Trabalho = ?;`,
    [idTrabalho]
  );
  return result.rows?._array ?? [];
};

// UPDATE - Atualiza o vínculo (troca o aluno ou o trabalho da associação)
export const atualizarAlunoXTrabalho = (idTrabalhoAntigo, raAlunoAntigo, idTrabalhoNovo, raAlunoNovo) => {
  const db = getDatabase();
  db.execute(
    `UPDATE Aluno_x_Trabalho 
     SET ID_Trabalho = ?, RA_Aluno = ?
     WHERE ID_Trabalho = ? AND RA_Aluno = ?;`,
    [idTrabalhoNovo, raAlunoNovo, idTrabalhoAntigo, raAlunoAntigo]
  );
};

// DELETE
export const deletarAlunoXTrabalho = (idTrabalho, raAluno) => {
  const db = getDatabase();
  db.execute(
    `DELETE FROM Aluno_x_Trabalho WHERE ID_Trabalho = ? AND RA_Aluno = ?;`,
    [idTrabalho, raAluno]
  );
};