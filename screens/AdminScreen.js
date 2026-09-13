import { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ctx } from '../context/AppContext';

export default function AdminScreen() {
  const { orders, loadOrders, currentUser } = useContext(Ctx);

  useEffect(() => {
    loadOrders();
  }, []);

  // Cálculos de métricas
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  
  const paymentBreakdown = orders.reduce((acc, ord) => {
    const method = ord.paymentMethod || 'Mostrador';
    acc[method] = (acc[method] || 0) + (Number(ord.total) || 0);
    return acc;
  }, {});

  const productCounts = {};
  orders.forEach(ord => {
    ord.items?.forEach(item => {
      productCounts[item.name] = (productCounts[item.name] || 0) + Number(item.quantity);
    });
  });

  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <ScrollView style={st.box}>
      <View style={st.header}>
        <Text style={st.title}>📊 Panel de Administración</Text>
        <Text style={st.subtitle}>Admin: {currentUser}</Text>
      </View>

      <View style={st.rowMetrics}>
        <View style={st.metricCard}>
          <Text style={st.metricTitle}>Órdenes Totales</Text>
          <Text style={st.metricValue}>{totalOrders}</Text>
        </View>
        <View style={st.metricCard}>
          <Text style={st.metricTitle}>Ingresos Totales</Text>
          <Text style={[st.metricValue, { color: '#2ecc71' }]}>${totalRevenue.toFixed(2)}</Text>
        </View>
      </View>

      <View style={st.section}>
        <Text style={st.secTitle}>💳 Ingresos por Tipo de Pago</Text>
        {Object.keys(paymentBreakdown).length === 0 ? (
          <Text style={st.emptyText}>Sin datos registrados</Text>
        ) : (
          Object.entries(paymentBreakdown).map(([method, amount], idx) => (
            <View key={idx} style={st.rowItem}>
              <Text style={st.itemText}>{method}</Text>
              <Text style={st.itemVal}>${amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>

      <View style={st.section}>
        <Text style={st.secTitle}>🏆 Productos Más Vendidos</Text>
        {topProducts.length === 0 ? (
          <Text style={st.emptyText}>Sin ventas registradas</Text>
        ) : (
          topProducts.map(([name, qty], idx) => (
            <View key={idx} style={st.rowItem}>
              <Text style={st.itemText}>{idx + 1}. {name}</Text>
              <Text style={st.itemVal}>{qty} unidades</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#121212', padding: 15 },
  header: { marginBottom: 15, backgroundColor: '#1e1e1e', padding: 12, borderRadius: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#f59e0b', fontSize: 12, marginTop: 2 },
  rowMetrics: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  metricCard: { flex: 1, backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginHorizontal: 4, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  metricTitle: { color: '#888', fontSize: 11, fontWeight: 'bold', marginBottom: 5 },
  metricValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  section: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  secTitle: { color: '#f59e0b', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { color: '#777', fontSize: 13, fontStyle: 'italic' },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#2a2a2a' },
  itemText: { color: '#fff', fontSize: 13 },
  itemVal: { color: '#2ecc71', fontSize: 13, fontWeight: 'bold' }
});