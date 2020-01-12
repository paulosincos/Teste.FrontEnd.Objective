# Teste de Front-End Objective

## Introdução

Implementação do teste proposto pela Objetive, consistindo em uma busca básica de personagens.

## Conteúdo do projeto

Conforme solicitado, nenhum framework ou API foi utilizada para o desenvolvimento. Apenas HTML, CSS e JavaScript nativos foram utilizados.

Para execução em tempo de desenvolvimento foi importado o [Express](https://expressjs.com/) e implementado um simples servidor de arquivos estáticos.

Para testes unitários foi utilizado [Jest](https://jestjs.io/). Para auxiliar o Jest, foi necessário usar o o módulo `@babel/plugin-transform-modules-commonjs` para transpilar o JavaScript para o Node, sendo este módulo usado apenas nos testes unitários.

### Implementações

Além dos requistos do teste, em geral o código possui/demonstra as seguintes features:

- WebComponents usando JS nativo (tags prefixadas com a inicial do nome do projeto, T);
- CSS: padrão BEM de nomeclatura, variáveis, animação, media queries, entre outros;
- Loader dinamico de CSS para WebComponents (implementado propriamente para este projeto);
- EventBus;
- Store simples (objeto singleton);
- Serviço de Http (encapsulamento do XHR);
- Entre outros.

### Estrutura do projeto

Pastas:

- devServer: servidor express/node para desenvolvimento;
- src: código fonte da aplicação com suas sub-pastas:
  - app: WebComponents em geral;
  - imagem: Imagens;
  - services: Serviços JavaScript comuns;
  - styles: CSSs gerais/globais.
- tests: teste unitários

## Instalação e execução

É necessário possuir o Node.js e o npm para instalação das dependências.

Para instalar as dependências, execute na pasta do projeto o comando do npm:
```
npm install
```

Após ter as dependencias baixadas, rode o projeto com:

```
npm start
```

Isso irá levantar o servidor Express na porta 8080 como pode ser notado no arquivo `/devServer/index.js`.

Pronto, só acessar http://localhost:8080 no navegador e será possível acessar a aplicação.

### Testes unitários

Os testes unitários podem ser executados com:

```
npm run test
```
