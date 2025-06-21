import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import SupervisorScreen from './screens/SupervisorScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import AlunoScreen from './screens/AlunoScreen';
import CadastroProcedimentoScreen from './screens/cadastroProcedimentoScreen';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

interface AppDrawerProps {
  userRole: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function AppDrawer({ userRole, setRole }: AppDrawerProps) {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#006400' }, // verde escuro
        headerTintColor: '#fff',
        drawerActiveBackgroundColor: '#228B22', // verde médio
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#006400',
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 250,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} setRole={setRole} />}
    >
      {userRole === 'supervisor' ? (
        <>
          <Drawer.Screen name="Supervisor" component={SupervisorScreen} />
          <Drawer.Screen name="Histórico" component={HistoricoScreen} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Meus Procedimentos" component={AlunoScreen} />
          <Drawer.Screen name="Cadastrar Procedimento" component={CadastroProcedimentoScreen} />
        </>
      )}
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  const { setRole } = props; // recebendo do componente principal

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('role');
    setRole(null);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Fasiclin</Text>
      </View>

      <View style={styles.drawerContent}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 20,
     // verde escuro
  },
  logo: {
    width: 150,
    height: 89,
    marginBottom: 10,
    borderRadius: 40,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});