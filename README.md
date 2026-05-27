# É Daqui - Guia de Apoio Local

## Desenvolvedor
Nome: Pedro Augusto Moraes Fagundes Pereira

## O Problema Social Escolhido
O projeto foca no fortalecimento do comércio de bairro e no apoio direto a pequenos empreendedores e prestadores de serviços autônomos (como encanadores, eletricistas, confeiteiros caseiros, manicures, etc.). 

Muitas vezes, esses profissionais não têm visibilidade na internet ou não possuem recursos financeiros para publicidade paga em grandes redes. Este aplicativo atua como um guia digital gratuito e acessível, permitindo que os moradores encontrem serviços de confiança em seu próprio bairro. O objetivo central é promover o desenvolvimento econômico local, a geração de renda e a valorização do trabalho dentro da comunidade.

## Requisitos Técnicos e Funcionalidades
O aplicativo foi estruturado para cumprir todas as exigências técnicas da avaliação de desenvolvimento prático:

- Framework: Desenvolvido inteiramente em React Native utilizando Expo, focado em uma solução móvel híbrida.
- Navegação: Implementada com React Navigation, fazendo uso de estruturas de Abas (Bottom Tabs) para as principais telas e Pilhas (Stack) para os fluxos de cadastro e edição.
- Persistência de Dados: Utilizado o SQLite (expo-sqlite) para armazenamento de dados offline, priorizando o rápido carregamento e a privacidade sem dependência de conexão com a internet ou hospedagem em nuvem.
- Operações CRUD Completas:
  - Create: Inclusão de novos profissionais através do formulário de cadastro.
  - Read: Listagem dinâmica de profissionais na aba Catálogo, contando com filtros avançados e barra de pesquisa textual.
  - Update: Função de atualização integral dos dados de um prestador através do espelho do cadastro.
  - Delete: Exclusão permanente de registros, acionável diretamente da lista de "Meus Anúncios" ou dentro da tela de edição.
- Interface (UI/UX): Arquitetura baseada em componentização e layouts responsivos garantindo legibilidade e uma boa experiência de usuário em dispositivos móveis variados.

## Arquitetura do Projeto
O código-fonte do projeto está estruturado de forma modular para facilitar a manutenção e escalabilidade. A estrutura de pastas segue o seguinte padrão:

- / (Raiz): Contém o arquivo App.js (gerenciador global de rotas) e arquivos de configuração (app.json, package.json).
- /src
  - /components: Armazena componentes visuais reutilizáveis em várias telas (ex: CartaoServico.js).
  - /database: Contém o arquivo db.js, responsável pela conexão com o banco SQLite e execução de queries DDL.
  - /screens: Contém todas as telas completas que compõem as rotas de navegação (TelaCatalogo, TelaCadastro, TelaConta, TelaMapa e TelaMeusAnuncios).

## Telas Principais do Aplicativo
- Catálogo: Visualizar serviços, buscar por texto (Barra de busca), filtrar (Botão de Filtros), favoritar anúncio (Ícone de Coração) e expandir detalhes do anunciante (Clicar no card).
- Meus Anúncios: Listar próprios serviços, Editar dados (Botão Lápis) e Excluir registro (Botão Lixeira).
- Conta: Iniciar cadastro de um novo anúncio (Botão "Seja um anunciante").
- Mapa: Espaço reservado para futura implementação de recursos de geolocalização.

## Instruções Básicas para Executar o Projeto

### Pré-requisitos
- Node.js instalado no computador.
- Aplicativo "Expo Go" instalado no dispositivo móvel (Android ou iOS).

### Passo a Passo
1. Abra o terminal de linha de comando na pasta raiz do projeto.
2. Instale as dependências executando o seguinte comando:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Expo executando:
   ```bash
   npm run start
   ```
4. Ao iniciar o servidor, um QR Code será exibido no terminal.
5. Escaneie este QR Code com o aplicativo Expo Go no seu celular. 
   - Nota importante: Para testes em rede local, o celular e o computador devem estar conectados à mesma rede Wi-Fi.
6. Após o carregamento dos pacotes, o aplicativo estará funcional na tela do celular, permitindo o teste de todas as rotas e funções de banco de dados nativas.
