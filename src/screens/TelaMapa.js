import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Map } from 'lucide-react-native';

const TelaMapa = () => {
  return (
    <View style={estilos.container}>
      <Map color="#F7F2ED" size={64} style={estilos.icone} />
      <Text style={estilos.titulo}>Mapa</Text>
      <Text style={estilos.subtitulo}>A visualização no mapa estará disponível em breve!</Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2825',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icone: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F2ED',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#AAA7A5',
    textAlign: 'center',
  },
});

export default TelaMapa;
