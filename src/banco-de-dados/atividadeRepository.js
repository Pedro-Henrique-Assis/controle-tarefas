import { getDatabase } from './banco';

export const inserirAtividade = (descricao, status, horasTrabalhadas, trabalhoId, alunoRA) => {
  const db = getDatabase();
  db.execute(
    `INSERT INTO Atividade (Descricao, Status, Horas_trabalhadas, Trabalho_ID, Aluno_RA)
     VALUES (?, ?, ?, ?, ?);`,
    [descricao, status, horasTrabalhadas, trabalhoId, alunoRA]
  );
};

export const buscarAtividades = () => {
  const db = getDatabase();
  const result = db.execute(`SELECT * FROM Atividade;`);
  return result.rows?._array ?? [];
};

export const buscarAtividadesPorTrabalho = (trabalhoId) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Atividade WHERE Trabalho_ID = ?;`,
    [trabalhoId]
  );
  return result.rows?._array ?? [];
};

export const buscarAtividadesPorAluno = (alunoRA) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Atividade WHERE Aluno_RA = ?;`,
    [alunoRA]
  );
  return result.rows?._array ?? [];
};

export const buscarAtividadePorID = (id) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Atividade WHERE ID_Atividade = ?;`,
    [id]
  );
  return result.rows?._array[0] ?? null;
};

export const atualizarAtividade = (id, descricao, status, horasTrabalhadas, trabalhoId, alunoRA) => {
  const db = getDatabase();
  db.execute(
    `UPDATE Atividade
     SET Descricao = ?, Status = ?, Horas_trabalhadas = ?, Trabalho_ID = ?, Aluno_RA = ?
     WHERE ID_Atividade = ?;`,
    [descricao, status, horasTrabalhadas, trabalhoId, alunoRA, id]
  );
};

export const atualizarStatusAtividade = (id, novoStatus) => {
  const db = getDatabase();
  db.execute(
    `UPDATE Atividade SET Status = ? WHERE ID_Atividade = ?;`,
    [novoStatus, id]
  );
};

export const deletarAtividade = (id) => {
  const db = getDatabase();
  db.execute(`DELETE FROM Atividade WHERE ID_Atividade = ?;`, [id]);
};