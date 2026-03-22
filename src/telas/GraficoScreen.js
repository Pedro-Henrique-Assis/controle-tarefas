import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarAtividadesPorTrabalho } from '../banco-de-dados/atividadeRepository';

const COR_STATUS = { concluida: '#22C55E', cancelada: '#EF4444', pendente: '#F59E0B' };

export default function GraficoScreen({ navigation, route }) {
  const { trabalho } = route.params;
  const [atividades, setAtividades] = useState([]);

  useFocusEffect(useCallback(() => {
    const carregar = async () => {
      const res = await buscarAtividadesPorTrabalho(trabalho.ID);
      setAtividades(res || []);
    };
    carregar();
  }, [trabalho.ID]));

  const total = atividades.length;
  const concluidas = atividades.filter((a) => a.Status === 'concluida').length;
  const pendentes = atividades.filter((a) => a.Status === 'pendente').length;
  const canceladas = atividades.filter((a) => a.Status === 'cancelada').length;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const totalHoras = atividades.reduce((soma, a) => soma + (a.Horas_trabalhadas || 0), 0);
  const horasConcluidas = atividades
    .filter((a) => a.Status === 'concluida')
    .reduce((soma, a) => soma + (a.Horas_trabalhadas || 0), 0);

  const larguraBarra = (quantidade) => (total > 0 ? (quantidade / total) * 100 : 0);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Progresso</Text>
        <Text style={styles.subtitulo}>Atividade: {trabalho.Nome}</Text>

        <View style={styles.percentualContainer}>
          <View style={styles.circulo}>
            <Text style={styles.percentualNumero}>{percentual}%</Text>
            <Text style={styles.percentualLabel}>concluído</Text>
          </View>
        </View>

        <Text style={styles.secao}>Atividades por status</Text>
        {[
          { status: 'concluida', quantidade: concluidas },
          { status: 'pendente', quantidade: pendentes },
          { status: 'cancelada', quantidade: canceladas },
        ].map(({ status, quantidade }) => (
          <View key={status} style={styles.barraContainer}>
            <Text style={styles.barraLabel}>{status}</Text>
            <View style={styles.barraTrilho}>
              <View style={[styles.barraPreenchimento, { width: `${larguraBarra(quantidade)}%`, backgroundColor: COR_STATUS[status] }]} />
            </View>
            <Text style={styles.barraValor}>{quantidade}</Text>
          </View>
        ))}

        <Text style={styles.secao}>Resumo geral</Text>
        <View style={styles.resumoGrid}>
          <View style={[styles.resumoCard, { borderLeftColor: '#0EA5E9' }]}>
            <Text style={styles.resumoNumero}>{total}</Text>
            <Text style={styles.resumoTexto}>Total de atividades</Text>
          </View>
          <View style={[styles.resumoCard, { borderLeftColor: '#22C55E' }]}>
            <Text style={styles.resumoNumero}>{horasConcluidas}h</Text>
            <Text style={styles.resumoTexto}>Horas concluídas</Text>
          </View>
          <View style={[styles.resumoCard, { borderLeftColor: '#F59E0B' }]}>
            <Text style={styles.resumoNumero}>{totalHoras}h</Text>
            <Text style={styles.resumoTexto}>Total de horas</Text>
          </View>
        </View>

        <Text style={styles.secao}>Detalhamento</Text>
        {atividades.map((a) => (
          <View key={a.ID_Atividade} style={styles.atividadeItem}>
            <View style={[styles.atividadePonto, { backgroundColor: COR_STATUS[a.Status] ?? '#94A3B8' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.atividadeDesc}>{a.Descricao}</Text>
              <Text style={styles.atividadeInfo}>RA: {a.Aluno_RA}</Text>
              <Text style={styles.atividadeInfo}>Horas: {a.Horas_trabalhadas}h</Text>
            </View>
            <Text style={[styles.atividadeStatus, { color: COR_STATUS[a.Status] ?? '#94A3B8' }]}>{a.Status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  voltar: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  voltarTexto: {
    color: '#0EA5E9',
    fontSize: 16,
    fontWeight: '600',
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 20,
  },
  percentualContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  circulo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  percentualNumero: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  percentualLabel: {
    fontSize: 13,
    color: '#E0F2FE',
  },
  secao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginTop: 20,
    marginBottom: 12,
  },
  barraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barraLabel: {
    width: 80,
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  barraTrilho: {
    flex: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barraPreenchimento: {
    height: '100%',
    borderRadius: 8,
  },
  barraValor: {
    width: 28,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  resumoGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  resumoCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
  },
  resumoNumero: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  resumoTexto: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  atividadeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
  },
  atividadePonto: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  atividadeDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  atividadeInfo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  atividadeStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});