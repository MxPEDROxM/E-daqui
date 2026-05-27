import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus } from 'lucide-react-native';
import { banco } from '../database/db';

const TelaCadastro = ({ route, navigation }) => {
  const servico = route.params?.servico;
  const estaEditando = !!servico;

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [telefone, setTelefone] = useState('');


  const categoriasLoja = [
    'Alimentação e Consumo Local',
    'Beleza e Estética',
    'Saúde e Bem-Estar',
    'Comércio e Varejo',
    'Oficinas e Manutenção'
  ];

  const categoriasSemLoja = [
    'Delivery de Comida',
    'Serviços em Domicílio',
    'Cuidados e Apoio Pessoal',
    'Serviços Digitais e Criativos',
    'Aulas e Consultas Online',
    'E-commerce e Vendas Online'
  ];


  const [cidade, setCidade] = useState('Rio de Janeiro');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [referencia, setReferencia] = useState('');


  const [possuiLojaFisica, setPossuiLojaFisica] = useState(route.params?.tipo !== 'prestador');
  const [uriImagem, setUriImagem] = useState(null);



  useEffect(() => {
    if (estaEditando) {
      setNome(servico.nome);
      setCategoria(servico.categoria);
      setDescricao(servico.descricao);
      setTelefone(servico.telefone);
      if (servico.cidade) setCidade(servico.cidade);
      setBairro(servico.bairro || '');
      setCep(servico.cep || '');
      setRua(servico.rua || '');
      setNumero(servico.numero || '');
      setComplemento(servico.complemento || '');
      setReferencia(servico.referencia || '');
      setPossuiLojaFisica(servico.possuiLojaFisica === 1 || servico.possuiLojaFisica === undefined);
      setUriImagem(servico.uriImagem || null);
    }
  }, [servico]);

  const categoriasDisponiveis = possuiLojaFisica ? categoriasLoja : categoriasSemLoja;

  const escolherImagem = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setUriImagem(resultado.assets[0].uri);
    }
  };

  const salvarServico = () => {
    if (
      !nome.trim() ||
      !categoria.trim() ||
      !telefone.trim() ||
      !descricao.trim() ||
      !cep.trim() ||
      !cidade.trim() ||
      !bairro.trim() ||
      !rua.trim() ||
      !numero.trim()
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    try {
      if (estaEditando) {
        banco.runSync(
          'UPDATE servicos SET nome = ?, categoria = ?, descricao = ?, telefone = ?, cidade = ?, bairro = ?, cep = ?, rua = ?, numero = ?, complemento = ?, referencia = ?, possuiLojaFisica = ?, uriImagem = ?, subtipoPrestador = ? WHERE id = ?',
          [nome, categoria, descricao, telefone, cidade, bairro, cep, rua, numero, complemento, referencia, possuiLojaFisica ? 1 : 0, uriImagem, '', servico.id]
        );
      } else {
        banco.runSync(
          'INSERT INTO servicos (nome, categoria, descricao, telefone, cidade, bairro, cep, rua, numero, complemento, referencia, possuiLojaFisica, uriImagem, subtipoPrestador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [nome, categoria, descricao, telefone, cidade, bairro, cep, rua, numero, complemento, referencia, possuiLojaFisica ? 1 : 0, uriImagem, '']
        );
      }
      navigation.goBack();
    } catch (erro) {
      console.error('Erro ao salvar serviço', erro);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    }
  };

  const excluirServico = () => {
    Alert.alert(
      "Excluir Anúncio",
      `Tem certeza que deseja excluir o anúncio de "${nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            try {
              banco.runSync('DELETE FROM servicos WHERE id = ?', [servico.id]);
              navigation.goBack();
            } catch (erro) {
              console.error('Erro ao excluir serviço', erro);
              Alert.alert('Erro', 'Não foi possível excluir o anúncio.');
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.conteudoRolagem}>
        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Nome do Empreendedor/Negócio *</Text>
          <TextInput
            style={estilos.entrada}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: João Encanador, Maria Bolos"
            placeholderTextColor="#AAA7A5"
          />
        </View>

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Categoria do Negócio *</Text>
          {categoriasDisponiveis.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[estilos.opcaoSubtipo, categoria === cat && estilos.opcaoSubtipoAtiva]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[estilos.tituloSubtipo, categoria === cat && estilos.textoSubtipoAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Telefone/WhatsApp *</Text>
          <TextInput
            style={estilos.entrada}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            placeholderTextColor="#AAA7A5"
          />
        </View>

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Descrição dos Serviços *</Text>
          <TextInput
            style={[estilos.entrada, estilos.areaTexto]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Detalhe os serviços oferecidos..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#AAA7A5"
          />
        </View>


        <Text style={estilos.tituloSecao}>Localização</Text>

        {possuiLojaFisica && (
          <View style={estilos.grupoFormulario}>
            <Text style={estilos.rotulo}>Foto da Fachada do Estabelecimento</Text>
            {uriImagem ? (
              <View style={estilos.containerVisualizacaoImagem}>
                <Image source={{ uri: uriImagem }} style={estilos.visualizacaoImagem} />
                <TouchableOpacity style={estilos.botaoTrocarImagem} onPress={escolherImagem}>
                  <Text style={estilos.textoTrocarImagem}>Trocar Imagem</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={estilos.botaoSelecionarImagem} onPress={escolherImagem}>
                <ImagePlus color="#AAA7A5" size={32} />
                <Text style={estilos.textoSelecionarImagem}>Adicionar Foto</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>CEP *</Text>
          <TextInput
            style={estilos.entrada}
            value={cep}
            onChangeText={setCep}
            placeholder="00000-000"
            keyboardType="number-pad"
            placeholderTextColor="#AAA7A5"
          />
        </View>

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Cidade *</Text>
          <TextInput
            style={estilos.entrada}
            value={cidade}
            onChangeText={setCidade}
            placeholder="Rio de Janeiro"
            placeholderTextColor="#AAA7A5"
          />
        </View>

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Bairro *</Text>
          <TextInput
            style={estilos.entrada}
            value={bairro}
            onChangeText={setBairro}
            placeholder="Ex: Copacabana"
            placeholderTextColor="#AAA7A5"
          />
        </View>

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Rua / Logradouro *</Text>
          <TextInput
            style={estilos.entrada}
            value={rua}
            onChangeText={setRua}
            placeholder="Nome da rua"
            placeholderTextColor="#AAA7A5"
          />
        </View>

        <View style={estilos.linha}>
          <View style={[estilos.grupoFormulario, estilos.metadeLargura]}>
            <Text style={estilos.rotulo}>Número *</Text>
            <TextInput
              style={estilos.entrada}
              value={numero}
              onChangeText={setNumero}
              placeholder="123"
              placeholderTextColor="#AAA7A5"
            />
          </View>

          <View style={[estilos.grupoFormulario, estilos.metadeLargura]}>
            <Text style={estilos.rotulo}>Complemento</Text>
            <TextInput
              style={estilos.entrada}
              value={complemento}
              onChangeText={setComplemento}
              placeholder="Apto, Sala..."
              placeholderTextColor="#AAA7A5"
            />
          </View>
        </View>

        <View style={estilos.grupoFormulario}>
          <Text style={estilos.rotulo}>Referência</Text>
          <TextInput
            style={estilos.entrada}
            value={referencia}
            onChangeText={setReferencia}
            placeholder="Próximo a..."
            placeholderTextColor="#AAA7A5"
          />
        </View>

        <TouchableOpacity style={estilos.botaoSalvar} onPress={salvarServico}>
          <Text style={estilos.textoBotaoSalvar}>{estaEditando ? 'Atualizar' : 'Salvar'} Cadastro</Text>
        </TouchableOpacity>

        {estaEditando && (
          <TouchableOpacity style={estilos.botaoExcluir} onPress={excluirServico}>
            <Text style={estilos.textoBotaoExcluir}>Excluir Anúncio</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2825',
  },
  conteudoRolagem: {
    padding: 20,
  },
  grupoFormulario: {
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7F2ED',
    marginBottom: 8,
  },
  entrada: {
    backgroundColor: '#403D3A',
    borderWidth: 1,
    borderColor: '#2B2825',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F7F2ED',
  },
  areaTexto: {
    height: 100,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F2ED',
    marginTop: 10,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#403D3A',
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadeLargura: {
    width: '48%',
  },
  botaoSelecionarImagem: {
    borderWidth: 2,
    borderColor: '#403D3A',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#403D3A',
  },
  textoSelecionarImagem: {
    marginTop: 8,
    color: '#AAA7A5',
    fontSize: 14,
    fontWeight: '500',
  },
  containerVisualizacaoImagem: {
    alignItems: 'center',
  },
  visualizacaoImagem: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  botaoTrocarImagem: {
    backgroundColor: '#595551',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textoTrocarImagem: {
    color: '#F7F2ED',
    fontWeight: '600',
  },
  botaoSalvar: {
    backgroundColor: '#DD6C34',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  textoBotaoSalvar: {
    color: '#F7F2ED',
    fontSize: 16,
    fontWeight: 'bold',
  },
  opcaoSubtipo: {
    borderWidth: 1,
    borderColor: '#403D3A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#403D3A',
  },
  opcaoSubtipoAtiva: {
    borderColor: '#F7F2ED',
    backgroundColor: '#DD6C34',
    borderWidth: 2,
  },
  tituloSubtipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F7F2ED',
    marginBottom: 4,
  },
  textoSubtipoAtivo: {
    color: '#F7F2ED',
  },
  descricaoSubtipo: {
    fontSize: 13,
    color: '#F7F2ED',
  },
  botaoExcluir: {
    backgroundColor: '#2B2825',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#DD6C34',
  },
  textoBotaoExcluir: {
    color: '#DD6C34',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TelaCadastro;
