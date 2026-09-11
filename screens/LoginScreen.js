import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [usr, setUsr] = useState('');
  const [pwd, setPwd] = useState('');

  const loginFn = () => {
    if (!usr.trim() || !pwd.trim()) {
      Alert.alert('Error', 'Campos vacíos');
      return;
    }
    if (usr === 'admin' && pwd === '1234') {
      navigation.replace('Main');
    } else {
      Alert.alert('Error', 'Datos incorrectos');
    }
  };

  return (
    <View style={st.box}>
      <Text style={st.title}>Buhitos Bar</Text>
      <TextInput 
        style={st.inp} 
        placeholder="Usuario" 
        placeholderTextColor="#888" 
        value={usr} 
        onChangeText={setUsr} 
      />
      <TextInput 
        style={st.inp} 
        placeholder="Contraseña" 
        placeholderTextColor="#888" 
        value={pwd} 
        onChangeText={setPwd} 
        secureTextEntry 
      />
      <Button title="Entrar" onPress={loginFn} color="#d35400" />
    </View>
  );
}

const st = StyleSheet.create({
  box: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#fff' },
  inp: { borderWidth: 1, borderColor: '#444', backgroundColor: '#1e1e1e', color: '#fff', padding: 10, marginBottom: 15, borderRadius: 5 }
});