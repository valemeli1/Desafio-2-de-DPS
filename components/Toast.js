import { StyleSheet, Text, View } from 'react-native';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <View style={st.toastContainer}>
      <Text style={st.toastText}>🔔 {message}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    zIndex: 9999,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Soporte web y app
    elevation: 5,
  },
  toastText: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});