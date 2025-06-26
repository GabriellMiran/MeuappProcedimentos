import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { Snackbar, Provider as PaperProvider } from 'react-native-paper';
import api from '../services/api';
import { useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { procedimentosDisponiveis as listaPadraoProcedimentos } from '../screens/data/procedimento';
import { salvarEspecProcLocalmente, obterEspecProcDoCache } from '../services/storage';

export default function CadastroProcedimentoScreen() {
  const [idPaciente, setIdPaciente] = useState('');
  const [nomePaciente, setNomePaciente] = useState('');
  const [idProfissional, setIdProfissional] = useState('');
  const [idProcedimento, setIdProcedimento] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [motivoNegacao, setMotivoNegacao] = useState('');
  const [temPendencias, setTemPendencias] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'info' | 'error' | 'success'>('info');
  const [procedimentosDisponiveis, setProcedimentosDisponiveis] = useState([]);
  

  const isFocused = useIsFocused();

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const idProf = await SecureStore.getItemAsync('idProfissional');
        const idUser = await SecureStore.getItemAsync('idUsuario');
        if (idProf) setIdProfissional(idProf);
        if (idUser) setIdUsuario(idUser);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };
    carregarDadosUsuario();
  }, []);

  useEffect(() => {
    const sincronizarOffline = async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        const offlineData = await AsyncStorage.getItem('procedimentosOffline');
        if (offlineData) {
          const lista = JSON.parse(offlineData);
          let sucesso = false;
          for (const procedimento of lista) {
            try {
              await api.post('/soliodonto', procedimento);
              sucesso = true;
            } catch (e) {
              console.error('Erro ao sincronizar procedimento offline:', e);
            }
          }
          if (sucesso) {
            await AsyncStorage.removeItem('procedimentosOffline');
            setTemPendencias(false);
            showSnackbar('Procedimentos offline sincronizados com sucesso!', 'success');
          }
        }
      } else {
        const offlineData = await AsyncStorage.getItem('procedimentosOffline');
        if (offlineData) {
          const lista = JSON.parse(offlineData);
          if (lista.length > 0) setTemPendencias(true);
        }
      }
    };

    sincronizarOffline();
  }, [isFocused]);

  useEffect(() => {
    const buscarNomePaciente = async () => {
      if (!idPaciente) {
        setNomePaciente('');
        return;
      }
      try {
        const response = await api.get(`/paciente/${idPaciente}`);
        setNomePaciente(response.data.nome);
      } catch (error) {
        console.error('Erro ao buscar nome do paciente:', error);
        setNomePaciente('Paciente não encontrado');
      }
    };
    buscarNomePaciente();
  }, [idPaciente]);

  useEffect(() => {
  const carregarProcedimentos = async () => {
    const state = await NetInfo.fetch();
    let dados: any[] = [];
    if (state.isConnected) {
      dados = await salvarEspecProcLocalmente(); 
    } else {
      dados = await obterEspecProcDoCache(); 
    }
    setProcedimentosDisponiveis(dados);
  };
  carregarProcedimentos();
}, []);

  const showSnackbar = (message: string, type: 'info' | 'error' | 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const limparCampos = () => {
    setIdPaciente('');
    setIdProcedimento('');
    setMotivoNegacao('');
    setNomePaciente('');
  };

  const handleSalvar = async () => {
    const novoProcedimento = {
      ID_PACIENTE: parseInt(idPaciente),
      ID_PROFISSIO: parseInt(idProfissional),
      ID_PROCED: parseInt(idProcedimento),
      ID_USUARIO: parseInt(idUsuario),
      MOTNEG: motivoNegacao || null
    };

    const state = await NetInfo.fetch();

    if (state.isConnected) {
      try {
        const response = await api.post('/soliodonto', novoProcedimento);
        if (response.status === 201) {
          showSnackbar('Procedimento cadastrado com sucesso!', 'success');
          limparCampos();
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.erros) {
          const mensagens = Object.values(error.response.data.erros).join('\n');
          showSnackbar(mensagens, 'error');
        }
        console.error('Erro ao enviar para servidor:', error.message);
        showSnackbar('Erro ao enviar para o servidor.', 'error');
      }
    } else {
      try {
        const offlineData = await AsyncStorage.getItem('procedimentosOffline');
        const listaOffline = offlineData ? JSON.parse(offlineData) : [];
        listaOffline.push(novoProcedimento);
        await AsyncStorage.setItem('procedimentosOffline', JSON.stringify(listaOffline));
        setTemPendencias(true);
        showSnackbar('Sem internet: procedimento salvo localmente.', 'info');
        limparCampos();
      } catch (error) {
        console.error('Erro ao salvar localmente:', error);
        showSnackbar('Erro ao salvar localmente.', 'error');
      }
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Cadastro de Procedimento</Text>

          {temPendencias && (
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ color: 'orange', fontWeight: 'bold' }}>⚠ Há procedimentos pendentes para sincronizar</Text>
            </View>
          )}

          <Text style={styles.label}>ID do Paciente</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={idPaciente}
            onChangeText={setIdPaciente}
          />

          <Text style={styles.label}>Nome do Paciente</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#eee' }]}
            value={nomePaciente}
            editable={false}
          />

          <Text style={styles.label}>ID do Profissional</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#eee' }]}
            keyboardType="numeric"
            value={idProfissional}
            editable={false}
          />

          <Text style={styles.label}>Procedimento</Text>
          <View style={styles.input}>
            <Picker
            selectedValue={idProcedimento}
            onValueChange={(itemValue) => setIdProcedimento(itemValue)}
            style={{ color: '#000' }}
            >
            <Picker.Item label="Selecione um procedimento" value="" />
            {procedimentosDisponiveis.map((proc) => (
            <Picker.Item
            key={proc.ID_PROCED}
            label={proc.DESCRPROC}
            value={proc.ID_PROCED.toString()}
             />
           ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Salvar Procedimento</Text>
          </TouchableOpacity>
        </ScrollView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{
            backgroundColor:
              snackbarType === 'success'
                ? '#4CAF50'
                : snackbarType === 'error'
                ? '#f44336'
                : '#2196F3',
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4fef4',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#02A450',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#02A450',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  }
});
