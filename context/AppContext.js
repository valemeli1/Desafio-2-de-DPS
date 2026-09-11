import { createContext, useState } from 'react';

export const Ctx = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Catálogo inicial con precios fijos y separación por categoría
  const products = [
    // Alimentos
    { id: '1', name: 'Alitas BBQ', price: 6.50, category: 'Alimentos', image: '🍗' },
    { id: '2', name: 'Hamburguesa Clásica', price: 7.75, category: 'Alimentos', image: '🍔' },
    { id: '3', name: 'Papas Locas', price: 4.50, category: 'Alimentos', image: '🍟' },
    // Bebidas
    { id: '4', name: 'Cerveza Artesanal', price: 3.50, category: 'Bebidas', image: '🍺' },
    { id: '5', name: 'Limonada con Soda', price: 2.25, category: 'Bebidas', image: '🍹' },
    { id: '6', name: 'Te Frío', price: 2.00, category: 'Bebidas', image: '🧊' },
  ];

  // Agregar al carrito con validaciones obligatorias (1, 3, 4, 6, 7)
  const addToCart = (product, quantityStr) => {
    setErrorMsg('');
    const qty = parseInt(quantityStr, 10);

    // Validación 1 & 3: Entero mayor a 0 y no vacío/nulo
    if (isNaN(qty) || qty <= 0) {
      setErrorMsg(`La cantidad para ${product.name} debe ser un número entero mayor a 0.`);
      return false;
    }

    // Validación 6: Límite razonable (máximo 20 unidades)
    if (qty > 20) {
      setErrorMsg(`El límite máximo es de 20 unidades por producto (${product.name}).`);
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
    return true;
  };

  // Cálculos automáticos para la orden
  const subtotalGeneral = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxIVA = subtotalGeneral * 0.13; // IVA 13%
  const totalFinal = subtotalGeneral + taxIVA;

  // Confirmar orden (Validaciones 5, 8 y 9)
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

    // Guardar en historial ordenado del más reciente al más antiguo (9)
    setHistory(prev => [newOrder, ...prev]);
    setCart([]); // Limpiar orden actual
    setErrorMsg('');
    return true;
  };

  return (
    <Ctx.Provider value={{ products, cart, setCart, history, addToCart, confirmOrder, errorMsg, setErrorMsg, subtotalGeneral, taxIVA, totalFinal }}>
      {children}
    </Ctx.Provider>
  );
}