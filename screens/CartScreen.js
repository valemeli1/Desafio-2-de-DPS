import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ctx } from '../context/AppContext';

export default function CartScreen({ navigation }) {
  const { 
    cart, setCart, currentUser, logoutUser, showToast, 
    orderType, setOrderType, paymentMethod, setPaymentMethod,
    subtotalGeneral, taxIVA, totalFinal 
  } = useContext(Ctx);

  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Estado para mostrar el modal del Código QR con el número de orden
  const [showQRModal, setShowQRModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleLogout = () => {
    logoutUser();
    navigation.replace('Login');
  };

  const saveOrderToStorage = async (extraData = {}) => {
    try {
      const orderIdNum = Math.floor(1000 + Math.random() * 9000).toString();
      const obj = {
        id: orderIdNum,
        date: new Date().toLocaleString(),
        user: currentUser || 'Invitado',
        items: cart,
        sub: subtotalGeneral,
        iva: taxIVA,
        total: totalFinal,
        orderType: orderType,
        paymentMethod: paymentMethod,
        ...extraData
      };

      const old = await AsyncStorage.getItem('@orders');
      const arr = old ? JSON.parse(old) : [];
      arr.unshift(obj);
      
      await AsyncStorage.setItem('@orders', JSON.stringify(arr));
      
      setCart([]);
      setCompletedOrder(obj);
      setShowQRModal(true);
      showToast('¡Orden generada con éxito!');
    } catch (e) {
      console.error(e);
      showToast('No se pudo procesar la orden');
    }
  };

  const handleAutoFillCardAPI = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCVC('123');
    setCardHolder(currentUser || 'Valeria Hernández');
    showToast('✨ Datos de tarjeta autocompletados vía API');
  };

  const handleProcessCardPayment = () => {
    if (!cardNumber || !cardExpiry || !cardCVC || !cardHolder) {
      showToast('Por favor completa todos los datos de la tarjeta');
      return;
    }
    
    setShowCardModal(false);
    const last4 = cardNumber.slice(-4);
    saveOrderToStorage({ cardLast4: last4, status: 'Pagado' });
  };

  const confirmOrder = () => {
    if (!cart || cart.length === 0) {
      showToast('El carrito está vacío');
      return;
    }

    if (paymentMethod === 'Tarjeta') {
      setShowCardModal(true);
    } else {
      saveOrderToStorage({ status: 'Pendiente de pago en caja' });
    }
  };

  const handleFinishQR = () => {
    setShowQRModal(false);
    navigation.navigate('Historial');
  };

  return (
    <View style={st.box}>
      <View style={st.userBar}>
        <Text style={st.welcomeText}>👤 Hola, <Text style={st.username}>{currentUser || 'Invitado'}</Text></Text>
        <TouchableOpacity style={st.logoutButton} onPress={handleLogout}>
          <Text style={st.logoutText}>Cambiar cuenta</Text>
        </TouchableOpacity>
      </View>

      <Text style={st.sectionLabel}>Tipo de Servicio:</Text>
      <View style={st.selectorRow}>
        <TouchableOpacity 
          style={[st.selectBtn, orderType === 'Para comer aquí' && st.selectActive]} 
          onPress={() => setOrderType('Para comer aquí')}
        >
          <Text style={st.selectTxt}>🍽️ Comer Aquí</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[st.selectBtn, orderType === 'Para llevar' && st.selectActive]} 
          onPress={() => setOrderType('Para llevar')}
        >
          <Text style={st.selectTxt}>🛍️ Para Llevar</Text>
        </TouchableOpacity>
      </View>

      <Text style={st.sectionLabel}>Método de Pago:</Text>
      <View style={st.selectorRow}>
        <TouchableOpacity 
          style={[st.selectBtn, paymentMethod === 'Mostrador' && st.selectActive]} 
          onPress={() => setPaymentMethod('Mostrador')}
        >
          <Text style={st.selectTxt}>💵 En Mostrador</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[st.selectBtn, paymentMethod === 'Tarjeta' && st.selectActive]} 
          onPress={() => setPaymentMethod('Tarjeta')}
        >
          <Text style={st.selectTxt}>💳 Tarjeta</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: 10 }}>
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
        <View style={st.rw}><Text style={st.ftxt}>Subtotal:</Text><Text style={st.ftxt}>${subtotalGeneral.toFixed(2)}</Text></View>
        <View style={st.rw}><Text style={st.ftxt}>IVA (13%):</Text><Text style={st.ftxt}>${taxIVA.toFixed(2)}</Text></View>
        <View style={[st.rw, st.tots]}><Text style={st.ttxt}>Total:</Text><Text style={st.ttxt}>${totalFinal.toFixed(2)}</Text></View>
        
        <TouchableOpacity style={st.confirmButton} onPress={confirmOrder} activeOpacity={0.7}>
          <Text style={st.confirmButtonText}>
            {paymentMethod === 'Tarjeta' ? 'Proceder al Pago con Tarjeta' : 'Generar Orden para Caja'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Simulación de Pasarela de Tarjeta */}
      <Modal visible={showCardModal} transparent animationType="slide">
        <View style={st.modalOverlay}>
          <View style={st.modalContent}>
            <Text style={st.modalTitle}>💳 Pasarela de Pago Segura</Text>
            <Text style={st.modalSub}>Total a pagar: ${totalFinal.toFixed(2)}</Text>

            <TouchableOpacity style={st.apiButton} onPress={handleAutoFillCardAPI}>
              <Text style={st.apiButtonText}>⚡ Autocompletar con API de Tarjeta</Text>
            </TouchableOpacity>

            <Text style={st.label}>Titular de la Tarjeta</Text>
            <TextInput 
              style={st.input} 
              placeholder="Nombre en la tarjeta" 
              placeholderTextColor="#666"
              value={cardHolder}
              onChangeText={setCardHolder}
            />

            <Text style={st.label}>Número de Tarjeta</Text>
            <TextInput 
              style={st.input} 
              placeholder="4242 4242 4242 4242" 
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            <View style={st.rowInputs}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={st.label}>Expiración</Text>
                <TextInput 
                  style={st.input} 
                  placeholder="MM/AA" 
                  placeholderTextColor="#666"
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.label}>CVC</Text>
                <TextInput 
                  style={st.input} 
                  placeholder="123" 
                  placeholderTextColor="#666"
                  secureTextEntry
                  keyboardType="numeric"
                  value={cardCVC}
                  onChangeText={setCardCVC}
                />
              </View>
            </View>

            <TouchableOpacity style={st.payButton} onPress={handleProcessCardPayment}>
              <Text style={st.payButtonText}>Completar Pago y Ver QR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={st.cancelButton} onPress={() => setShowCardModal(false)}>
              <Text style={st.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal del Código QR y Número de Orden */}
      <Modal visible={showQRModal} transparent animationType="fade">
        <View style={st.modalOverlay}>
          <View style={[st.modalContent, { alignItems: 'center' }]}>
            <Text style={st.modalTitle}>🎉 ¡Pedido Creado!</Text>
            <Text style={st.modalSub}>Presenta este QR o número en el mostrador</Text>

            <View style={st.qrBox}>
              <Text style={st.qrSymbol}>📱 ▣ ▤ ▦ ▣</Text>
              <Text style={st.orderNumberLabel}>NÚMERO DE ORDEN</Text>
              <Text style={st.orderNumberText}>#{completedOrder?.id}</Text>
            </View>

            <View style={st.orderSummaryBox}>
              <Text style={st.summaryTxt}>Modalidad: <Text style={{fontWeight: 'bold', color: '#fff'}}>{completedOrder?.orderType}</Text></Text>
              <Text style={st.summaryTxt}>Método: <Text style={{fontWeight: 'bold', color: '#fff'}}>{completedOrder?.paymentMethod}</Text></Text>
              <Text style={st.summaryTxt}>Estado: <Text style={{fontWeight: 'bold', color: completedOrder?.paymentMethod === 'Tarjeta' ? '#2ecc71' : '#f59e0b'}}>{completedOrder?.status}</Text></Text>
            </View>

            <TouchableOpacity style={st.payButton} onPress={handleFinishQR}>
              <Text style={st.payButtonText}>Ir al Historial de Pedidos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, padding: 15, backgroundColor: '#121212' },
  userBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 10, borderRadius: 8, marginBottom: 10 },
  welcomeText: { color: '#fff', fontSize: 13 },
  username: { fontWeight: 'bold', color: '#f59e0b' },
  logoutButton: { backgroundColor: '#7f1d1d', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6 },
  logoutText: { color: '#fca5a5', fontSize: 11, fontWeight: 'bold' },
  sectionLabel: { color: '#aaa', fontSize: 12, fontWeight: 'bold', marginBottom: 5, marginTop: 5 },
  selectorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  selectBtn: { flex: 1, backgroundColor: '#1e1e1e', padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 3, borderWidth: 1, borderColor: '#333' },
  selectActive: { backgroundColor: '#d35400', borderColor: '#e67e22' },
  selectTxt: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emp: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 12, marginBottom: 10, borderRadius: 8 },
  name: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  pnt: { fontSize: 13, color: '#aaa' },
  sub: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  ft: { marginTop: 5, padding: 15, backgroundColor: '#1e1e1e', borderRadius: 10 },
  rw: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  ftxt: { color: '#ccc', fontSize: 14 },
  tots: { borderTopWidth: 1, borderColor: '#444', marginTop: 8, paddingTop: 8 },
  ttxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#27ae60', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1a1a1a', padding: 22, borderRadius: 16, width: '100%', maxWidth: 420, borderWidth: 1, borderColor: '#333' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 15 },
  apiButton: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  apiButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  label: { color: '#ccc', fontSize: 12, marginBottom: 4, fontWeight: 'bold' },
  input: { backgroundColor: '#121212', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#333', fontSize: 14 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  payButton: { backgroundColor: '#27ae60', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, width: '100%' },
  payButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelButton: { marginTop: 10, alignItems: 'center', padding: 8 },
  cancelButtonText: { color: '#f87171', fontSize: 13, fontWeight: 'bold' },

  qrBox: { backgroundColor: '#2a2a2a', padding: 20, borderRadius: 12, alignItems: 'center', width: '100%', marginVertical: 10, borderWidth: 1, borderColor: '#444' },
  qrSymbol: { fontSize: 45, marginBottom: 5, color: '#fff' },
  orderNumberLabel: { color: '#aaa', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  orderNumberText: { color: '#f59e0b', fontSize: 26, fontWeight: 'bold', marginTop: 2 },
  orderSummaryBox: { width: '100%', backgroundColor: '#121212', padding: 10, borderRadius: 8, marginVertical: 10 },
  summaryTxt: { color: '#888', fontSize: 13, marginBottom: 3 }
});