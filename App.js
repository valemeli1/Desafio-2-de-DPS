import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import RoleSelector from './components/RoleSelector';
import Toast from './components/Toast';
import { AppProvider, Ctx } from './context/AppContext';
import AdminScreen from './screens/AdminScreen';
import CartScreen from './screens/CartScreen';
import HistoryScreen from './screens/HistoryScreen';
import KDSScreen from './screens/KDSScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';

const Stk = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Catálogo" component={MenuScreen} />
      <Tab.Screen name="Mi Orden" component={CartScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

// Pantalla contenedora que gestiona qué rol se muestra en el sistema
function RoleBasedScreen() {
  const { userRole } = useContext(Ctx);

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Selector global para probar los roles en cualquier momento */}
      <RoleSelector />

      {/* Renderizado dinámico según el rol activo */}
      {userRole === 'Cliente' && <ClientTabs />}
      {userRole === 'Cajero' && <KDSScreen />}
      {userRole === 'Admin' && <AdminScreen />}
    </View>
  );
}

function MainNavigation() {
  const { toastMessage } = useContext(Ctx);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stk.Navigator screenOptions={{ headerShown: false }}>
          <Stk.Screen name="Login" component={LoginScreen} />
          <Stk.Screen name="Main" component={RoleBasedScreen} />
        </Stk.Navigator>
      </NavigationContainer>

      {/* Notificación flotante global sobre toda la app */}
      <Toast message={toastMessage} />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainNavigation />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    height: '100%',
    width: '100%',
  },
});