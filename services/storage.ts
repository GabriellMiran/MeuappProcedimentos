
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveProcedimentoOffline = async (procedimento: object) => {
  const stored = await AsyncStorage.getItem('procedimentosOffline');
  const lista = stored ? JSON.parse(stored) : [];
  lista.push(procedimento);
  await AsyncStorage.setItem('procedimentosOffline', JSON.stringify(lista));
};

export const getProcedimentosOffline = async () => {
  const stored = await AsyncStorage.getItem('procedimentosOffline');
  return stored ? JSON.parse(stored) : [];
};

export const clearProcedimentosOffline = async () => {
  await AsyncStorage.removeItem('procedimentosOffline');
};
