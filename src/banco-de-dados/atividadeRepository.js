import { getDatabase } from './banco';

export const inserirAtividade = async (descricao, status, horasTrabalhadas, trabalhoId, alunoRA) => {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO Atividade (Descricao, Status, Horas_trabalhadas, Trabalho_ID, Aluno_RA)
     VALUES (?, ?, ?, ?, ?);`,
    [descricao, status, horasTrabalhadas, trabalhoId, alunoRA]
  );
};

export const buscarAtividades = async () => {
  const db = getDatabase();
  const result = await db.getAllAsync(`SELECT * FROM Atividade;`);
  return result.rows ?? [];
};

export const buscarAtividadesPorTrabalho = async (trabalhoId) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM Atividade WHERE Trabalho_ID = ?;`,
    [trabalhoId]
  );
  return result.rows ?? [];
};

export const buscarAtividadesPorAluno = async (alunoRA) => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM Atividade WHERE Aluno_RA = ?;`,
    [alunoRA]
  );
  return result.rows ?? [];
};

export const buscarAtividadePorID = async (id) => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    `SELECT * FROM Atividade WHERE ID_Atividade = ?;`,
    [id]
  );
  return result ?? null;
};

export const atualizarAtividade = async (id, descricao, status, horasTrabalhadas, trabalhoId, alunoRA) => {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE Atividade
     SET Descricao = ?, Status = ?, Horas_trabalhadas = ?, Trabalho_ID = ?, Aluno_RA = ?
     WHERE ID_Atividade = ?;`,
    [descricao, status, horasTrabalhadas, trabalhoId, alunoRA, id]
  );
};

export const atualizarStatusAtividade = async (id, novoStatus) => {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE Atividade SET Status = ? WHERE ID_Atividade = ?;`,
    [novoStatus, id]
  );
};

export const deletarAtividade = async (id) => {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM Atividade WHERE ID_Atividade = ?;`, [id]);
};