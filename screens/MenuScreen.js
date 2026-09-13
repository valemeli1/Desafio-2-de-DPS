import { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RouletteModal from '../components/RouletteModal';
import { Ctx } from '../context/AppContext';

export default function MenuScreen() {
  const { products, addToCart, errorMsg, showToast } = useContext(Ctx);
  const [tab, setTab] = useState('Alimentos');
  const [qtys, setQtys] = useState({});
  const [showRoulette, setShowRoulette] = useState(false);

  // Filtra según la categoría del contexto ('Alimentos' o 'Bebidas')
  const list = products.filter(x => x.category === tab);

  const chgQty = (id, val) => {
    setQtys(prev => {
      const cur = prev[id] || 1;
      const nxt = cur + val;
      if (nxt < 1 || nxt > 20) {
        return prev; // Respeta los límites de 1 a 20
      }
      return { ...prev, [id]: nxt };
    });
  };

  const handleAddTocart = (item) => {
    const q = qtys[item.id] || 1;
    const success = addToCart(item, q.toString());
    
    // Si la función addToCart se ejecutó con éxito, mostramos el toast flotante
    if (success) {
      showToast(`¡Agregado al carrito: ${q}x ${item.name}!`);
    }
  };

  return (
    <View style={st.box}>
      <View style={st.tabs}>
        <TouchableOpacity style={[st.btnT, tab === 'Alimentos' && st.act]} onPress={() => setTab('Alimentos')}>
          <Text style={st.txtT}>Comida</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[st.btnT, tab === 'Bebidas' && st.act]} onPress={() => setTab('Bebidas')}>
          <Text style={st.txtT}>Tragos</Text>
        </TouchableOpacity>
      </View>

      {/* Validación: Mensaje de error visual directo en pantalla */}
      {errorMsg ? (
        <View style={st.errorBox}>
          <Text style={st.errorText}>⚠️ {errorMsg}</Text>
        </View>
      ) : null}

      <FlatList
        data={list}
        keyExtractor={x => x.id}
        renderItem={({ item }) => (
          <View style={st.card}>
            <View style={st.emojiContainer}>
              <Text style={st.emojiText}>{item.image}</Text>
            </View>
            <View style={st.info}>
              <Text style={st.name}>{item.name}</Text>
              <Text style={st.price}>${item.price.toFixed(2)}</Text>
              <View style={st.row}>
                <View style={st.cnt}>
                  <TouchableOpacity onPress={() => chgQty(item.id, -1)} style={st.bmin}>
                    <Text style={st.btxt}>-</Text>
                  </TouchableOpacity>
                  <Text style={st.qtxt}>{qtys[item.id] || 1}</Text>
                  <TouchableOpacity onPress={() => chgQty(item.id, 1)} style={st.bmin}>
                    <Text style={st.btxt}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={st.add} onPress={() => handleAddTocart(item)}>
                  <Text style={st.atxt}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Botón Flotante de la Ruleta Gacha */}
      <TouchableOpacity 
        style={st.floatingRouletteBtn} 
        onPress={() => setShowRoulette(true)}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 20 }}>🎰</Text>
        <Text style={st.rouletteBtnTxt}>Ruleta Gacha</Text>
      </TouchableOpacity>

      {/* Modal de la Ruleta */}
      <RouletteModal 
        visible={showRoulette} 
        onClose={() => setShowRoulette(false)} 
        showToast={showToast} 
      />
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#121212', paddingBottom: 10, position: 'relative' },
  tabs: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#1e1e1e', paddingVertical: 12 },
  btnT: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginHorizontal: 5, backgroundColor: '#2c2c2c' },
  act: { backgroundColor: '#e67e22' },
  txtT: { fontWeight: 'bold', color: '#fff' },
  errorBox: { backgroundColor: '#7f1d1d', marginHorizontal: 15, marginTop: 10, padding: 10, borderRadius: 8 },
  errorText: { color: '#fca5a5', fontWeight: 'bold', textAlign: 'center', fontSize: 13 },
  card: { flexDirection: 'row', backgroundColor: '#1e1e1e', marginHorizontal: 15, marginVertical: 8, padding: 10, borderRadius: 10, alignItems: 'center' },
  emojiContainer: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2a2a2a', borderRadius: 8 },
  emojiText: { fontSize: 30 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  price: { color: '#2ecc71', fontSize: 15, fontWeight: '600', marginVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cnt: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2c2c2c', borderRadius: 5, padding: 2 },
  bmin: { paddingHorizontal: 10, paddingVertical: 2 },
  btxt: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  qtxt: { marginHorizontal: 8, fontSize: 14, fontWeight: '600', color: '#fff' },
  add: { backgroundColor: '#d35400', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
  atxt: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  floatingRouletteBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#d35400',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 99
  },
  rouletteBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 6
  }
});