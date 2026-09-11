import { useContext, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ctx } from '../App';

const DATA = [
  { id: '1', name: 'Alitas BBQ Picantes', price: 7.50, type: 'comida', img: '' },
  { id: '2', name: 'Papas con Cheddar', price: 5.00, type: 'comida', img: '' },
  { id: '3', name: 'Burger Doble Smash', price: 8.50, type: 'comida', img: '' },
  { id: '4', name: 'Nachos con Guacamole', price: 6.50, type: 'comida', img: '' },
  { id: '5', name: 'Dedos de Queso', price: 4.50, type: 'comida', img: '' },
  { id: '6', name: 'Salchipapas', price: 4.00, type: 'comida', img: '' },
  { id: '7', name: 'Minitaquitos de Birria', price: 6.00, type: 'comida', img: '' },
  { id: '8', name: 'Aros de Cebolla', price: 3.50, type: 'comida', img: '' },
  { id: '9', name: 'Hot Dog con Papas', price: 5.00, type: 'comida', img: '' },
  { id: '10', name: 'Boneless Búfalo', price: 7.00, type: 'comida', img: '' },
  { id: '11', name: 'Mojito Cubano', price: 5.50, type: 'bebida', img: '' },
  { id: '12', name: 'Margarita Azul', price: 6.00, type: 'bebida', img: '' },
  { id: '13', name: 'Cerveza IPA', price: 4.50, type: 'bebida', img: '' },
  { id: '14', name: 'Piña Colada', price: 6.00, type: 'bebida', img: '' },
  { id: '15', name: 'Tequila Sunrise', price: 5.00, type: 'bebida', img: '' },
];

export default function MenuScreen() {
  const { cart, setCart } = useContext(Ctx);
  const [tab, setTab] = useState('comida');
  const [qtys, setQtys] = useState({});

  const list = DATA.filter(x => x.type === tab);

  const chgQty = (id, val) => {
    setQtys(prev => {
      const cur = prev[id] || 1;
      const nxt = cur + val;
      if (nxt < 1) {
        Alert.alert('Aviso', 'Mínimo 1');
        return prev;
      }
      if (nxt > 20) {
        Alert.alert('Aviso', 'Máximo 20');
        return prev;
      }
      return { ...prev, [id]: nxt };
    });
  };

  const addTocart = (item) => {
    const q = qtys[item.id] || 1;
    setCart(prev => {
      const ex = prev.find(p => p.id === item.id);
      if (ex) {
        if (ex.quantity + q > 20) {
          Alert.alert('Error', 'Límite excedido');
          return prev;
        }
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + q } : p);
      }
      return [...prev, { ...item, quantity: q }];
    });
    Alert.alert('Ok', `Agregado: ${q}x ${item.name}`);
  };

  return (
    <View style={st.box}>
      <View style={st.tabs}>
        <TouchableOpacity style={[st.btnT, tab === 'comida' && st.act]} onPress={() => setTab('comida')}>
          <Text style={st.txtT}>Comida</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[st.btnT, tab === 'bebida' && st.act]} onPress={() => setTab('bebida')}>
          <Text style={st.txtT}>Tragos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={x => x.id}
        renderItem={({ item }) => (
          <View style={st.card}>
            <Image source={{ uri: item.img }} style={st.img} />
            <View style={st.info}>
              <Text style={st.name}>{item.name}</Text>
              <Text style={st.price}>${item.price.toFixed(2)}</Text>
              <View style={st.row}>
                <View style={st.cnt}>
                  <TouchableOpacity onPress={() => chgQty(item.id, -1)} style={st.bmin}><Text style={st.btxt}>-</Text></TouchableOpacity>
                  <Text style={st.qtxt}>{qtys[item.id] || 1}</Text>
                  <TouchableOpacity onPress={() => chgQty(item.id, 1)} style={st.bmin}><Text style={st.btxt}>+</Text></TouchableOpacity>
                </View>
                <TouchableOpacity style={st.add} onPress={() => addTocart(item)}>
                  <Text style={st.atxt}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#121212' },
  tabs: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#1e1e1e', paddingVertical: 12 },
  btnT: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginHorizontal: 5, backgroundColor: '#2c2c2c' },
  act: { backgroundColor: '#e67e22' },
  txtT: { fontWeight: 'bold', color: '#fff' },
  card: { flexDirection: 'row', backgroundColor: '#1e1e1e', marginHorizontal: 15, marginVertical: 8, padding: 10, borderRadius: 10 },
  img: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  price: { color: '#2ecc71', fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cnt: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2c2c2c', borderRadius: 5, padding: 2 },
  bmin: { paddingHorizontal: 10, paddingVertical: 2 },
  btxt: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  qtxt: { marginHorizontal: 8, fontSize: 14, fontWeight: '600', color: '#fff' },
  add: { backgroundColor: '#d35400', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
  atxt: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});