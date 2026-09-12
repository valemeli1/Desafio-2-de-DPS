import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ctx } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { loginUser, registerUser, errorMsg, setErrorMsg, showToast } = useContext(Ctx);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = () => {
    if (isRegistering) {
      // Intenta registrar un nuevo usuario con validaciones estrictas
      const success = registerUser(username, password);
      if (success) {
        showToast('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        setIsRegistering(false);
        setUsername('');
        setPassword('');
      }
    } else {
      // Verifica estrictamente que las credenciales sean correctas y existan
      const success = loginUser(username, password);
      if (success) {
        setUsername('');
        setPassword('');
        navigation.replace('Main');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🦉</Text>
      <Text style={styles.title}>Buhitos Bar</Text>
      <Text style={styles.subtitle}>{isRegistering ? 'Crear Nueva Cuenta' : 'Iniciar Sesión'}</Text>

      {/* Visualización de errores o validaciones incorrectas directamente en pantalla */}
      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isRegistering ? 'Registrarse' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={() => { 
          setIsRegistering(!isRegistering); 
          setErrorMsg(''); 
          setUsername('');
          setPassword('');
        }}
      >
        <Text style={styles.switchText}>
          {isRegistering ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  emoji: { fontSize: 50, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 20 },
  errorBox: { backgroundColor: '#7f1d1d', padding: 10, borderRadius: 8, marginBottom: 15 },
  errorText: { color: '#fca5a5', fontWeight: 'bold', textAlign: 'center', fontSize: 13 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#f59e0b', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#121212', fontWeight: 'bold', fontSize: 16 },
  switchButton: { marginTop: 15, alignItems: 'center' },
  switchText: { color: '#3b82f6', fontSize: 14 }
});