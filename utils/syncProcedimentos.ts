import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import api from '../services/api';


export const sincronizarProcedimentos = async () => {
  try {
    
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

     
      await AsyncStorage.removeItem('procedimentosOffline');
      console.log('Todos os procedimentos foram sincronizados com sucesso!');
    } else {
      console.log('Sem conexão com a internet. Procedimentos não podem ser sincronizados.');
    }
  } catch (error) {
    console.error('Erro ao tentar sincronizar procedimentos:', error);
  }
};
