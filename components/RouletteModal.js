import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const prizes = [
  { id: 1, title: '🍟 Papas Gratis con tu Orden', code: 'BUHI-FRIES', color: '#d35400' },
  { id: 2, title: '🥤 50% de Descuento en Bebidas', code: 'BUHI-DRINK', color: '#27ae60' },
  { id: 3, title: '🔥 Topping Extra de Cheddar', code: 'BUHI-CHEESE', color: '#2980b9' },
  { id: 4, title: '🦉 10% de Descuento Total', code: 'BUHI-10OFF', color: '#8e44ad' },
  { id: 5, title: '🍀 Sigue participando', code: null, color: '#7f8c8d' },
];

export default function RouletteModal({ visible, onClose, showToast }) {
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Verificamos si el usuario ya giró la ruleta en esta sesión o día
  useEffect(() => {
    checkIfPlayed();
  }, [visible]);

  const checkIfPlayed = async () => {
    try {
      const played = await AsyncStorage.getItem('@roulette_played_today');
      const today = new Date().toLocaleDateString();
      if (played === today) {
        setHasPlayed(true);
      } else {
        setHasPlayed(false);
        setWonPrize(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const spinRoulette = async () => {
    if (spinning || hasPlayed) return;
    setSpinning(true);
    setWonPrize(null);

    let counter = 0;
    const interval = setInterval(async () => {
      const randomIndex = Math.floor(Math.random() * prizes.length);
      setWonPrize(prizes[randomIndex]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalPrize = prizes[Math.floor(Math.random() * prizes.length)];
        setWonPrize(finalPrize);
        setSpinning(false);
        setHasPlayed(true);

        // Guardamos que ya tiró hoy
        const today = new Date().toLocaleDateString();
        await AsyncStorage.setItem('@roulette_played_today', today);

        if (finalPrize.code) {
          showToast(`¡Felicidades! Ganaste: ${finalPrize.title}`);
          savePrizeToStorage(finalPrize);
        } else {
          showToast('¡Suerte para la próxima!');
        }
      }
    }, 150);
  };

  const savePrizeToStorage = async (prize) => {
    try {
      const old = await AsyncStorage.getItem('@user_coupons');
      const arr = old ? JSON.parse(old) : [];
      arr.unshift({ ...prize, date: new Date().toLocaleDateString() });
      await AsyncStorage.setItem('@user_coupons', JSON.stringify(arr));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={st.modalOverlay}>
        <View style={st.modalContent}>
          <Text style={st.modalTitle}>🎰 Ruleta Gacha Buhitos</Text>
          <Text style={st.modalSub}>
            {hasPlayed ? '¡Ya usaste tu turno de hoy! Vuelve mañana por más.' : '¡Gira para desbloquear un premio secreto! (1 oportunidad)'}
          </Text>

          <View style={[st.rouletteBox, { borderColor: wonPrize ? wonPrize.color : '#f59e0b' }]}>
            <Text style={st.rouletteEmoji}>{spinning ? '🌀' : (hasPlayed && wonPrize ? '🏆' : '🎁')}</Text>
            <Text style={st.prizeText}>
              {wonPrize ? wonPrize.title : (hasPlayed ? 'Ya reclamaste tu premio de hoy' : 'Presiona girar para probar tu suerte')}
            </Text>
            {wonPrize?.code && (
              <Text style={st.codeText}>Código: {wonPrize.code}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[st.spinButton, (spinning || hasPlayed) && { opacity: 0.5 }]} 
            onPress={spinRoulette}
            disabled={spinning || hasPlayed}
          >
            <Text style={st.spinButtonText}>
              {spinning ? 'Girando ruleta...' : (hasPlayed ? 'Ya tiraste hoy' : '¡Girar Ruleta!')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={st.closeButton} onPress={onClose}>
            <Text style={st.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1a1a1a', padding: 22, borderRadius: 16, width: '100%', maxWidth: 420, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 20 },
  rouletteBox: { backgroundColor: '#121212', padding: 25, borderRadius: 12, alignItems: 'center', width: '100%', marginBottom: 20, borderWidth: 2 },
  rouletteEmoji: { fontSize: 40, marginBottom: 10 },
  prizeText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  codeText: { color: '#f59e0b', fontSize: 13, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  spinButton: { backgroundColor: '#d35400', padding: 14, borderRadius: 8, alignItems: 'center', width: '100%', marginBottom: 10 },
  spinButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  closeButton: { padding: 8 },
  closeButtonText: { color: '#888', fontSize: 13, fontWeight: 'bold' }
});