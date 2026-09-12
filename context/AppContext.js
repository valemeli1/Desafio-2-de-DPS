import { createContext, useState } from 'react';

export const Ctx = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estado para las notificaciones flotantes (Toast)
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // Se oculta automáticamente después de 3 segundos
  };
  
  const [users, setUsers] = useState([
    { username: 'admin', password: '1234' }
  ]);

  const products = [
    { id: '1', name: 'Alitas BBQ Picantes', price: 7.50, category: 'Alimentos', image: '🍗' },
    { id: '2', name: 'Papas con Cheddar', price: 5.00, category: 'Alimentos', image: '🍟' },
    { id: '3', name: 'Burger Doble Smash', price: 8.50, category: 'Alimentos', image: '🍔' },
    { id: '4', name: 'Nachos con Guacamole', price: 6.50, category: 'Alimentos', image: '🧀' },
    { id: '5', name: 'Dedos de Queso', price: 4.50, category: 'Alimentos', image: '🧀' },
    { id: '6', name: 'Salchipapas', price: 4.00, category: 'Alimentos', image: '🍟' },
    { id: '7', name: 'Minitaquitos de Birria', price: 6.00, category: 'Alimentos', image: '🌮' },
    { id: '8', name: 'Aros de Cebolla', price: 3.50, category: 'Alimentos', image: '🧅' },
    { id: '9', name: 'Hot Dog con Papas', price: 5.00, category: 'Alimentos', image: '🌭' },
    { id: '10', name: 'Boneless Búfalo', price: 7.00, category: 'Alimentos', image: '🍗' },
    { id: '11', name: 'Mojito Cubano', price: 5.50, category: 'Bebidas', image: '🍹' },
    { id: '12', name: 'Margarita Azul', price: 6.00, category: 'Bebidas', image: '🍸' },
    { id: '13', name: 'Cerveza IPA', price: 4.50, category: 'Bebidas', image: '🍺' },
    { id: '14', name: 'Piña Colada', price: 6.00, category: 'Bebidas', image: '🍍' },
    { id: '15', name: 'Tequila Sunrise', price: 5.00, category: 'Bebidas', image: '🌅' },
  ];

  // Registro con verificación estricta de datos correctos
  const registerUser = (usernameRaw, passwordRaw) => {
    setErrorMsg('');
    
    const username = usernameRaw ? usernameRaw.trim() : '';
    const password = passwordRaw ? passwordRaw.trim() : '';

    if (!username || !password) {
      setErrorMsg('El usuario y la contraseña no pueden estar vacíos.');
      return false;
    }

    if (username.length < 3) {
      setErrorMsg('El usuario debe tener al menos 3 caracteres.');
      return false;
    }

    if (password.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
      return false;
    }

    if (/\s/.test(username)) {
      setErrorMsg('El nombre de usuario no debe contener espacios en blanco.');
      return false;
    }

    const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      setErrorMsg('El nombre de usuario ya está registrado.');
      return false;
    }

    setUsers(prev => [...prev, { username, password }]);
    showToast('¡Cuenta creada con éxito!');
    return true;
  };

  // Login con verificación estricta de datos correctos
  const loginUser = (usernameRaw, passwordRaw) => {
    setErrorMsg('');

    const username = usernameRaw ? usernameRaw.trim() : '';
    const password = passwordRaw ? passwordRaw.trim() : '';

    if (!username || !password) {
      setErrorMsg('Por favor ingresa tu usuario y contraseña.');
      return false;
    }

    const found = users.find(u => u.username === username && u.password === password);
    if (!found) {
      setErrorMsg('Datos incorrectos. Verifica tu usuario y contraseña.');
      return false;
    }

    showToast(`¡Bienvenido de nuevo, ${username}!`);
    return true;
  };

  const addToCart = (product, quantityStr) => {
    setErrorMsg('');
    const qty = parseInt(quantityStr, 10);
    if (isNaN(qty) || qty <= 0) {
      setErrorMsg(`La cantidad para ${product.name} debe ser mayor a 0.`);
      return false;
    }
    if (qty > 20) {
      setErrorMsg(`El límite máximo es de 20 unidades por producto.`);
      return false;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newTotalQty = updated[existingIndex].quantity + qty;
        if (newTotalQty > 20) {
          setErrorMsg(`No puedes superar las 20 unidades en total para ${product.name}.`);
          return prevCart;
        }
        updated[existingIndex].quantity = newTotalQty;
        return updated;
      } else {
        return [...prevCart, { ...product, quantity: qty }];
      }
    });

    showToast(`¡Agregado al carrito: ${qty}x ${product.name}!`);
    return true;
  };

  const subtotalGeneral = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxIVA = subtotalGeneral * 0.13;
  const totalFinal = subtotalGeneral + taxIVA;

  const confirmOrder = () => {
    if (cart.length === 0) {
      setErrorMsg('No se puede confirmar una orden vacía.');
      return false;
    }

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      items: [...cart],
      subtotal: subtotalGeneral,
      iva: taxIVA,
      total: totalFinal,
    };

    setHistory(prev => [newOrder, ...prev]);
    setCart([]);
    setErrorMsg('');
    showToast('¡Orden confirmada con éxito!');
    return true;
  };

  return (
    <Ctx.Provider value={{ 
      products, cart, setCart, history, addToCart, confirmOrder, 
      errorMsg, setErrorMsg, subtotalGeneral, taxIVA, totalFinal, 
      registerUser, loginUser, toastMessage, showToast 
    }}>
      {children}
    </Ctx.Provider>
  );
}