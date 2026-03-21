import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotaoPrimario({ titulo, onPress, cor = '#0EA5E9' }) {
  return (
    <TouchableOpacity style={[styles.botao, { backgroundColor: cor }]} onPress={onPress}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 6,
  },
  texto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});