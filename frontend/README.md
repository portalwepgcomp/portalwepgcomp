## Contribuções:
- Todo merge request deve seguir a padronização em pt-BR para variáveis e métodos dentro do código.
- Todo código que for mexido e estiver em inglês deve ser alterado para pt-BR visando tornar maior parte - padroniada em pt-BR
- Certifique-se antes de criar um componente se ele já não existe, caso esteja em um local errado, podem - colocar na pasta correta. ex Components/Pages
- Evite criar interfaces e métodos desnecessários
- Evitar muitas camadas para realizar uma ação
- Certifique-se de que não houve atualiações em bibliotecas que possam quebrar o código
- Certifique-se de que seu código e variáveis estão os mais legíveis possível.
- Abra um Merge Request para a branch **development** e solicite aprovação das outras pessoas do grupo.
- Peça ao grupo que teste as funcionalidades implementadas e comunique o que há de alteração.
- Após ter o aprove, abra um Merge Request para a **master** e solicite aprovação
- Comunique aos mantenedores para que seja feito o deploy.


## Instalação

Instalação dos pacotes:

```bash
npm install
```

Para rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Vai abrir [http://localhost:3000](http://localhost:3000) no seu browser para acessar a aplicação.

## Qualidade
Utilizamos Jest para execução dos testes unitários, para rodar basta executar os comandos:

```bash
npm run test
// or
npm run tes:watch
```

O ESLint é utilizado para que possamos manter um padrão de desenvolvimento na escrita do código fonte, para obter um relatório basta executar:

```bash
npm run lint
```

## Estrutura de pastas

|- _-_tests__ - Onde se encontram os testes unitários do projeto
|- src - Pasta central do projeto, onde o código fonte principal é desenvolvido
|-----|- app - Configurações globais de exibição e roteamento das páginas
|-----|- components - Componentes genéricos e específicos utilizados pelas páginas
|-----|- pages - Páginas do projeto

## Configurações

**packacge.json** - Dependências do projeto
**jest.config.ts** - Teste unitário
**tsconfig.json** - Compilação do JSON
**next.config.mjs.ts** - Next
**sonar-project.properties** - Sonar

## Variáveis de ambiente

Devem ser inseridas igualmente nas variáveis de produção (**.env.production**), desenvolvimento (**.env.developmentß**) e local(**.env.local**).

## Ambientes

- Produção: https://portal-wepgcomp-client.vercel.app
- Desenvolvimento: https://portal-wepgcomp-client-development.vercel.app