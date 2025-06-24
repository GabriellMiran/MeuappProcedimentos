import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Type';
import api from '../services/api';

type HistoricoNavProp = NativeStackNavigationProp<RootStackParamList, 'Historico'>;

interface Procedimento {
  id: number;
  nomeAluno: string;
  nomeProcedimento: string;
  codigoProcedimento: string;
  nomePaciente: string;
  status: string;
  motivoNegacao: string; 
}

export default function HistoricoScreen() {
  const navigation = useNavigation<HistoricoNavProp>();
  const [lista, setLista] = useState<Procedimento[]>([]);

  const carregarHistorico = () => {
    api.get('/soliodonto')
      .then(res => {
        setLista(res.data); 
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Erro', 'Não foi possível carregar os procedimentos');
      });
  };

  const formatarStatus = (status: string) => {
    switch (status) {
      case 'A': return { label: 'Aprovado', cor: 'green' };
      case 'N': return { label: 'Recusado', cor: 'red' };
      case 'P': return { label: 'Pendente', cor: 'gray' };
      default: return { label: status, cor: 'black' };
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Histórico de Procedimentos</Text>

      <FlatList
        data={lista}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
       const statusInfo = formatarStatus(item.status);
       return (
      <View style={styles.card}>
       <Text style={styles.title}>{item.nomeProcedimento}</Text>
       <Text>Aluno: {item.nomeAluno}</Text>
       <Text>Paciente: {item.nomePaciente}</Text>
       <Text>Código: {item.codigoProcedimento}</Text>
       <Text style={{ color: statusInfo.cor, fontWeight: 'bold' }}>
        Status: {statusInfo.label}
      </Text>

      {item.status === 'N' && item.motivoNegacao && (
        <Text style={{ color: 'red', marginTop: 4 }}>
          Motivo da Recusa: {item.motivoNegacao}
        </Text>
      )}
    </View>
  );
}}
      />

      <View style={styles.buttonContainer}>
        <Button title="Recarregar" onPress={carregarHistorico} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, marginBottom: 12, backgroundColor: '#f9f9f9'
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  buttonContainer: { marginTop: 10 }
});