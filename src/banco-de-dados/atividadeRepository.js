import { getDatabase } from './banco';

// CREATE
export const inserirAtividade = (descricao, status, trabalhoId, alunoRA) => {
  const db = getDatabase();
  db.execute(
    `INSERT INTO Atividade (Descricao, Status, Trabalho_ID, Aluno_RA) VALUES (?, ?, ?, ?);`,
    [descricao, status, trabalhoId, alunoRA]
  );
};

// READ - Buscar todas
export const buscarAtividades = () => {
  const db = getDatabase();
  const result = db.execute(`SELECT * FROM Atividade;`);
  return result.rows?._array ?? [];
};

// READ - Buscar por ID
export const buscarAtividadePorID = (id) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Atividade WHERE ID_Atividade = ?;`,
    [id]
  );
  return result.rows?._array[0] ?? null;
};

// READ - Buscar atividades de um trabalho específico
export const buscarAtividadesPorTrabalho = (trabalhoId) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Atividade WHERE Trabalho_ID = ?;`,
    [trabalhoId]
  );
  return result.rows?._array ?? [];
};

// READ - Buscar atividades de um aluno específico
export const buscarAtividadesPorAluno = (alunoRA) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Atividade WHERE Aluno_RA = ?;`,
    [alunoRA]
  );
  return result.rows?._array ?? [];
};

// UPDATE
export const atualizarAtividade = (id, descricao, status, trabalhoId, alunoRA) => {
  const db = getDatabase();
  db.execute(
    `UPDATE Atividade 
     SET Descricao = ?, Status = ?, Trabalho_ID = ?, Aluno_RA = ?
     WHERE ID_Atividade = ?;`,
    [descricao, status, trabalhoId, alunoRA, id]
  );
};

// DELETE
export const deletarAtividade = (id) => {
  const db = getDatabase();
  db.execute(
    `DELETE FROM Atividade WHERE ID_Atividade = ?;`,
    [id]
  );
};