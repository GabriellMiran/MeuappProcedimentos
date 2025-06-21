const db = require('../database/mysql');

const salvarProcedimento = async (dados) => {
  const sql = `
    INSERT INTO SOLIODONTO (
      ID_PACIENTE, ID_PROFISSIO, ID_PROCED, ID_USUARIO,
      DATASOL, STATUSSOLI, MOTNEG
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    dados.ID_PACIENTE,
    dados.ID_PROFISSIO,
    dados.ID_PROCED,
    dados.ID_USUARIO,
    dados.DATASOL,
    dados.STATUSSOLI,
    dados.MOTNEG
  ];

  const [result] = await db.query(sql, values);
  return result;
};

const atualizarStatusProcedimento = async (id, status, motivo) => {
  const sql = `
    UPDATE SOLIODONTO 
    SET STATUSSOLI = ?, MOTNEG = ? 
    WHERE IDSOLIODONTO = ?
  `;

  const [result] = await db.query(sql, [status, motivo, id]);
  return result;
};

module.exports = {
  salvarProcedimento,
  atualizarStatusProcedimento
};