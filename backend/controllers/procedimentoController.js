const db = require('../database/mysql');
const procedimentoModel = require('../models/procedimentoModel');



const verificarExistencia = async (tabela, campo, valor) => {
  const [rows] = await db.query(`SELECT 1 FROM ${tabela} WHERE ${campo} = ?`, [valor]);
  return rows.length > 0;
};


const cadastrarProcedimento = async (req, res) => {
  try {
    const {
      ID_PACIENTE,
      ID_PROFISSIO,
      ID_PROCED,
      ID_USUARIO,
      MOTNEG
    } = req.body;

    console.log('Recebido POST /procedimentos com dados:', req.body);

  
    const erros = {};

    if (!await verificarExistencia('PACIENTE', 'IDPACIENTE', ID_PACIENTE)) {
      erros.ID_PACIENTE = 'Paciente não encontrado';
    }

    if (!await verificarExistencia('PROFISSIONAL', 'IDPROFISSIO', ID_PROFISSIO)) {
      erros.ID_PROFISSIO = 'Profissional não encontrado';
    }

    if (!await verificarExistencia('PROCEDIMENTO', 'IDPROCED', ID_PROCED)) {
      erros.ID_PROCED = 'Procedimento não encontrado';
    }

    if (!await verificarExistencia('USUARIO', 'IDUSUARIO', ID_USUARIO)) {
      erros.ID_USUARIO = 'Usuário não encontrado';
    }

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({ erros });
    }

 
    const now = new Date();
    now.setHours(now.getHours() - 4);
    const DATASOL = now.toISOString().slice(0, 19).replace('T', ' ');

    const dados = {
      ID_PACIENTE,
      ID_PROFISSIO,
      ID_PROCED,
      ID_USUARIO,
      DATASOL,
      STATUSSOLI: 'P',
      MOTNEG: MOTNEG || null
    };

    console.log('Dados formatados para salvar:', dados);

    const result = await procedimentoModel.salvarProcedimento(dados);

    console.log('Procedimento salvo com ID:', result.insertId);
    res.status(201).json({ message: 'Procedimento cadastrado com sucesso', id: result.insertId });

  } catch (error) {
    console.error('Erro ao salvar procedimento:', error);
    res.status(500).json({ message: 'Erro ao salvar no banco de dados' });
  }
};


const listarProcedimentos = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        s.IDSOLIODONTO AS id,
        pf_aluno.NOMEPESSOA AS nomeAluno,
        pf_paciente.NOMEPESSOA AS nomePaciente,
        proc.DESCRPROC AS nomeProcedimento,
        proc.CODPROCED AS codigoProcedimento,
        s.STATUSSOLI AS status,
        s.DATASOL AS dataSolicitacao,
        s.MOTNEG AS motivoNegacao
      FROM SOLIODONTO s
      JOIN USUARIO u ON s.ID_USUARIO = u.IDUSUARIO
      JOIN PROFISSIONAL prof ON u.ID_PROFISSIO = prof.IDPROFISSIO
      JOIN PESSOAFIS pf_aluno ON prof.ID_PESSOAFIS = pf_aluno.IDPESSOAFIS
      JOIN PACIENTE p ON s.ID_PACIENTE = p.IDPACIENTE
      JOIN PESSOAFIS pf_paciente ON p.ID_PESSOAFIS = pf_paciente.IDPESSOAFIS
      JOIN PROCEDIMENTO proc ON s.ID_PROCED = proc.IDPROCED
      ORDER BY s.DATASOL DESC;
    `);

    res.json(result);
  } catch (error) {
    console.error('Erro ao listar procedimentos:', error);
    res.status(500).json({ message: 'Erro ao buscar procedimentos' });
  }
};


const atualizarStatusProcedimento = async (req, res) => {
  const { id } = req.params;
  const { status, MOTNEG } = req.body;

  try {
    await db.query(`
      UPDATE SOLIODONTO
      SET STATUSSOLI = ?, MOTNEG = ?
      WHERE IDSOLIODONTO = ?
    `, [status, MOTNEG || null, id]);

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro ao atualizar status' });
  }
};

const buscarNomePaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await db.query(`
      SELECT pf.NOMEPESSOA AS nome
      FROM PACIENTE p
      JOIN PESSOAFIS pf ON p.ID_PESSOAFIS = pf.IDPESSOAFIS
      WHERE p.IDPACIENTE = ?
    `, [id]);

    if (resultado.length === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    res.json({ nome: resultado[0].nome });
  } catch (error) {
    console.error('Erro ao buscar nome do paciente:', error);
    res.status(500).json({ message: 'Erro ao buscar nome do paciente' });
  }
};

const obterNomeProcedimento = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT DESCRPROC FROM PROCEDIMENTO WHERE IDPROCED = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Procedimento não encontrado' });
    }

    res.json({ nome: rows[0].DESCRPROC });
  } catch (error) {
    console.error('Erro ao buscar nome do procedimento:', error);
    res.status(500).json({ message: 'Erro ao buscar nome do procedimento' });
  }
};

const listarProcedimentosDoAluno = async (req, res) => {
  const idUsuario = req.query.idUsuario;

  if (!idUsuario) {
    return res.status(400).json({ message: 'ID do usuário não informado' });
  }

  try {
    const [result] = await db.query(`
      SELECT 
        s.IDSOLIODONTO AS id,
        pf_aluno.NOMEPESSOA AS nomeAluno,
        pf_paciente.NOMEPESSOA AS nomePaciente,
        proc.DESCRPROC AS nomeProcedimento,
        proc.CODPROCED AS codigoProcedimento,
        s.STATUSSOLI AS status,
        s.DATASOL AS dataSolicitacao,
        s.MOTNEG AS motivoNegacao
      FROM SOLIODONTO s
      JOIN USUARIO u ON s.ID_USUARIO = u.IDUSUARIO
      JOIN PROFISSIONAL prof ON u.ID_PROFISSIO = prof.IDPROFISSIO
      JOIN PESSOAFIS pf_aluno ON prof.ID_PESSOAFIS = pf_aluno.IDPESSOAFIS
      JOIN PACIENTE p ON s.ID_PACIENTE = p.IDPACIENTE
      JOIN PESSOAFIS pf_paciente ON p.ID_PESSOAFIS = pf_paciente.IDPESSOAFIS
      JOIN PROCEDIMENTO proc ON s.ID_PROCED = proc.IDPROCED
      WHERE s.ID_USUARIO = ?
      ORDER BY s.DATASOL DESC
    `, [idUsuario]);

    res.json(result);
  } catch (error) {
    console.error('Erro ao listar procedimentos do aluno:', error);
    res.status(500).json({ message: 'Erro ao buscar procedimentos do aluno' });
  }
};

const listarEspecProc = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ep.IDESPECPROCED,
        ep.ID_ESPEC,
        e.DESCESPEC,
        ep.ID_PROCED,
        p.DESCRPROC,
        p.VALORPROC
      FROM ESPECPROCED ep
      JOIN ESPECIALIDADE e ON ep.ID_ESPEC = e.IDESPEC
      JOIN PROCEDIMENTO p ON ep.ID_PROCED = p.IDPROCED
	    WHERE ep.ID_ESPEC = 4
      ORDER BY p.DESCRPROC ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar especproc:", error);
    res.status(500).json({ message: "Erro interno" });
  }
};

module.exports = {
  cadastrarProcedimento,
  listarProcedimentos,
  atualizarStatusProcedimento,
  buscarNomePaciente,
  obterNomeProcedimento,
  listarProcedimentosDoAluno,
  listarEspecProc
};