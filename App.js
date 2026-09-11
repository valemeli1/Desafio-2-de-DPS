import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { AppProvider } from './context/AppContext';
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

export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Stk.Navigator screenOptions={{ headerShown: false }}>
            <Stk.Screen name="Login" component={LoginScreen} />
            <Stk.Screen name="Main" component={Tabs} />
          </Stk.Navigator>
        </NavigationContainer>
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});