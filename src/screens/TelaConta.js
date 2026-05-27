import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal } from 'react-native';
import { User, Settings, Store, HelpCircle, Bell, ChevronRight, LogOut, Briefcase, X, LayoutList } from 'lucide-react-native';

const TelaConta = ({ navigation }) => {
  const [modalVisivel, setModalVisivel] = useState(false);


  const usuario = {
    nome: "José Silva de Oliveira",
    telefone: "(21) 98765-4321",
    foto: require('../../assets/perfil.jpg')
  };

  const ItemMenu = ({ icone: Icone, titulo, onPress, destaque }) => (
    <TouchableOpacity style={estilos.itemMenu} onPress={onPress}>
      <View style={[estilos.iconeContainer, destaque && estilos.iconeContainerDestaque]}>
        <Icone color={destaque ? "#ffffff" : "#AAA7A5"} size={22} />
      </View>
      <Text style={[estilos.textoItemMenu, destaque && estilos.textoItemMenuDestaque]}>{titulo}</Text>
      <ChevronRight color="#9ca3af" size={20} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={estilos.container} bounces={false}>
      <View style={estilos.cabecalhoPerfil}>
        <Image source={usuario.foto} style={estilos.fotoPerfil} />
        <View style={estilos.infoPerfil}>
          <Text style={estilos.nomeUsuario}>{usuario.nome}</Text>
          <Text style={estilos.telefoneUsuario}>{usuario.telefone}</Text>
        </View>
      </View>

      <View style={estilos.secaoMenu}>
        <Text style={estilos.tituloSecao}>Geral</Text>
        <View style={estilos.caixaMenu}>
          <ItemMenu
            icone={User}
            titulo="Dados da conta"
            onPress={() => Alert.alert('Aviso', 'Funcionalidade em desenvolvimento')}
          />
          <View style={estilos.divisor} />
          <ItemMenu
            icone={Settings}
            titulo="Configurações"
            onPress={() => Alert.alert('Aviso', 'Funcionalidade em desenvolvimento')}
          />
          <View style={estilos.divisor} />
          <ItemMenu
            icone={Bell}
            titulo="Notificações"
            onPress={() => Alert.alert('Aviso', 'Funcionalidade em desenvolvimento')}
          />
        </View>
      </View>

      <View style={estilos.secaoMenu}>
        <Text style={estilos.tituloSecao}>Empreendedor</Text>
        <View style={estilos.caixaMenu}>
          <ItemMenu
            icone={LayoutList}
            titulo="Meus anúncios"
            onPress={() => navigation.navigate('MeusAnuncios')}
          />
          <View style={estilos.divisor} />
          <ItemMenu
            icone={Store}
            titulo="Seja um anunciante"
            destaque={true}
            onPress={() => setModalVisivel(true)}
          />
        </View>
      </View>

      <View style={estilos.secaoMenu}>
        <Text style={estilos.tituloSecao}>Suporte</Text>
        <View style={estilos.caixaMenu}>
          <ItemMenu
            icone={HelpCircle}
            titulo="Ajuda e FAQs"
            onPress={() => Alert.alert('Aviso', 'Funcionalidade em desenvolvimento')}
          />
        </View>
      </View>

      <TouchableOpacity style={estilos.botaoSair}>
        <LogOut color="#c91a3a" size={20} style={estilos.iconeSair} />
        <Text style={estilos.textoSair}>Sair da Conta</Text>
      </TouchableOpacity>

      {/* Modal de Seleção de Tipo de Anunciante */}
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
                <Text style={estilos.modalOpcaoTitulo}>Estabelecimento Físico</Text>
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
                <Text style={estilos.modalOpcaoTitulo}>Online / Delivery / Serviços</Text>
                <Text style={estilos.modalOpcaoDescricao}>Atendo online, faço entregas ou vou até o cliente.</Text>
              </View>
              <ChevronRight color="#AAA7A5" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2825',
  },
  cabecalhoPerfil: {
    backgroundColor: '#403D3A',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#F7F2ED',
  },
  infoPerfil: {
    marginLeft: 16,
    flex: 1,
  },
  nomeUsuario: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DD6C34',
    marginBottom: 4,
  },
  telefoneUsuario: {
    fontSize: 14,
    color: '#AAA7A5',
  },
  secaoMenu: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tituloSecao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AAA7A5',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  caixaMenu: {
    backgroundColor: '#403D3A',
    borderRadius: 16,
  },
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#595551',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconeContainerDestaque: {
    backgroundColor: '#DD6C34',
  },
  textoItemMenu: {
    flex: 1,
    fontSize: 16,
    color: '#F7F2ED',
    fontWeight: '500',
  },
  textoItemMenuDestaque: {
    color: '#F7F2ED',
    fontWeight: '700',
  },
  divisor: {
    height: 1,
    backgroundColor: '#2B2825',
    marginLeft: 72,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
    paddingVertical: 16,
  },
  iconeSair: {
    marginRight: 8,
  },
  textoSair: {
    color: '#c91a3a',
    fontSize: 16,
    fontWeight: '600',
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

export default TelaConta;
