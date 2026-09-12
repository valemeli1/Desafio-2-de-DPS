import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import Toast from './components/Toast';
import { AppProvider, Ctx } from './context/AppContext';
import CartScreen from './screens/CartScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';

const Stk = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Catálogo" component={MenuScreen} />
      <Tab.Screen name="Mi Orden" component={CartScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

function MainNavigation() {
  const { toastMessage } = useContext(Ctx);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stk.Navigator screenOptions={{ headerShown: false }}>
          <Stk.Screen name="Login" component={LoginScreen} />
          <Stk.Screen name="Main" component={Tabs} />
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