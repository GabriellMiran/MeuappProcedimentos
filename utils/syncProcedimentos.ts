import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import api from '../services/api';

// Sincroniza os procedimentos salvos localmente com o backend
export const sincronizarProcedimentos = async () => {
  try {
    // Verifica se a conexão com a internet está ativa
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
      const procedimentosJSON = await AsyncStorage.getItem('procedimentosOffline');
      
      if (!procedimentosJSON) {
        console.log('Não há procedimentos offline para sincronizar.');
        return;
      }

      const procedimentos = JSON.parse(procedimentosJSON);
      
      for (const procedimento of procedimentos) {
        try {
          // Envia o procedimento para o backend
          const response = await api.post('/procedimentos', procedimento);
          
          if (response.status === 200) {
            console.log(`Procedimento ${procedimento.id} sincronizado com sucesso.`);
          } else {
            console.log(`Erro ao sincronizar procedimento ${procedimento.id}:`, response.data);
          }
        } catch (error) {
          console.error(`Erro ao enviar procedimento ${procedimento.id}:`, error);
        }
      }

      // Remove os procedimentos após sincronizar
      await AsyncStorage.removeItem('procedimentosOffline');
      console.log('Todos os procedimentos foram sincronizados com sucesso!');
    } else {
      console.log('Sem conexão com a internet. Procedimentos não podem ser sincronizados.');
    }
  } catch (error) {
    console.error('Erro ao tentar sincronizar procedimentos:', error);
  }
};
