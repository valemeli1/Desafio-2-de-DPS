import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createContext, useState } from 'react';
import CartScreen from './screens/CartScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';

export const Ctx = createContext();
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

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <Ctx.Provider value={{ cart, setCart }}>
      <NavigationContainer>
        <Stk.Navigator screenOptions={{ headerShown: false }}>
          <Stk.Screen name="Login" component={LoginScreen} />
          <Stk.Screen name="Main" component={Tabs} />
        </Stk.Navigator>
      </NavigationContainer>
    </Ctx.Provider>
  );
}