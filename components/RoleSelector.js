import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ctx } from '../context/AppContext';

export default function RoleSelector() {
  const { userRole, switchRole } = useContext(Ctx);

  return (
    <View style={st.container}>
      <Text style={st.label}>Rol Activo:</Text>
      <View style={st.row}>
        <TouchableOpacity 
          style={[st.btn, userRole === 'Cliente' && st.activeClient]} 
          onPress={() => switchRole('Cliente', 'Valeria Hernández')}
        >
          <Text style={st.txt}>Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[st.btn, userRole === 'Cajero' && st.activeCajero]} 
          onPress={() => switchRole('Cajero', 'Carlos (Barman)')}
        >
          <Text style={st.txt}>Cajero / KDS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[st.btn, userRole === 'Admin' && st.activeAdmin]} 
          onPress={() => switchRole('Admin', 'Gerencia Buhitos')}
        >
          <Text style={st.txt}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: { backgroundColor: '#1a1a1a', padding: 10, borderBottomWidth: 1, borderColor: '#333' },
  label: { color: '#888', fontSize: 10, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 6, marginHorizontal: 2, backgroundColor: '#2a2a2a' },
  activeClient: { backgroundColor: '#d35400' },
  activeCajero: { backgroundColor: '#2980b9' },
  activeAdmin: { backgroundColor: '#8e44ad' },
  txt: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
});