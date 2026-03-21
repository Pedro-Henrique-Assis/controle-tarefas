import { getDatabase } from './banco';

// CREATE
export const inserirTrabalho = (nome, situacao, dataEntrega) => {
  const db = getDatabase();
  db.execute(
    `INSERT INTO Trabalho (Nome, Situacao, Data_entrega) VALUES (?, ?, ?);`,
    [nome, situacao, dataEntrega]
  );
};

// READ - Buscar todos
export const buscarTrabalhos = () => {
  const db = getDatabase();
  const result = db.execute(`SELECT * FROM Trabalho;`);
  return result.rows?._array ?? [];
};

// READ - Buscar por ID
export const buscarTrabalhoPorID = (id) => {
  const db = getDatabase();
  const result = db.execute(
    `SELECT * FROM Trabalho WHERE ID = ?;`,
    [id]
  );
  return result.rows?._array[0] ?? null;
};

// UPDATE
export const atualizarTrabalho = (id, nome, situacao, dataEntrega) => {
  const db = getDatabase();
  db.execute(
    `UPDATE Trabalho SET Nome = ?, Situacao = ?, Data_entrega = ? WHERE ID = ?;`,
    [nome, situacao, dataEntrega, id]
  );
};

// DELETE
export const deletarTrabalho = (id) => {
  const db = getDatabase();
  db.execute(
    `DELETE FROM Trabalho WHERE ID = ?;`,
    [id]
  );
};