import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTrabalhos } from '../banco-de-dados/trabalhoRepository';

const MESES = [
  { numero: 1, nome: 'Jan', nomeCompleto: 'Janeiro' }, { numero: 2, nome: 'Fev', nomeCompleto: 'Fevereiro' }, { numero: 3, nome: 'Mar', nomeCompleto: 'Março' },
  { numero: 4, nome: 'Abr', nomeCompleto: 'Abril' }, { numero: 5, nome: 'Mai', nomeCompleto: 'Maio' }, { numero: 6, nome: 'Jun', nomeCompleto: 'Junho' },
  { numero: 7, nome: 'Jul', nomeCompleto: 'Julho' }, { numero: 8, nome: 'Ago', nomeCompleto: 'Agosto' }, { numero: 9, nome: 'Set', nomeCompleto: 'Setembro' },
  { numero: 10, nome: 'Out', nomeCompleto: 'Outubro' }, { numero: 11, nome: 'Nov', nomeCompleto: 'Novembro' }, { numero: 12, nome: 'Dez', nomeCompleto: 'Dezembro' },
];

const COR_SITUACAO = { concluido: '#22C55E', cancelado: '#EF4444', pendente: '#F59E0B' };

export default function HomeScreen() {
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [trabalhos, setTrabalhos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarTrabalhos();
    }, [mesSelecionado])
  );

  const carregarTrabalhos = async () => {
    try {
      const todos = await buscarTrabalhos() || [];
      const filtrados = todos.filter((t) => {
        if (!t || !t.Data_entrega) return false;
        const partes = t.Data_entrega.split('-');
        const mes = parseInt(partes[1], 10);
        return mes === mesSelecionado;
      });
      setTrabalhos(filtrados);
    } catch (error) {
      console.error(error);
    }
  };

  const renderMes = ({ item }) => (
    <TouchableOpacity
      style={[styles.mesCard, mesSelecionado === item.numero && styles.mesCardAtivo]}
      onPress={() => setMesSelecionado(item.numero)}
    >
      <Image 
        source={require('../../assets/calendar.png')} 
        style={[
          styles.mesIconeImagem, 
          mesSelecionado === item.numero && styles.mesIconeImagemAtiva
        ]} 
      />
      <Text style={[styles.mesNome, mesSelecionado === item.numero && styles.mesNomeAtivo]}>
        {item.nome}
      </Text>
    </TouchableOpacity>
  );

  const renderTrabalho = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <Text style={styles.cardTitulo}>{item.Nome}</Text>
        <View style={[styles.badge, { backgroundColor: COR_SITUACAO[item.Situacao] ?? '#94A3B8' }]}>
          <Text style={styles.badgeTexto}>{item.Situacao}</Text>
        </View>
      </View>
      <Text style={styles.cardData}>📅 Entrega: {item.Data_entrega}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Controle de Trabalhos</Text>
      <FlatList
        data={MESES} horizontal keyExtractor={(item) => String(item.numero)}
        showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.scrollerLista}
        renderItem={renderMes}
      />
      <Text style={styles.subtitulo}>Trabalhos que vencem em {MESES[mesSelecionado - 1].nomeCompleto}</Text>
      <FlatList
        data={trabalhos} keyExtractor={(item) => String(item.ID)}
        contentContainerStyle={styles.listaContainer}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum trabalho com vencimento neste mês.</Text>}
        renderItem={renderTrabalho}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0EA5E9',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
  },
  scrollerLista: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  mesCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 64,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  mesCardAtivo: {
    borderColor: '#0EA5E9',
    backgroundColor: '#E0F2FE',
  },
  mesIcone: {
    fontSize: 22,
  },
  mesNome: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  mesNomeAtivo: {
    color: '#0EA5E9',
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  listaContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeTexto: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardData: {
    color: '#64748B',
    fontSize: 13,
  },
  vazio: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 50,
    fontSize: 15,
  },
});