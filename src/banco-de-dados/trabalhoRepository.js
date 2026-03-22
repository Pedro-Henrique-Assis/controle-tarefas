import { getDbConnection } from './banco';

// CREATE
export const inserirTrabalho = async (nome, situacao, dataEntrega) => {
  const db = await getDbConnection();
  await db.runAsync(
    `INSERT INTO Trabalho (Nome, Situacao, Data_entrega) VALUES (?, ?, ?);`,
    [nome, situacao, dataEntrega]
  );
};

// READ - Buscar todos
export const buscarTrabalhos = async () => {
  const db = await getDbConnection();
  const result = await db.getAllAsync(`SELECT * FROM Trabalho;`);
  return result.rows ?? [];
};

// READ - Buscar por ID
export const buscarTrabalhoPorID = async (id) => {
  const db = await getDbConnection();
  const result = await db.getFirstAsync(
    `SELECT * FROM Trabalho WHERE ID = ?;`,
    [id]
  );
  return result ?? null;
};

// UPDATE
export const atualizarTrabalho = async (id, nome, situacao, dataEntrega) => {
  const db = await getDbConnection();
  await db.runAsync(
    `UPDATE Trabalho SET Nome = ?, Situacao = ?, Data_entrega = ? WHERE ID = ?;`,
    [nome, situacao, dataEntrega, id]
  );
};

// DELETE
export const deletarTrabalho = async (id) => {
  const db = await getDbConnection();
  await db.runAsync(
    `DELETE FROM Trabalho WHERE ID = ?;`,
    [id]
  );
};