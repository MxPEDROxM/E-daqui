import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Edit, Store, Briefcase, ChevronRight, PlusCircle, X } from 'lucide-react-native';
import { banco } from '../database/db';
import CartaoServico from '../components/CartaoServico';
const TelaMeusAnuncios = ({ navigation }) => {
  const [anuncios, setAnuncios] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);

  const carregarAnuncios = () => {
    try {

      const registros = banco.getAllSync('SELECT * FROM servicos ORDER BY id DESC');
      setAnuncios(registros);
    } catch (erro) {
      console.error('Erro ao carregar anúncios', erro);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarAnuncios();
    }, [])
  );

  if (anuncios.length === 0) {
    return (
      <View style={estilos.containerVazio}>
        <Store color="#AAA7A5" size={64} style={estilos.iconeVazio} />
        <Text style={estilos.tituloVazio}>Nenhum anúncio ativo</Text>
        <Text style={estilos.subtituloVazio}>
          Você ainda não possui anúncios cadastrados.
        </Text>
        <TouchableOpacity
          style={estilos.botaoNovoAnuncio}
          onPress={() => setModalVisivel(true)}
        >
          <PlusCircle color="#F7F2ED" size={20} style={{ marginRight: 8 }} />
          <Text style={estilos.textoBotaoNovo}>Criar novo anúncio</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={() => setModalVisivel(false)}
        >
          <View style={estilos.modalFundo}>
            <View style={estilos.modalConteudo}>
              <View style={estilos.modalCabecalho}>
                <Text style={estilos.modalTitulo}>Tipo de Anúncio</Text>
                <TouchableOpacity onPress={() => setModalVisivel(false)} style={estilos.modalBotaoFechar}>
                  <X color="#AAA7A5" size={24} />
                </TouchableOpacity>
              </View>

              <Text style={estilos.modalSubtitulo}>Como você atende seus clientes?</Text>

              <TouchableOpacity
                style={estilos.modalOpcao}
                onPress={() => {
                  setModalVisivel(false);
                  navigation.navigate('Cadastro', { tipo: 'loja' });
                }}
              >
                <View style={[estilos.modalOpcaoIcone, { backgroundColor: '#DD6C34' }]}>
                  <Store color="#F7F2ED" size={28} />
                </View>
                <View style={estilos.modalOpcaoTextos}>
                  <Text style={estilos.modalOpcaoTitulo}>Local Físico</Text>
                  <Text style={estilos.modalOpcaoDescricao}>Tenho um local fixo onde recebo meus clientes.</Text>
                </View>
                <ChevronRight color="#AAA7A5" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.modalOpcao}
                onPress={() => {
                  setModalVisivel(false);
                  navigation.navigate('Cadastro', { tipo: 'prestador' });
                }}
              >
                <View style={[estilos.modalOpcaoIcone, { backgroundColor: '#F7F2ED' }]}>
                  <Briefcase color="#DD6C34" size={28} />
                </View>
                <View style={estilos.modalOpcaoTextos}>
                  <Text style={estilos.modalOpcaoTitulo}>Delivery / Serviços</Text>
                  <Text style={estilos.modalOpcaoDescricao}>Atendo online, faço entregas ou vou até o cliente.</Text>
                </View>
                <ChevronRight color="#AAA7A5" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const handleExcluir = (id) => {
    Alert.alert(
      "Excluir Anúncio",
      "Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            try {
              banco.runSync('DELETE FROM servicos WHERE id = ?', [id]);
              carregarAnuncios();
            } catch (erro) {
              console.error('Erro ao excluir serviço', erro);
              Alert.alert('Erro', 'Não foi possível excluir o anúncio.');
            }
          }
        }
      ]
    );
  };

  const renderAnuncio = ({ item }) => {
    return (
      <CartaoServico 
        servico={item} 
        apenasVisualizacao={false} 
        aoEditar={(serv) => navigation.navigate('Cadastro', { servico: serv })}
        aoExcluir={handleExcluir}
      />
    );
  };


  return (
    <View style={estilos.container}>
      <FlatList
        data={anuncios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAnuncio}
        contentContainerStyle={estilos.conteudoLista}
        ListHeaderComponent={
          <Text style={estilos.contador}>
            {anuncios.length} anúncio{anuncios.length !== 1 ? 's' : ''} ativo{anuncios.length !== 1 ? 's' : ''}
          </Text>
        }
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2825',
  },
  conteudoLista: {
    padding: 16,
    paddingBottom: 32,
  },
  contador: {
    fontSize: 13,
    color: '#AAA7A5',
    marginBottom: 12,
    fontWeight: '500',
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#2B2825',
  },
  iconeVazio: {
    marginBottom: 16,
  },
  tituloVazio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F2ED',
    marginBottom: 8,
  },
  subtituloVazio: {
    fontSize: 14,
    color: '#AAA7A5',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  botaoNovoAnuncio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DD6C34',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  textoBotaoNovo: {
    color: '#F7F2ED',
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingBottom: 40,
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F2ED',
  },
  modalBotaoFechar: {
    padding: 4,
  },
  modalSubtitulo: {
    fontSize: 14,
    color: '#AAA7A5',
    marginBottom: 24,
  },
  modalOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#403D3A',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#403D3A',
  },
  modalOpcaoIcone: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalOpcaoTextos: {
    flex: 1,
    marginRight: 8,
  },
  modalOpcaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F7F2ED',
    marginBottom: 4,
  },
  modalOpcaoDescricao: {
    fontSize: 13,
    color: '#AAA7A5',
    lineHeight: 18,
  },
});

export default TelaMeusAnuncios;

