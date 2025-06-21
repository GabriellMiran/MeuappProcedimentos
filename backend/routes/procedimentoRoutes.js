const express = require('express');
const router = express.Router();
const procedimentoController = require('../controllers/procedimentoController');


router.post('/soliodonto', procedimentoController.cadastrarProcedimento);
router.get('/soliodonto', procedimentoController.listarProcedimentos);
router.put('/soliodonto/:id', procedimentoController.atualizarStatusProcedimento);
router.patch('/soliodonto/:id/status', procedimentoController.atualizarStatusProcedimento);
router.get('/paciente/:id', procedimentoController.buscarNomePaciente);
router.get('/procedimento/:id', procedimentoController.obterNomeProcedimento);
router.get('/soliodonto/aluno', procedimentoController.listarProcedimentosDoAluno);

module.exports = router;