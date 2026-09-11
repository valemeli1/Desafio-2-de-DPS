import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { Ctx } from '../App';

export default function CartScreen({ navigation }) {
  const { cart, setCart } = useContext(Ctx);

  const sub = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const iva = sub * 0.13;
  const tot = sub + iva;

  const save = async () => {
    try {
      const obj = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
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
      Alert.alert('Éxito', 'Orden guardada');
      navigation.navigate('Historial');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar');
    }
  };

  const confirmOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Carrito vacío');
      return;
    }
    Alert.alert(
      'Confirmar',
      `Sub: $${sub.toFixed(2)}\nIVA: $${iva.toFixed(2)}\nTotal: $${tot.toFixed(2)}\n\n¿Enviar orden?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', onPress: save }
      ]
    );
  };

  return (
    <View style={st.box}>
      <FlatList
        data={cart}
        keyExtractor={x => x.id}
        ListEmptyComponent={<Text style={st.emp}>Sin productos en la orden</Text>}
        renderItem={({ item }) => (
          <View style={st.card}>
            <View>
              <Text style={st.name}>{item.quantity}x {item.name}</Text>
              <Text style={st.pnt}>Unit: ${item.price.toFixed(2)}</Text>
            </View>
            <Text style={st.sub}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        )}
      />
      <View style={st.ft}>
        <View style={st.rw}><Text style={st.ftxt}>Subtotal:</Text><Text style={st.ftxt}>${sub.toFixed(2)}</Text></View>
        <View style={st.rw}><Text style={st.ftxt}>IVA (13%):</Text><Text style={st.ftxt}>${iva.toFixed(2)}</Text></View>
        <View style={[st.rw, st.tots]}><Text style={st.ttxt}>Total:</Text><Text style={st.ttxt}>${tot.toFixed(2)}</Text></View>
        <Button title="Confirmar Orden" onPress={confirmOrder} color="#27ae60" />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, padding: 15, backgroundColor: '#121212' },
  emp: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 12, marginBottom: 10, borderRadius: 8 },
  name: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  pnt: { fontSize: 13, color: '#aaa' },
  sub: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  ft: { marginTop: 10, padding: 15, backgroundColor: '#1e1e1e', borderRadius: 10 },
  rw: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  ftxt: { color: '#ccc', fontSize: 14 },
  tots: { borderTopWidth: 1, borderColor: '#444', marginTop: 8, paddingTop: 8 },
  ttxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});