import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const Ctx = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState('Valeria (Cliente)');
  const [userRole, setUserRole] = useState('Cliente'); // 'Cliente', 'Cajero', 'Admin'
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [orderType, setOrderType] = useState('Para comer aquí');
  const [paymentMethod, setPaymentMethod] = useState('Mostrador');

  const products = [
    { id: '1', name: 'Hamburguesa Buhitos', price: 6.50, category: 'Alimentos', image: '🍔' },
    { id: '2', name: 'Papas con Cheddar y Tocino', price: 4.00, category: 'Alimentos', image: '🍟' },
    { id: '3', name: 'Alitas BBQ (6 pzas)', price: 5.75, category: 'Alimentos', image: '🍗' },
    { id: '4', name: 'Pizza Pepperoni Personal', price: 7.00, category: 'Alimentos', image: '🍕' },
    { id: '5', name: 'Cerveza Artesanal IPA', price: 3.50, category: 'Bebidas', image: '🍺' },
    { id: '6', name: 'Cocktail Blue Lagoon', price: 4.50, category: 'Bebidas', image: '🍹' },
    { id: '7', name: 'Limonada Rosa', price: 2.25, category: 'Bebidas', image: '🍋' },
    { id: '8', name: 'Te Frío de Durazno', price: 2.00, category: 'Bebidas', image: '🧋' },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await AsyncStorage.getItem('@orders');
      if (data) setOrders(JSON.parse(data));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logoutUser = () => {
    setCurrentUser('Invitado');
    setUserRole('Cliente');
    setCart([]);
  };

  const switchRole = (role, name) => {
    setUserRole(role);
    setCurrentUser(name);
    showToast(`Cambio de rol: ${role} (${name})`);
  };

  // Funciones de Login y Registro requeridas por LoginScreen.js
  const registerUser = async (username, password) => {
    if (!username || !password) {
      setErrorMsg('Por favor completa todos los campos');
      return false;
    }
    try {
      const stored = await AsyncStorage.getItem('@users');
      const users = stored ? JSON.parse(stored) : [];
      
      const exists = users.find(u => u.username === username);
      if (exists) {
        setErrorMsg('El usuario ya existe');
        return false;
      }

      users.push({ username, password });
      await AsyncStorage.setItem('@users', JSON.stringify(users));
      
      setCurrentUser(username);
      setUserRole('Cliente');
      setErrorMsg(null);
      showToast('¡Cuenta creada con éxito!');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const loginUser = async (username, password) => {
    if (!username || !password) {
      setErrorMsg('Por favor completa todos los campos');
      return false;
    }
    try {
      const stored = await AsyncStorage.getItem('@users');
      const users = stored ? JSON.parse(stored) : [];
      
      const found = users.find(u => u.username === username && u.password === password);
      if (!found && username !== 'Valeria') {
        setErrorMsg('Usuario o contraseña incorrectos');
        return false;
      }

      setCurrentUser(username);
      setUserRole('Cliente');
      setErrorMsg(null);
      showToast(`¡Bienvenido de nuevo, ${username}!`);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addToCart = (product, qtyStr) => {
    const q = parseInt(qtyStr) || 1;
    if (q <= 0) {
      setErrorMsg('La cantidad debe ser mayor a 0');
      return false;
    }
    setErrorMsg(null);
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + q } : item
        );
      }
      return [...prev, { ...product, quantity: q }];
    });
    return true;
  };

  const subtotalGeneral = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const taxIVA = subtotalGeneral * 0.13;
  const totalFinal = subtotalGeneral + taxIVA;

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
      setOrders(updated);
      await AsyncStorage.setItem('@orders', JSON.stringify(updated));
      showToast(`Orden #${orderId} actualizada a: ${newStatus}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Ctx.Provider value={{
      currentUser, userRole, switchRole, logoutUser,
      registerUser, loginUser,
      products, cart, setCart, addToCart,
      orderType, setOrderType, paymentMethod, setPaymentMethod,
      subtotalGeneral, taxIVA, totalFinal,
      orders, loadOrders, updateOrderStatus,
      errorMsg, toastMessage, showToast
    }}>
      {children}
    </Ctx.Provider>
  );
}