import { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ctx } from '../context/AppContext';

export default function KDSScreen() {
  const { orders, loadOrders, updateOrderStatus, currentUser } = useContext(Ctx);

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <View style={st.box}>
      <View style={st.header}>
        <Text style={st.title}>👨‍🍳 KDS - Cocina y Barra</Text>
        <Text style={st.subtitle}>Operador: {currentUser}</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={st.emp}>No hay órdenes activas</Text>}
        renderItem={({ item }) => (
          <View style={st.card}>
            <View style={st.cardHeader}>
              <Text style={st.orderId}>Orden #{item.id}</Text>
              <Text style={[st.statusBadge, { 
                color: item.status === 'Pagado' ? '#2ecc71' : 
                       item.status === 'En preparación' ? '#f59e0b' : '#3498db' 
              }]}>
                {item.status}
              </Text>
            </View>

            <Text style={st.client}>Cliente: {item.user} ({item.orderType})</Text>
            <Text style={st.date}>{item.date}</Text>

            <View style={st.itemsBox}>
              {item.items.map((prod, idx) => (
                <Text key={idx} style={st.prodTxt}>• {prod.quantity}x {prod.name}</Text>
              ))}
            </View>

            <View style={st.actionRow}>
              <TouchableOpacity 
                style={[st.btnAction, { backgroundColor: '#3498db' }]}
                onPress={() => updateOrderStatus(item.id, 'En preparación')}
              >
                <Text style={st.btnTxt}>Preparar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[st.btnAction, { backgroundColor: '#2ecc71' }]}
                onPress={() => updateOrderStatus(item.id, 'Listo para entregar')}
              >
                <Text style={st.btnTxt}>Listo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[st.btnAction, { backgroundColor: '#9b59b6' }]}
                onPress={() => updateOrderStatus(item.id, 'Pagado')}
              >
                <Text style={st.btnTxt}>Pagado</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#121212', padding: 15 },
  header: { marginBottom: 15, backgroundColor: '#1e1e1e', padding: 12, borderRadius: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#f59e0b', fontSize: 12, marginTop: 2 },
  emp: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  orderId: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statusBadge: { fontSize: 13, fontWeight: 'bold' },
  client: { color: '#ccc', fontSize: 13 },
  date: { color: '#666', fontSize: 11, marginBottom: 8 },
  itemsBox: { backgroundColor: '#121212', padding: 8, borderRadius: 6, marginVertical: 6 },
  prodTxt: { color: '#fff', fontSize: 13 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnAction: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center', marginHorizontal: 3 },
  btnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});