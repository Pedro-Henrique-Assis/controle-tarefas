import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet, SafeAreaView, ScrollView, Platform, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Ionicons } from '@expo/vector-icons';
import { buscarTrabalhos, inserirTrabalho, atualizarTrabalho, deletarTrabalho } from '../banco-de-dados/trabalhoRepository';
import { buscarAlunos } from '../banco-de-dados/alunoRepository';
import { inserirAlunoXTrabalho, buscarAlunosPorTrabalho, deletarAlunoXTrabalho } from '../banco-de-dados/alunoXTrabalhoRepository';
import InputTexto from '../componentes/InputTexto';
import BotaoPrimario from '../componentes/BotaoPrimario';

const SITUACOES = ['pendente', 'concluido', 'cancelado'];
const COR_SITUACAO = { concluido: '#22C55E', cancelado: '#EF4444', pendente: '#F59E0B' };

export default function TrabalhosScreen({ navigation }) {
  const [trabalhos, setTrabalhos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nome, setNome] = useState('');
  const [situacao, setSituacao] = useState('pendente');
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [trabalhoEditando, setTrabalhoEditando] = useState(null);

  const [dataEntrega, setDataEntrega] = useState(''); 
  const [dataObjeto, setDataObjeto] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(useCallback(() => { carregarTrabalhos(); }, []));

  const carregarTrabalhos = async () => setTrabalhos(await buscarTrabalhos() || []);

  const abrirModalNovo = async () => {
    setNome(''); 
    setSituacao('pendente'); 
    setDataEntrega('');
    setDataObjeto(new Date()); 
    setAlunosSelecionados([]); 
    setTrabalhoEditando(null);
    setAlunosDisponiveis(await buscarAlunos() || []);
    setModalVisivel(true);
  };

  const abrirModalEditar = async (trabalho) => {
    setNome(trabalho.Nome); 
    setDataEntrega(trabalho.Data_entrega); 
    
    let novaSituacao = trabalho.Situacao;

    if (trabalho.Data_entrega) {
      const partes = trabalho.Data_entrega.split('-');
      const dataEscolhida = new Date(partes[0], partes[1] - 1, partes[2]);
      setDataObjeto(dataEscolhida);

      // Inteligência extra: corrige trabalhos antigos que possam ter ficado pendentes no banco
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (dataEscolhida < hoje && novaSituacao === 'pendente') {
        novaSituacao = 'concluido';
      }
    } else {
      setDataObjeto(new Date());
    }

    setSituacao(novaSituacao);
    setTrabalhoEditando(trabalho);
    const alunos = await buscarAlunos() || [];
    const alunosDoTrabalho = await buscarAlunosPorTrabalho(trabalho.ID) || [];
    const rasSelecionados = alunosDoTrabalho.map((a) => a.RA);
    setAlunosDisponiveis(alunos);
    setAlunosSelecionados(rasSelecionados);
    setModalVisivel(true);
  };

  const onChangeData = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false); 
    }
    
    if (selectedDate) {
      setDataObjeto(selectedDate); 
      
      const ano = selectedDate.getFullYear();
      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dia = String(selectedDate.getDate()).padStart(2, '0');
      setDataEntrega(`${ano}-${mes}-${dia}`); 

      // Se escolher uma data passada e estiver 'pendente', muda pra 'concluido' automaticamente
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataEscolhida = new Date(ano, selectedDate.getMonth(), selectedDate.getDate());
      
      if (dataEscolhida < hoje && situacao === 'pendente') {
        setSituacao('concluido');
      }
    }
  };

  const toggleAluno = (ra) => {
    setAlunosSelecionados((prev) =>
      prev.includes(ra) ? prev.filter((r) => r !== ra) : [...prev, ra]
    );
  };

  const salvar = async () => {
    if (!nome.trim() || !dataEntrega.trim()) return Alert.alert('Atenção', 'Preencha nome e selecione a data de entrega.');
    if (alunosSelecionados.length === 0) return Alert.alert('Atenção', 'Selecione ao menos um aluno.');

    if (trabalhoEditando) {
      await atualizarTrabalho(trabalhoEditando.ID, nome, situacao, dataEntrega);
      const vinculadosAntigos = await buscarAlunosPorTrabalho(trabalhoEditando.ID) || [];
      for (const a of vinculadosAntigos) await deletarAlunoXTrabalho(trabalhoEditando.ID, a.RA);
      for (const ra of alunosSelecionados) await inserirAlunoXTrabalho(trabalhoEditando.ID, ra);
    } else {
      await inserirTrabalho(nome, situacao, dataEntrega);
      const todos = await buscarTrabalhos() || [];
      if (todos.length > 0) {
        const novoId = todos[todos.length - 1].ID;
        for (const ra of alunosSelecionados) await inserirAlunoXTrabalho(novoId, ra);
      }
    }
    setModalVisivel(false);
    await carregarTrabalhos();
  };

  const confirmarDeletar = (id) => {
    Alert.alert('Excluir trabalho', 'Deseja excluir este trabalho?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await deletarTrabalho(id); carregarTrabalhos(); } },
    ]);
  };

  // Verifica ANTES de renderizar a tela se a data informada está no passado
  let dataNoPassado = false;
  if (dataEntrega) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const partes = dataEntrega.split('-');
    const dataVerificada = new Date(partes[0], partes[1] - 1, partes[2]);
    if (dataVerificada < hoje) {
      dataNoPassado = true;
    }
  }

  // Se a data for no passado, cria uma lista de botões sem a opção 'pendente'
  const situacoesExibidas = dataNoPassado ? SITUACOES.filter(s => s !== 'pendente') : SITUACOES;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Trabalhos</Text>
        <TouchableOpacity style={styles.botaoNovo} onPress={abrirModalNovo}>
          <Text style={styles.botaoNovoTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trabalhos} keyExtractor={(item) => String(item.ID)} contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum trabalho cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitulo}>{item.Nome}</Text>
              <View style={styles.dataBox}>
                <Image source={require('../../assets/calendar.png')} style={styles.calendarIcon} />
                <Text style={styles.cardData}>{item.Data_entrega}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: COR_SITUACAO[item.Situacao] ?? '#94A3B8' }]}>
                <Text style={styles.badgeTexto}>{item.Situacao}</Text>
              </View>
            </View>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => navigation.navigate('TrabalhoDetalhe', { trabalho: item })} style={styles.icone}>
                <Image source={require('../../assets/lupa.png')} style={styles.iconeBotaoLupa} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.icone}>
                <Image source={require('../../assets/botao-editar.png')} style={styles.iconeBotaoImagem} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmarDeletar(item.ID)} style={styles.icone}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <ScrollView contentContainerStyle={styles.modalBox}>
            <Text style={styles.modalTitulo}>{trabalhoEditando ? 'Editar Trabalho' : 'Novo Trabalho'}</Text>
            
            <InputTexto label="Nome do trabalho" value={nome} onChangeText={setNome} placeholder="Ex: Projeto de TCC" />

            <Text style={styles.labelSituacao}>Data de entrega</Text>
            <TouchableOpacity style={styles.botaoData} onPress={() => setShowDatePicker(true)}>
              <Text style={dataEntrega ? styles.textoData : styles.textoPlaceholder}>
                {dataEntrega ? dataEntrega : "Toque para selecionar a data"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dataObjeto}
                mode="date"
                display="default"
                onChange={onChangeData}
              />
            )}

            <Text style={styles.labelSituacao}>Situação</Text>
            <View style={styles.situacaoRow}>
              {}
              {situacoesExibidas.map((s) => (
                <TouchableOpacity key={s} onPress={() => setSituacao(s)} style={[styles.situacaoBotao, situacao === s && { backgroundColor: COR_SITUACAO[s] }]}>
                  <Text style={[styles.situacaoTexto, situacao === s && { color: '#FFF' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.labelSituacao}>Alunos participantes</Text>
            {alunosDisponiveis.map((a) => (
              <TouchableOpacity key={a.RA} onPress={() => toggleAluno(a.RA)} style={[styles.alunoItem, alunosSelecionados.includes(a.RA) && styles.alunoItemAtivo]}>
                <Text style={alunosSelecionados.includes(a.RA) ? styles.alunoTextoAtivo : styles.alunoTexto}>
                  {alunosSelecionados.includes(a.RA) ? '✅' : '⬜'} {a.Nome}
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
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  botaoNovo: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  botaoNovoTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  lista: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  dataBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  calendarIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: '#64748B',
  },
  cardData: {
    fontSize: 13,
    color: '#64748B',
  },
  badge: {
    alignSelf: 'flex-start',
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
  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icone: {
    padding: 4,
    marginHorizontal: 2,
  },
  iconeBotaoImagem: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#0EA5E9',
  },
  iconeBotaoLupa: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#000000',
  },

  vazio: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 50,
    fontSize: 15,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 24,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  labelSituacao: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  botaoData: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  textoData: {
    color: '#1E293B',
    fontSize: 14,
  },
  textoPlaceholder: {
    color: '#94A3B8',
    fontSize: 14,
  },
  situacaoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  situacaoBotao: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  situacaoTexto: {
    color: '#475569',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  alunoItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  alunoItemAtivo: {
    borderColor: '#0EA5E9',
    backgroundColor: '#E0F2FE',
  },
  alunoTexto: {
    color: '#475569',
    fontSize: 14,
  },
  alunoTextoAtivo: {
    color: '#0EA5E9',
    fontWeight: 'bold',
    fontSize: 14,
  },
});