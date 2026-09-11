import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const [ords, setOrds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const res = await AsyncStorage.getItem('@orders');
          if (res) setOrds(JSON.parse(res));
        } catch (e) {
          console.log(e);
        }
      };
      load();
    }, [])
  );

  return (
    <View style={st.box}>
      <FlatList
        data={ords}
        keyExtractor={x => x.id}
        ListEmptyComponent={<Text style={st.emp}>No hay historial de compras</Text>}
        renderItem={({ item }) => (
          <View style={st.card}>
            <Text style={st.date}>{item.date}</Text>
            {item.items.map((p, i) => (
              <Text key={i} style={st.pitem}>• {p.quantity}x {p.name} (${(p.price * p.quantity).toFixed(2)})</Text>
            ))}
            <View style={st.dv}>
              <Text style={st.dst}>Sub: ${item.sub?.toFixed(2)} | IVA: ${item.iva?.toFixed(2)}</Text>
              <Text style={st.tot}>Total: ${item.total.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, padding: 15, backgroundColor: '#121212' },
  emp: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  card: { backgroundColor: '#1e1e1e', padding: 15, marginBottom: 15, borderRadius: 8 },
  date: { fontSize: 14, fontWeight: 'bold', color: '#e67e22', marginBottom: 8 },
  pitem: { color: '#ddd', fontSize: 14, marginLeft: 5, marginBottom: 3 },
  dv: { borderTopWidth: 1, borderColor: '#333', marginTop: 10, paddingTop: 8 },
  dst: { color: '#888', fontSize: 12, marginBottom: 3 },
  tot: { fontWeight: 'bold', color: '#2ecc71', fontSize: 16 }
});