import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';



export default function LoginScreen({ setRole }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
  try {
    const response = await api.post('/login', {
      login,
      senha,
    });

    const { tipo, idProfissional, idUsuario } = response.data;

    
    await SecureStore.setItemAsync('role', tipo);
    await SecureStore.setItemAsync('idProfissional', String(idProfissional));
    await SecureStore.setItemAsync('idUsuario', String(idUsuario)); // novo

    setRole(tipo);
  } catch (error) {
    console.error('Erro de login:', error);
    Alert.alert('Erro', 'Credenciais inválidas ou erro na conexão.');
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.label}>Email</Text>
<TextInput
  value={login}
  onChangeText={setLogin}
  style={styles.input}
  keyboardType="email-address"
/>

<Text style={styles.label}>Senha</Text>
<TextInput
  value={senha}
  onChangeText={setSenha}
  style={styles.input}
  secureTextEntry
/>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 400, height: 300, resizeMode: 'contain', marginBottom: 10 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12, width: '100%', color: '#000'
  },
  button: {
    backgroundColor: '#02A450', padding: 12, borderRadius: 8, width: '100%',
  },
  buttonText: {
    color: '#fff', textAlign: 'center', fontWeight: 'bold',
  },
  
 label: {
  fontWeight: 'bold',
  alignSelf: 'flex-start',
  marginBottom: 4,
  fontSize: 16,
  color: '#333',
},
});