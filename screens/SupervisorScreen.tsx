import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import axios from 'axios';
import api from '../services/api';

interface Procedimento {
  id: number;
  nomeAluno: string;
  nomePaciente: string;
  nomeProcedimento: string;
  codigoProcedimento: string;
  status: string;
  dataSolicitacao: string;
  MOTNEG: string | null;
}

export default function SupervisorScreen() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState<number | null>(null);

  const fetchProcedimentos = async () => {
    try {
      const response = await api.get(`/soliodonto`);
      const pendentes = response.data.filter((item: Procedimento) => item.status === 'P');
      setProcedimentos(pendentes);
    } catch (error) {
      console.error('Erro ao buscar procedimentos:', error);
    }
  };

  const aprovarProcedimento = async (id: number) => {
    try {
      await api.patch(`/soliodonto/${id}/status`, {
        status: 'A',
        MOTNEG: null
      });
      fetchProcedimentos();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
    }
  };

  const abrirModalRecusa = (id: number) => {
    setProcedimentoSelecionado(id);
    setMotivoRecusa('');
    setShowModal(true);
  };

  const enviarRecusa = async () => {
    if (procedimentoSelecionado !== null && motivoRecusa.trim()) {
      try {
        await api.patch(`/soliodonto/${procedimentoSelecionado}/status`, {
          status: 'N',
          MOTNEG: motivoRecusa
        });
        fetchProcedimentos();
        setShowModal(false);
      } catch (error) {
        console.error('Erro ao recusar:', error);
      }
    }
  };

  useEffect(() => {
    fetchProcedimentos();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Procedimentos Pendentes</Text>
        {procedimentos.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.texto}><Text style={styles.label}>Aluno:</Text> {item.nomeAluno}</Text>
            <Text style={styles.texto}><Text style={styles.label}>Paciente:</Text> {item.nomePaciente}</Text>
            <Text style={styles.texto}><Text style={styles.label}>Procedimento:</Text> {item.nomeProcedimento}</Text>
            <Text style={styles.texto}><Text style={styles.label}>Código:</Text> {item.codigoProcedimento}</Text>
            <Text style={styles.texto}><Text style={styles.label}>Data:</Text> {new Date(item.dataSolicitacao).toLocaleString()}</Text>

            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => aprovarProcedimento(item.id)} style={styles.botaoAprovar}>
                <Text style={styles.textoBotao}>Aprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => abrirModalRecusa(item.id)} style={styles.botaoRecusar}>
                <Text style={styles.textoBotao}>Recusar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Motivo da Recusa</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite o motivo"
              value={motivoRecusa}
              onChangeText={setMotivoRecusa}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setShowModal(false)}>
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBotaoConfirmar} onPress={enviarRecusa}>
                <Text style={styles.textoBotao}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, elevation: 2 },
  texto: { fontSize: 16, marginBottom: 4 },
  label: { fontWeight: 'bold' },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  botaoAprovar: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  botaoRecusar: { backgroundColor: '#F44336', padding: 10, borderRadius: 5 },
  textoBotao: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBotaoCancelar: {
    backgroundColor: '#bbb',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  modalBotaoConfirmar: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
});
