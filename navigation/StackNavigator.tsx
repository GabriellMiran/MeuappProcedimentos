import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SupervisorScreen from '../screens/SupervisorScreen';
import AlunoScreen from '../screens/AlunoScreen';
import CadastroProcedimentoScreen from '../screens/cadastroProcedimentoScreen';
import { RootStackParamList } from '../Type';
import HistoricoScreen from '../screens/HistoricoScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Supervisor" component={SupervisorScreen} />
      <Stack.Screen name="Aluno" component={AlunoScreen} />
      <Stack.Screen name="CadastroProcedimento" component={CadastroProcedimentoScreen} />
      <Stack.Screen name="Historico" component={HistoricoScreen} /> 
    </Stack.Navigator>
  );
}