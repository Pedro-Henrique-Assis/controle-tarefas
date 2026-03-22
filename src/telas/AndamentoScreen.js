import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarAtividadesPorTrabalho, atualizarStatusAtividade } from '../banco-de-dados/atividadeRepository';

const SITUACOES = ['pendente', 'concluida', 'cancelada'];
const COR_STATUS = { concluida: '#22C55E', cancelada: '#EF4444', pendente: '#F59E0B' };

export default function AndamentoScreen({ navigation, route }) {
  const { trabalho } = route.params;
  const [atividades, setAtividades] = useState([]);

  const carregar = async () => {
    setAtividades(await buscarAtividadesPorTrabalho(trabalho.ID) || []);
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const alterarStatus = async (id, novoStatus) => {
    await atualizarStatusAtividade(id, novoStatus);
    await carregar();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>Andamento</Text>
      <Text style={styles.subtitulo}>{trabalho.Nome}</Text>

      <FlatList
        data={atividades} keyExtractor={(item) => String(item.ID_Atividade)}
        contentContainerStyle={styles.lista} ListEmptyComponent={<Text style={styles.vazio}>Nenhuma atividade neste trabalho.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardDesc}>{item.Descricao}</Text>
            <Text style={styles.cardAluno}>👤 RA: {item.Aluno_RA}</Text>
            <Text style={styles.labelStatus}>Alterar status:</Text>
            <View style={styles.statusRow}>
              {SITUACOES.map((s) => (
                <TouchableOpacity key={s} onPress={() => alterarStatus(item.ID_Atividade, s)} style={[styles.statusBotao, item.Status === s && { backgroundColor: COR_STATUS[s] }]}>
                  <Text style={[styles.statusTexto, item.Status === s && { color: '#FFF' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  voltar: { paddingHorizontal: 20, paddingTop: 16 },
  voltarTexto: { color: '#0EA5E9', fontSize: 16, fontWeight: '600' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0EA5E9', paddingHorizontal: 20, paddingTop: 8 },
  subtitulo: { fontSize: 15, color: '#475569', paddingHorizontal: 20, marginBottom: 12 },
  lista: { paddingHorizontal: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardDesc: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  cardAluno: { fontSize: 13, color: '#64748B', marginBottom: 10 },
  labelStatus: { fontSize: 13, color: '#475569', fontWeight: '600', marginBottom: 8 },
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusBotao: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#CBD5E1' },
  statusTexto: { color: '#475569', fontWeight: '600', fontSize: 13 },
  vazio: { textAlign: 'center', color: '#94A3B8', marginTop: 50, fontSize: 15 },
});