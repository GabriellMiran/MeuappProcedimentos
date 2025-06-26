
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "./api";

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


const ESPECPROC_KEY = "especproc_cache";

export const salvarEspecProcLocalmente = async () => {
  try {
    const response = await api.get("/especproc");
    const data = response.data;
    await AsyncStorage.setItem(ESPECPROC_KEY, JSON.stringify(data));
    console.log("EspecProc salvo no cache.");
    return data;
  } catch (error) {
    console.error("Erro ao salvar especproc no cache:", error);
    return [];
  }
};

export const obterEspecProcDoCache = async () => {
  try {
    const data = await AsyncStorage.getItem(ESPECPROC_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao obter especproc do cache:", error);
    return [];
  }
};


