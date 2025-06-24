const db = require('../database/mysql');
const bcrypt = require('bcrypt');

const loginUsuario = async (req, res) => {
  const { login, senha } = req.body;

  try {
    console.log('📥 Requisição recebida com:', { login, senha });

    const [rows] = await db.query(
  `SELECT 
    u.IDUSUARIO,
    u.SENHAUSUA,
    u.ID_PROFISSIO,
    p.TIPOPROFI,
    p.ID_CONSEPROFI
  FROM USUARIO u
  JOIN PROFISSIONAL p ON u.ID_PROFISSIO = p.IDPROFISSIO
  WHERE u.LOGUSUARIO = ?`,
  [login]
);
    console.log('📦 Resultado da query:', rows);

    if (rows.length === 0) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const { IDUSUARIO, SENHAUSUA, ID_PROFISSIO, TIPOPROFI, ID_CONSEPROFI } = rows[0];

  
    if (ID_CONSEPROFI !== 61) {
      console.log('⚠️ Usuário não é da Odontologia (ID_CONSEPROFI =', ID_CONSEPROFI, ')');
      return res.status(403).json({ error: 'Acesso restrito aos profissionais de Odontologia' });
    }

    const senhaValida = await bcrypt.compare(senha, SENHAUSUA);
    console.log('🔒 Comparando senha...');
    console.log('Senha enviada:', senha);
    console.log('Hash armazenado:', SENHAUSUA);
    console.log('Senha confere?', senhaValida);

    if (!senhaValida) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const tipoNum = Number(TIPOPROFI);
    let tipo = null;

    if (tipoNum === 2) tipo = 'aluno';
    else if (tipoNum === 3) tipo = 'supervisor';
    else {
      console.log('⚠️ Tipo de usuário não permitido:', tipoNum);
      return res.status(403).json({ error: 'Tipo de usuário não permitido' });
    }

    console.log('✅ Login autorizado! Tipo:', tipo);
    return res.status(200).json({
      idProfissional: ID_PROFISSIO,
      idUsuario: IDUSUARIO,
      tipo
    });

  } catch (error) {
    console.error('🔥 Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

module.exports = { loginUsuario };