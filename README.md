# 🦉 Buhitos App - Sistema POS y Gestión de Órdenes

Link video: https://drive.google.com/drive/folders/19teMNVZJsz6O1dUo4X5Qj9uWCk_0N6es?usp=sharing 

Sistema Integral Punto de Venta (POS) y gestión operativa para restaurantes y bares, diseñado con una arquitectura modular para cubrir el flujo completo entre clientes, personal de barra/cocina y administración.

---

## 🚀 Características Principales

* **Control de Acceso por Roles (RBAC)**: 
  * **Rol Cliente**: Permite explorar el catálogo dividido por categorías (Alimentos y Tragos), armar el carrito de compras, gestionar cantidades y participar en una ruleta de premios diarios.
  * **Rol Cajero / Barman (KDS)**: Pantalla de Cocina y Barra en tiempo real que recibe los pedidos para gestionar y actualizar su estatus operativo (*Pendiente*, *En preparación*, *Listo para entregar*, *Pagado*).
  * **Rol Administrador**: Panel de métricas ejecutivas que calcula ingresos totales, desglosa ventas por método de pago y genera un ranking con los productos más vendidos.
* **Gamificación (Ruleta Gacha)**: Minijuego diario integrado con límites de uso por sesión para fidelizar a los clientes y otorgar cupones de descuento almacenados localmente.
* **Persistencia Offline-First**: Utiliza `AsyncStorage` para almacenar carritos, cupones y el historial global de órdenes en formato JSON de manera local en el dispositivo.

---

## 🛠️ Tecnologías y Librerías Utilizadas

* **Framework**: React Native / Expo
* **Navegación**: React Navigation (Bottom Tabs y Native Stack)
* **Gestión de Estado**: React Context API (`AppContext`)
* **Almacenamiento Local**: `@react-native-async-storage/async-storage`
* **Estilos y Componentes**: StyleSheet nativo y diseño optimizado en modo oscuro (*Dark Mode*).

---

## 📂 Estructura del Proyecto

```text
buhitosrestaurant-app/
│
├── App.js                  # Componente raíz y enrutador principal con navegación condicional por roles
├── context/
│   └── AppContext.js       # Cerebro global (estado de órdenes, carrito, autenticación y roles)
├── components/
│   ├── RoleSelector.js     # Barra superior para alternar dinámicamente entre Cliente, Cajero y Admin
│   ├── RouletteModal.js    # Componente interactivo de la Ruleta Gacha con límite diario
│   └── Toast.js            # Sistema de notificaciones flotantes globales
└── screens/
    ├── MenuScreen.js       # Catálogo de alimentos, tragos y control de cantidades
    ├── CartScreen.js       # Gestión del carrito, tipos de orden y métodos de pago
    ├── HistoryScreen.js    # Historial de cupones y órdenes del usuario
    ├── KDSScreen.js        # Kitchen Display System para control de barra y cocina en tiempo real
    └── AdminScreen.js      # Panel de inteligencia de negocio y métricas (con métodos .reduce y .sort)
