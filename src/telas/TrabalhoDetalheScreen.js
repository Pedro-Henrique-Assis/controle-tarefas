import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { buscarAlunosPorTrabalho } from '../banco-de-dados/alunoXTrabalhoRepository';
import BotaoPrimario from '../componentes/BotaoPrimario';

export default function TrabalhoDetalheScreen({ navigation, route }) {
  const { trabalho } = route.params;
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const vinculados = await buscarAlunosPorTrabalho(trabalho.ID);
      setAlunos(vinculados || []);
    };
    carregar();
  }, [trabalho.ID]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>{trabalho.Nome}</Text>
        <Text style={styles.info}>📅 Entrega: {trabalho.Data_entrega}</Text>
        <Text style={styles.info}>📌 Situação: {trabalho.Situacao}</Text>

        <Text style={styles.secao}>Alunos participantes</Text>
        {alunos.map((a) => (
          <View key={a.RA} style={styles.alunoCard}>
            <Text style={styles.alunoNome}>{a.Nome}</Text>
            <Text style={styles.alunoRA}>RA: {a.RA}</Text>
          </View>
        ))}

        <Text style={styles.secao}>Opções</Text>
        <BotaoPrimario titulo="📋 Ver Atividades" onPress={() => navigation.navigate('Atividades', { trabalho })} />
        <BotaoPrimario titulo="⚙️ Andamento das Atividades" onPress={() => navigation.navigate('Andamento', { trabalho })} cor="#7C3AED" />
        <BotaoPrimario titulo="📊 Gráfico de Progresso" onPress={() => navigation.navigate('Grafico', { trabalho })} cor="#059669" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  voltar: { padding: 20 },
  voltarTexto: { color: '#0EA5E9', fontSize: 16, fontWeight: '600' },
  conteudo: { paddingHorizontal: 20, paddingBottom: 40 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  info: { fontSize: 15, color: '#475569', marginBottom: 6 },
  secao: { fontSize: 16, fontWeight: 'bold', color: '#0EA5E9', marginTop: 20, marginBottom: 10 },
  alunoCard: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginBottom: 8, elevation: 1 },
  alunoNome: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  alunoRA: { fontSize: 13, color: '#64748B' },
});