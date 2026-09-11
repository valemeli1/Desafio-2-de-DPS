import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ctx } from '../context/AppContext';

export default function CartScreen({ navigation }) {
  const { cart, setCart, currentUser, logoutUser } = useContext(Ctx);

  const sub = cart.reduce((s, x) => s + (Number(x.price) || 0) * (Number(x.quantity) || 1), 0);
  const iva = sub * 0.13;
  const tot = sub + iva;

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  const save = async () => {
    try {
      const obj = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        user: currentUser || 'Invitado',
        items: cart,
        sub: sub,
        iva: iva,
        total: tot
      };
      const old = await AsyncStorage.getItem('@orders');
      const arr = old ? JSON.parse(old) : [];
      arr.unshift(obj);
      
      await AsyncStorage.setItem('@orders', JSON.stringify(arr));
      setCart([]);
      
      if (Platform.OS === 'web') {
        window.alert('¡Orden guardada y confirmada con éxito!');
      } else {
        Alert.alert('Éxito', '¡Orden guardada y confirmada con éxito!');
      }
      
      navigation.navigate('Historial');
    } catch (e) {
      console.error(e);
      if (Platform.OS === 'web') {
        window.alert('No se pudo guardar la orden');
      } else {
        Alert.alert('Error', 'No se pudo guardar la orden');
      }
    }
  };

  const confirmOrder = () => {
    if (!cart || cart.length === 0) {
      if (Platform.OS === 'web') {
        window.alert('El carrito está vacío');
      } else {
        Alert.alert('Atención', 'El carrito está vacío');
      }
      return;
    }

    // Si corre en la Web, usamos window.confirm nativo del navegador
    if (Platform.OS === 'web') {
      const resp = window.confirm(`Sub: $${sub.toFixed(2)}\nIVA: $${iva.toFixed(2)}\nTotal: $${tot.toFixed(2)}\n\n¿Enviar orden?`);
      if (resp) {
        save();
      }
    } else {
      // Comportamiento nativo para dispositivos móviles (Android / iOS)
      Alert.alert(
        'Confirmar Orden',
        `Sub: $${sub.toFixed(2)}\nIVA: $${iva.toFixed(2)}\nTotal: $${tot.toFixed(2)}\n\n¿Enviar orden?`,
        [
          { text: 'No', style: 'cancel' },
          { text: 'Sí', onPress: () => save() }
        ]
      );
    }
  };

  return (
    <View style={st.box}>
      <View style={st.userBar}>
        <Text style={st.welcomeText}>👤 Hola, <Text style={st.username}>{currentUser || 'Invitado'}</Text></Text>
        <TouchableOpacity style={st.logoutButton} onPress={handleLogout}>
          <Text style={st.logoutText}>Cambiar cuenta</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={cart}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          ListEmptyComponent={<Text style={st.emp}>Sin productos en la orden</Text>}
          renderItem={({ item }) => (
            <View style={st.card}>
              <View>
                <Text style={st.name}>{item.quantity || 1}x {item.name}</Text>
                <Text style={st.pnt}>Unit: ${(Number(item.price) || 0).toFixed(2)}</Text>
              </View>
              <Text style={st.sub}>${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</Text>
            </View>
          )}
        />
      </View>

      <View style={st.ft}>
        <View style={st.rw}><Text style={st.ftxt}>Subtotal:</Text><Text style={st.ftxt}>${sub.toFixed(2)}</Text></View>
        <View style={st.rw}><Text style={st.ftxt}>IVA (13%):</Text><Text style={st.ftxt}>${iva.toFixed(2)}</Text></View>
        <View style={[st.rw, st.tots]}><Text style={st.ttxt}>Total:</Text><Text style={st.ttxt}>${tot.toFixed(2)}</Text></View>
        
        <TouchableOpacity style={st.confirmButton} onPress={confirmOrder} activeOpacity={0.7}>
          <Text style={st.confirmButtonText}>Confirmar Orden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, padding: 15, backgroundColor: '#121212' },
  userBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 10, borderRadius: 8, marginBottom: 12 },
  welcomeText: { color: '#fff', fontSize: 13 },
  username: { fontWeight: 'bold', color: '#f59e0b' },
  logoutButton: { backgroundColor: '#7f1d1d', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6 },
  logoutText: { color: '#fca5a5', fontSize: 11, fontWeight: 'bold' },
  emp: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 12, marginBottom: 10, borderRadius: 8 },
  name: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  pnt: { fontSize: 13, color: '#aaa' },
  sub: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  ft: { marginTop: 10, padding: 15, backgroundColor: '#1e1e1e', borderRadius: 10 },
  rw: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  ftxt: { color: '#ccc', fontSize: 14 },
  tots: { borderTopWidth: 1, borderColor: '#444', marginTop: 8, paddingTop: 8 },
  ttxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#27ae60', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});