import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Type';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';

type AlunoNavProp = NativeStackNavigationProp<RootStackParamList, 'Aluno'>;

interface Procedimento {
  id: number;
  nomeAluno: string;
  nomePaciente: string;
  nomeProcedimento: string;
  codigoProcedimento: string;
  status: 'P' | 'A' | 'N';
  dataSolicitacao: string;
  motivoNegacao?: string;
}

export default function AlunoScreen() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [temPendencias, setTemPendencias] = useState(false);
  const navigation = useNavigation<AlunoNavProp>();
  const isFocused = useIsFocused();

  const sincronizarPendentes = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      try {
        const offlineData = await AsyncStorage.getItem('procedimentosOffline');
        if (offlineData) {
          const lista = JSON.parse(offlineData);
          const enviadosComSucesso: any[] = [];

          for (const procedimento of lista) {
            try {
              await api.post('/soliodonto', procedimento);
              enviadosComSucesso.push(procedimento);
            } catch (e) {
              console.error('Erro ao enviar procedimento offline:', e);
            }
          }

          if (enviadosComSucesso.length > 0) {
            const restantes = lista.filter((p: any) => !enviadosComSucesso.includes(p));
            if (restantes.length > 0) {
              await AsyncStorage.setItem('procedimentosOffline', JSON.stringify(restantes));
              setTemPendencias(true);
            } else {
              await AsyncStorage.removeItem('procedimentosOffline');
              setTemPendencias(false);
            }

            Alert.alert('Sucesso', 'Procedimentos offline sincronizados com sucesso.');
          }
        } else {
          setTemPendencias(false);
        }
      } catch (e) {
        console.error('Erro ao sincronizar procedimentos offline:', e);
      }
    } else {
      const offlineData = await AsyncStorage.getItem('procedimentosOffline');
      const lista = offlineData ? JSON.parse(offlineData) : [];
      setTemPendencias(lista.length > 0);
    }
  };

  const carregarProcedimentos = async () => {
  try {
    const idUsuario = await SecureStore.getItemAsync('idUsuario');
    if (!idUsuario) {
      Alert.alert('Erro', 'ID do usuário não encontrado.');
      return;
    }

    const response = await api.get<Procedimento[]>('/soliodonto/aluno', {
      params: { idUsuario },
    });

    console.log('Procedimentos do aluno:', response.data);
    setProcedimentos(response.data);
  } catch (error) {
    console.error('Erro ao carregar procedimentos do aluno:', error.message);
    Alert.alert('Erro', 'Não foi possível carregar os procedimentos.');
  }
};


  useEffect(() => {
    if (isFocused) {
      console.log('Tela Aluno está focada, carregando procedimentos...');
      carregarProcedimentos();
    }
  }, [isFocused]);

  const traduzirStatus = (status: 'P' | 'A' | 'N') => {
    switch (status) {
      case 'P': return 'Pendente';
      case 'A': return 'Aprovado';
      case 'N': return 'Negado';
      default: return status;
    }
  };

  const getStatusStyle = (status: 'P' | 'A' | 'N') => {
    switch (status) {
      case 'A': return styles.statusAprovado;
      case 'P': return styles.statusPendente;
      case 'N': return styles.statusNegado;
      default: return {};
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Solicitações de Procedimentos</Text>

      {temPendencias && (
        <View style={styles.pendenciaBox}>
          <Text style={styles.pendenciaTexto}>⚠ Há procedimentos pendentes aguardando envio</Text>
        </View>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={carregarProcedimentos}>
        <Text style={styles.refreshText}>Atualizar</Text>
      </TouchableOpacity>

      <FlatList
        data={procedimentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text><Text style={styles.label}>Paciente:</Text> {item.nomePaciente}</Text>
            <Text><Text style={styles.label}>Aluno:</Text> {item.nomeAluno}</Text>
            <Text><Text style={styles.label}>Procedimento:</Text> {item.nomeProcedimento}</Text>
            <Text><Text style={styles.label}>Código do Procedimento:</Text> {item.codigoProcedimento}</Text>
            <Text>
              <Text style={styles.label}>Status: </Text>
              <Text style={getStatusStyle(item.status)}>{traduzirStatus(item.status)}</Text>
            </Text>
            {item.status === 'N' && item.motivoNegacao && (
              <Text><Text style={styles.label}>Motivo da Negação:</Text> {item.motivoNegacao}</Text>
            )}
            <Text>
              <Text style={styles.label}>Data:</Text>{' '}
              {item.dataSolicitacao ? new Date(item.dataSolicitacao).toLocaleDateString() : 'Data indisponível'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  pendenciaBox: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ffeeba',
    borderWidth: 1,
    marginBottom: 10,
  },
  pendenciaTexto: {
    color: '#856404',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  label: { fontWeight: 'bold' },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  refreshText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statusAprovado: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusPendente: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
  statusNegado: {
    color: 'red',
    fontWeight: 'bold',
  },
});
