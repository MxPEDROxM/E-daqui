import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Linking } from 'react-native';
import { Trash2, Edit, MapPin, Heart, X, Phone } from 'lucide-react-native';

const CartaoServico = ({ servico, aoExcluir, aoEditar, aoFavoritar, apenasVisualizacao }) => {
  const [modalVisivel, setModalVisivel] = useState(false);

  return (
    <>
      <TouchableOpacity style={estilos.cartao} onPress={() => setModalVisivel(true)} activeOpacity={0.9}>
        {servico.possuiLojaFisica === 1 && servico.uriImagem && (
          <Image source={{ uri: servico.uriImagem }} style={estilos.imagemCartao} />
        )}
        <View style={estilos.corpoCartao}>
          <View style={estilos.conteudo}>
            <Text style={estilos.nome}>{servico.nome}</Text>
            <View style={estilos.containerSelos}>
              <View style={[estilos.selo, estilos.seloTipoPrincipal]}>
                <Text style={estilos.textoTipoPrincipal}>
                  {servico.possuiLojaFisica === 1 ? 'Local Físico' : 'Delivery/Serviços'}
                </Text>
              </View>
              <View style={estilos.selo}>
                <Text style={estilos.categoria}>{servico.categoria}</Text>
              </View>
            </View>
            <Text style={estilos.descricao} numberOfLines={2}>
              {servico.descricao}
            </Text>
            {servico.possuiLojaFisica === 1 && (servico.rua || servico.bairro || servico.cidade) && (
              <View style={estilos.containerEndereco}>
                <MapPin color="#AAA7A5" size={14} style={estilos.iconeEndereco} />
                <Text style={estilos.textoEndereco} numberOfLines={1}>
                  {[servico.rua, servico.numero, servico.bairro, servico.cidade].filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
            <Text style={estilos.telefone}>📞 {servico.telefone}</Text>
          </View>
          <View style={estilos.acoes}>
            {apenasVisualizacao ? (
              <TouchableOpacity style={estilos.botaoIcone} onPress={() => aoFavoritar(servico)}>
                <Heart
                  color={servico.favorito === 1 ? "#DD6C34" : "#AAA7A5"}
                  fill={servico.favorito === 1 ? "#DD6C34" : "transparent"}
                  size={24}
                />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={[estilos.botaoIcone, { marginBottom: 80 }]} onPress={() => aoEditar(servico)}>
                  <Edit color="#DD6C34" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={estilos.botaoIcone} onPress={() => aoExcluir(servico.id)}>
                  <Trash2 color="#c91a3a" size={20} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={estilos.modalFundo}>
          <View style={estilos.modalConteudo}>
            <View style={estilos.modalCabecalho}>
              <Text style={estilos.modalTitulo}>Detalhes do Anúncio</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)} style={estilos.botaoFechar}>
                <X color="#AAA7A5" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.scrollModal}>
              {servico.possuiLojaFisica === 1 && servico.uriImagem && (
                <Image source={{ uri: servico.uriImagem }} style={estilos.imagemModal} />
              )}

              <Text style={estilos.nomeModal}>{servico.nome}</Text>

              <View style={estilos.containerSelosModal}>
                <View style={[estilos.selo, estilos.seloTipoPrincipal]}>
                  <Text style={estilos.textoTipoPrincipal}>
                    {servico.possuiLojaFisica === 1 ? 'Local Físico' : 'Delivery/Serviços'}
                  </Text>
                </View>
                <View style={estilos.selo}>
                  <Text style={estilos.categoria}>{servico.categoria}</Text>
                </View>
              </View>

              <Text style={estilos.descricaoModal}>{servico.descricao}</Text>

              {servico.possuiLojaFisica === 1 && (servico.rua || servico.bairro || servico.cidade) && (
                <View style={estilos.infoContainerModal}>
                  <MapPin color="#DD6C34" size={24} style={estilos.iconeModal} />
                  <Text style={estilos.textoInfoModal}>
                    {[servico.rua, servico.numero, servico.complemento].filter(Boolean).join(', ')}
                    {'\n'}
                    {[servico.bairro, servico.cidade].filter(Boolean).join(' - ')}
                    {servico.cep ? `\nCEP: ${servico.cep}` : ''}
                    {servico.referencia ? `\nRef: ${servico.referencia}` : ''}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={estilos.infoContainerModal}
                onPress={() => Linking.openURL(`tel:${servico.telefone.replace(/\\D/g, '')}`)}
                activeOpacity={0.7}
              >
                <Phone color="#DD6C34" size={24} style={estilos.iconeModal} />
                <Text style={estilos.textoTelefoneModal}>{servico.telefone}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: '#403D3A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagemCartao: {
    width: '100%',
    height: 150,
    backgroundColor: '#2B2825',
  },
  corpoCartao: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conteudo: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F7F2ED',
    marginBottom: 4,
  },
  containerSelos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selo: {
    backgroundColor: '#403D3A',
    borderColor: '#DD6C34',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  seloTipoPrincipal: {
    backgroundColor: '#DD6C34',
  },
  textoTipoPrincipal: {
    fontSize: 12,
    color: '#F7F2ED',
    fontWeight: '600',
  },
  categoria: {
    fontSize: 12,
    color: '#F7F2ED',
    fontWeight: '600',
  },
  descricao: {
    fontSize: 14,
    color: '#AAA7A5',
    marginBottom: 8,
  },
  telefone: {
    fontSize: 14,
    color: '#F7F2ED',
    fontWeight: '500',
  },
  acoes: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#2B2825',
    paddingLeft: 12,
  },
  botaoIcone: {
    padding: 8,
  },
  containerEndereco: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconeEndereco: {
    marginRight: 4,
  },
  textoEndereco: {
    fontSize: 12,
    color: '#AAA7A5',
    flex: 1,
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
    paddingTop: 24,
    maxHeight: '90%',
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F2ED',
  },
  botaoFechar: {
    padding: 4,
  },
  scrollModal: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  imagemModal: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#403D3A',
  },
  nomeModal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F2ED',
    marginBottom: 12,
  },
  containerSelosModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  descricaoModal: {
    fontSize: 16,
    color: '#AAA7A5',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoContainerModal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#403D3A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconeModal: {
    marginRight: 16,
    marginTop: 2,
  },
  textoInfoModal: {
    fontSize: 15,
    color: '#F7F2ED',
    flex: 1,
    lineHeight: 22,
  },
  textoTelefoneModal: {
    fontSize: 18,
    color: '#F7F2ED',
    fontWeight: 'bold',
    flex: 1,
  },
});

export default CartaoServico;
