import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { banco } from '../database/db';
import CartaoServico from '../components/CartaoServico';

const TelaCatalogo = () => {
  const [servicos, setServicos] = useState([]);
  const [busca, setBusca] = useState('');


  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroBairro, setFiltroBairro] = useState('');
  const [filtroCidade, setFiltroCidade] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');


  const [modalFiltrosVisivel, setModalFiltrosVisivel] = useState(false);
  const [tempBairro, setTempBairro] = useState('');
  const [tempCidade, setTempCidade] = useState('');
  const [tempCategoria, setTempCategoria] = useState('');

  const categoriasTodas = [
    'Alimentação e Consumo Local', 'Beleza e Estética', 'Saúde e Bem-Estar', 
    'Comércio e Varejo', 'Oficinas e Manutenção', 'Delivery de Comida', 
    'Serviços em Domicílio', 'Cuidados e Apoio Pessoal', 'Serviços Digitais e Criativos', 
    'Aulas e Consultas Online', 'E-commerce e Vendas Online'
  ];

  const carregarServicos = () => {
    try {
      const todosRegistros = banco.getAllSync('SELECT * FROM servicos ORDER BY id DESC');
      setServicos(todosRegistros);
    } catch (erro) {
      console.error('Erro ao carregar serviços', erro);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarServicos();
    }, [])
  );

  const abrirModalFiltros = () => {
    setTempBairro(filtroBairro);
    setTempCidade(filtroCidade);
    setTempCategoria(filtroCategoria);
    setModalFiltrosVisivel(true);
  };

  const aplicarFiltrosAvancados = () => {
    setFiltroBairro(tempBairro);
    setFiltroCidade(tempCidade);
    setFiltroCategoria(tempCategoria);
    setModalFiltrosVisivel(false);
  };

  const limparFiltrosAvancados = () => {
    setTempBairro('');
    setTempCidade('');
    setTempCategoria('');
    setFiltroBairro('');
    setFiltroCidade('');
    setFiltroCategoria('');
    setModalFiltrosVisivel(false);
  };

  const toggleFavorito = (servico) => {
    try {
      const novoStatus = servico.favorito === 1 ? 0 : 1;
      banco.runSync('UPDATE servicos SET favorito = ? WHERE id = ?', [novoStatus, servico.id]);
      carregarServicos();
    } catch (erro) {
      console.error('Erro ao atualizar favorito', erro);
    }
  };

  const servicosFiltrados = useMemo(() => {
    return servicos.filter(servico => {

    if (busca) {
      const textoBusca = busca.toLowerCase();
      const nome = servico.nome ? servico.nome.toLowerCase() : '';
      const categoria = servico.categoria ? servico.categoria.toLowerCase() : '';
      if (!nome.includes(textoBusca) && !categoria.includes(textoBusca)) {
        return false;
      }
    }


    if (filtroTipo !== 'Todos') {
      if (filtroTipo === 'Favoritos' && servico.favorito !== 1) return false;
      if (filtroTipo === 'Local Físico' && servico.possuiLojaFisica !== 1) return false;
      if (filtroTipo === 'Delivery/Serviços' && servico.possuiLojaFisica === 1) return false;
    }


    if (filtroCategoria) {
      if (servico.categoria !== filtroCategoria) return false;
    }


    if (filtroCidade) {
      const cid = servico.cidade ? servico.cidade.toLowerCase() : '';
      if (!cid.includes(filtroCidade.toLowerCase())) return false;
    }


    if (filtroBairro) {
      const bai = servico.bairro ? servico.bairro.toLowerCase() : '';
      if (!bai.includes(filtroBairro.toLowerCase())) return false;
    }

    return true;
    });
  }, [servicos, busca, filtroTipo, filtroCategoria, filtroCidade, filtroBairro]);

  const tipos = ['Todos', 'Favoritos', 'Local Físico', 'Delivery/Serviços'];

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.tituloCabecalho}>É Daqui</Text>
        <Text style={estilos.subtituloCabecalho}>Encontre os melhores serviços no seu bairro</Text>

        <View style={estilos.containerBusca}>
          <View style={estilos.inputBuscaContainer}>
            <Search color="#AAA7A5" size={20} style={estilos.iconeBusca} />
            <TextInput
              style={estilos.inputBusca}
              placeholder="O que você está procurando?"
              placeholderTextColor="#AAA7A5"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity style={estilos.botaoFiltro} onPress={abrirModalFiltros}>
            <SlidersHorizontal color="#F7F2ED" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={estilos.scrollTipos}
          contentContainerStyle={estilos.containerTipos}
        >
          {tipos.map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={[estilos.pilulaTipo, filtroTipo === tipo && estilos.pilulaTipoAtiva]}
              onPress={() => setFiltroTipo(tipo)}
            >
              <Text style={[estilos.textoPilula, filtroTipo === tipo && estilos.textoPilulaAtiva]}>
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {servicosFiltrados.length === 0 ? (
        <View style={estilos.containerVazio}>
          <Text style={estilos.textoVazio}>Nenhum resultado encontrado.</Text>
          <Text style={estilos.subtextoVazio}>Tente ajustar seus filtros ou busca.</Text>
        </View>
      ) : (
        <FlatList
          data={servicosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CartaoServico servico={item} aoFavoritar={toggleFavorito} apenasVisualizacao={true} />
          )}
          contentContainerStyle={estilos.conteudoLista}
        />
      )}

      {/* Modal de Filtros Avançados */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFiltrosVisivel}
        onRequestClose={() => setModalFiltrosVisivel(false)}
      >
        <View style={estilos.modalFundo}>
          <View style={estilos.modalConteudo}>
            <View style={estilos.modalCabecalho}>
              <Text style={estilos.modalTitulo}>Filtros Avançados</Text>
              <TouchableOpacity onPress={() => setModalFiltrosVisivel(false)} style={estilos.modalBotaoFechar}>
                <X color="#AAA7A5" size={24} />
              </TouchableOpacity>
            </View>

            <View style={estilos.grupoFormulario}>
              <Text style={estilos.rotulo}>Cidade</Text>
              <TextInput
                style={estilos.entrada}
                value={tempCidade}
                onChangeText={setTempCidade}
                placeholder="Ex: Rio de Janeiro"
                placeholderTextColor="#AAA7A5"
              />
            </View>

            <View style={estilos.grupoFormulario}>
              <Text style={estilos.rotulo}>Bairro</Text>
              <TextInput
                style={estilos.entrada}
                value={tempBairro}
                onChangeText={setTempBairro}
                placeholder="Ex: Copacabana"
                placeholderTextColor="#AAA7A5"
              />
            </View>

            <View style={estilos.grupoFormulario}>
              <Text style={estilos.rotulo}>Categoria Específica</Text>
              <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={true}>
                <View style={estilos.containerCategoriasModal}>
                  {categoriasTodas.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[estilos.pilulaModal, tempCategoria === cat && estilos.pilulaModalAtiva]}
                      onPress={() => setTempCategoria(tempCategoria === cat ? '' : cat)}
                    >
                      <Text style={[estilos.textoPilulaModal, tempCategoria === cat && estilos.textoPilulaModalAtiva]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={estilos.modalBotoes}>
              <TouchableOpacity style={estilos.botaoLimpar} onPress={limparFiltrosAvancados}>
                <Text style={estilos.textoBotaoLimpar}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={estilos.botaoAplicar} onPress={aplicarFiltrosAvancados}>
                <Text style={estilos.textoBotaoAplicar}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2825',
  },
  cabecalho: {
    backgroundColor: '#DD6C34',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tituloCabecalho: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7F2ED',
    marginBottom: 4,
  },
  subtituloCabecalho: {
    fontSize: 14,
    color: '#F7F2ED',
    marginBottom: 16,
  },
  containerBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputBuscaContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2ED',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  iconeBusca: {
    marginRight: 8,
  },
  inputBusca: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#2B2825',
  },
  botaoFiltro: {
    backgroundColor: '#595551',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollTipos: {
    maxHeight: 36,
  },
  containerTipos: {
    alignItems: 'center',
    paddingRight: 20,
  },
  pilulaTipo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#403D3A',
    borderRadius: 20,
    marginRight: 8,
  },
  pilulaTipoAtiva: {
    backgroundColor: '#F7F2ED',
  },
  textoPilula: {
    color: '#F7F2ED',
    fontSize: 14,
    fontWeight: '600',
  },
  textoPilulaAtiva: {
    color: '#DD6C34',
  },
  conteudoLista: {
    padding: 16,
    paddingTop: 24,
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoVazio: {
    fontSize: 18,
    color: '#F7F2ED',
    fontWeight: '600',
    textAlign: 'center',
  },
  subtextoVazio: {
    fontSize: 14,
    color: '#AAA7A5',
    marginTop: 8,
    textAlign: 'center',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#2B2825',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300,
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F2ED',
  },
  modalBotaoFechar: {
    padding: 4,
  },
  grupoFormulario: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7F2ED',
    marginBottom: 8,
  },
  entrada: {
    backgroundColor: '#595551',
    borderWidth: 1,
    borderColor: '#2B2825',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F7F2ED',
  },
  containerCategoriasModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 10,
  },
  pilulaModal: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#595551',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#595551',
  },
  pilulaModalAtiva: {
    borderColor: '#DD6C34',
    backgroundColor: '#2B2825',
  },
  textoPilulaModal: {
    color: '#AAA7A5',
    fontSize: 13,
  },
  textoPilulaModalAtiva: {
    color: '#DD6C34',
    fontWeight: 'bold',
  },
  modalBotoes: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  botaoLimpar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#595551',
    alignItems: 'center',
  },
  textoBotaoLimpar: {
    color: '#AAA7A5',
    fontSize: 16,
    fontWeight: '600',
  },
  botaoAplicar: {
    flex: 2,
    backgroundColor: '#DD6C34',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotaoAplicar: {
    color: '#F7F2ED',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TelaCatalogo;
