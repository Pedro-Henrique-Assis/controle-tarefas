import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputTexto({ label, value, onChangeText, placeholder, editable = true, keyboardType = 'default' }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, !editable && styles.inputDesabilitado]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 13, color: '#475569', marginBottom: 4, fontWeight: '600' },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  inputDesabilitado: { backgroundColor: '#F1F5F9', color: '#94A3B8' },
});