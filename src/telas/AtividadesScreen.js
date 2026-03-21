import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarAtividadesPorTrabalho, inserirAtividade, atualizarAtividade, deletarAtividade } from '../banco-de-dados/atividadeRepository';
import { buscarAlunosPorTrabalho } from '../banco-de-dados/alunoXTrabalhoRepository';
import InputTexto from '../componentes/InputTexto';
import BotaoPrimario from '../componentes/BotaoPrimario';

const SITUACOES = ['pendente', 'concluida', 'cancelada'];
const COR_STATUS = { concluida: '#22C55E', cancelada: '#EF4444', pendente: '#F59E0B' };

export default function AtividadesScreen({ navigation, route }) {
  const { trabalho } = route.params;
  const [atividades, setAtividades] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('pendente');
  const [horas, setHoras] = useState('');
  const [alunoRA, setAlunoRA] = useState('');
  const [alunosDoTrabalho, setAlunosDoTrabalho] = useState([]);
  const [atividadeEditando, setAtividadeEditando] = useState(null);

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const carregar = () => {
    setAtividades(buscarAtividadesPorTrabalho(trabalho.ID));
    setAlunosDoTrabalho(buscarAlunosPorTrabalho(trabalho.ID));
  };

  const abrirModalNovo = () => {
    setDescricao(''); setStatus('pendente'); setHoras(''); setAlunoRA('');
    setAtividadeEditando(null); setModalVisivel(true);
  };

  const abrirModalEditar = (a) => {
    setDescricao(a.Descricao); setStatus(a.Status);
    setHoras(String(a.Horas_trabalhadas)); setAlunoRA(a.Aluno_RA);
    setAtividadeEditando(a); setModalVisivel(true);
  };

  const salvar = () => {
    if (!descricao.trim() || !alunoRA) {
      return Alert.alert('Atenção', 'Preencha descrição e selecione um aluno.');
    }
    const horasNum = parseFloat(horas) || 0;
    if (atividadeEditando) {
      atualizarAtividade(atividadeEditando.ID_Atividade, descricao, status, horasNum, trabalho.ID, alunoRA);
    } else {
      inserirAtividade(descricao, status, horasNum, trabalho.ID, alunoRA);
    }
    setModalVisivel(false);
    carregar();
  };

  const confirmarDeletar = (id) => {
    Alert.alert('Excluir atividade', 'Deseja excluir esta atividade?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deletarAtividade(id); carregar(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Atividades</Text>
        <TouchableOpacity style={styles.botaoNovo} onPress={abrirModalNovo}>
          <Text style={styles.botaoNovoTexto}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={atividades}
        keyExtractor={(item) => String(item.ID_Atividade)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma atividade cadastrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardDesc}>{item.Descricao}</Text>
              <Text style={styles.cardInfo}>👤 RA: {item.Aluno_RA}  ⏱ {item.Horas_trabalhadas}h</Text>
              <View style={[styles.badge, { backgroundColor: COR_STATUS[item.Status] ?? '#94A3B8' }]}>
                <Text style={styles.badgeTexto}>{item.Status}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.icone}>
              <Text style={{ fontSize: 18 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmarDeletar(item.ID_Atividade)} style={styles.icone}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <ScrollView contentContainerStyle={styles.modalBox}>
            <Text style={styles.modalTitulo}>{atividadeEditando ? 'Editar Atividade' : 'Nova Atividade'}</Text>
            <InputTexto label="Descrição" value={descricao} onChangeText={setDescricao} placeholder="Descreva a atividade" />
            <InputTexto label="Horas trabalhadas" value={horas} onChangeText={setHoras} placeholder="Ex: 2.5" keyboardType="numeric" />

            <Text style={styles.labelCampo}>Status</Text>
            <View style={styles.situacaoRow}>
              {SITUACOES.map((s) => (
                <TouchableOpacity
                  key={s} onPress={() => setStatus(s)}
                  style={[styles.situacaoBotao, status === s && { backgroundColor: COR_STATUS[s] }]}
                >
                  <Text style={[styles.situacaoTexto, status === s && { color: '#FFF' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.labelCampo}>Aluno responsável</Text>
            {alunosDoTrabalho.map((a) => (
              <TouchableOpacity
                key={a.RA} onPress={() => setAlunoRA(a.RA)}
                style={[styles.alunoItem, alunoRA === a.RA && styles.alunoItemAtivo]}
              >
                <Text style={alunoRA === a.RA ? styles.alunoTextoAtivo : styles.alunoTexto}>
                  {alunoRA === a.RA ? '🔵' : '⚪'} {a.Nome}
                </Text>
              </TouchableOpacity>
            ))}

            <BotaoPrimario titulo="Salvar" onPress={salvar} />
            <BotaoPrimario titulo="Cancelar" onPress={() => setModalVisivel(false)} cor="#94A3B8" />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  voltar: { paddingHorizontal: 20, paddingTop: 16 },
  voltarTexto: { color: '#0EA5E9', fontSize: 16, fontWeight: '600' },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0EA5E9' },
  botaoNovo: { backgroundColor: '#0EA5E9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  botaoNovoTexto: { color: '#FFF', fontWeight: 'bold' },
  lista: { paddingHorizontal: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  cardDesc: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  cardInfo: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeTexto: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  icone: { padding: 6 },
  vazio: { textAlign: 'center', color: '#94A3B8', marginTop: 50, fontSize: 15 },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  labelCampo: { fontSize: 13, color: '#475569', fontWeight: '600', marginBottom: 8 },
  situacaoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  situacaoBotao: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#CBD5E1' },
  situacaoTexto: { color: '#475569', fontWeight: '600' },
  alunoItem: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 },
  alunoItemAtivo: { borderColor: '#0EA5E9', backgroundColor: '#E0F2FE' },
  alunoTexto: { color: '#475569', fontSize: 14 },
  alunoTextoAtivo: { color: '#0EA5E9', fontWeight: 'bold', fontSize: 14 },
});