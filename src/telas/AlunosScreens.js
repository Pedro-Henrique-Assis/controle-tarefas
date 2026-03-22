import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarAlunos, inserirAluno, atualizarAluno, deletarAluno } from '../banco-de-dados/alunoRepository';
import InputTexto from '../componentes/InputTexto';
import BotaoPrimario from '../componentes/BotaoPrimario';

export default function AlunosScreen() {
  const [alunos, setAlunos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [ra, setRa] = useState('');
  const [nome, setNome] = useState('');
  const [editando, setEditando] = useState(false);

  useFocusEffect(useCallback(() => { carregarAlunos(); }, []));

  const carregarAlunos = async () => setAlunos(await buscarAlunos() || []);

  const abrirModalNovo = () => {
    setRa(''); setNome(''); setEditando(false); setModalVisivel(true);
  };

  const abrirModalEditar = (aluno) => {
    setRa(aluno.RA); setNome(aluno.Nome); setEditando(true); setModalVisivel(true);
  };

  const salvar = async () => {
    if (!ra.trim() || !nome.trim()) return Alert.alert('Atenção', 'Preencha todos os campos.');
    
    if (editando) {
      await atualizarAluno(ra, nome);
    } else {
      await inserirAluno(ra, nome);
    }
    setModalVisivel(false);
    await carregarAlunos();
  };

  const confirmarDeletar = (raAluno) => {
    Alert.alert('Excluir aluno', 'Deseja excluir este aluno?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await deletarAluno(raAluno); carregarAlunos(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Alunos</Text>
        <TouchableOpacity style={styles.botaoNovo} onPress={abrirModalNovo}>
          <Text style={styles.botaoNovoTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alunos} keyExtractor={(item) => item.RA} contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum aluno cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardNome}>{item.Nome}</Text>
              <Text style={styles.cardRA}>RA: {item.RA}</Text>
            </View>
            <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.icone}>
              <Text style={{ fontSize: 18 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmarDeletar(item.RA)} style={styles.icone}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>{editando ? 'Editar Aluno' : 'Novo Aluno'}</Text>
            <InputTexto label="RA" value={ra} onChangeText={setRa} placeholder="Ex: 123456" editable={!editando} />
            <InputTexto label="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo" />
            <BotaoPrimario titulo="Salvar" onPress={salvar} />
            <BotaoPrimario titulo="Cancelar" onPress={() => setModalVisivel(false)} cor="#94A3B8" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0EA5E9' },
  botaoNovo: { backgroundColor: '#0EA5E9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  botaoNovoTexto: { color: '#FFF', fontWeight: 'bold' },
  lista: { paddingHorizontal: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  cardNome: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  cardRA: { fontSize: 13, color: '#64748B', marginTop: 2 },
  icone: { padding: 6 },
  vazio: { textAlign: 'center', color: '#94A3B8', marginTop: 50, fontSize: 15 },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
});