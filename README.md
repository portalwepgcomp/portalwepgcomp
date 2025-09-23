# Sistema para divulgação, organização e gerenciamento do WEPGCOMP, evento anual de workshops dos alunos do PGCOMP-UFBA.

## Descrição

Atualmente este projeto é objeto de Trabalho de Conclusão de Curso e inciialmente foi desenvolvido como parte da disciplina **IC045/MATE85 - Tópicos em Sistemas de Informação e Web**, com o objetivo de criar o portal do **Workshop de Estudantes de Pós-Graduação em Computação (WEPGCOMP)**. O sistema permite a gestão de eventos acadêmicos, incluindo o cadastro de participantes, avaliação de apresentações, emissão de certificados, e organização de sessões.

Link deploy dev testes:
- Front: https://portalwepgcomp-front.vercel.app/
- Back: https://portalwepgcomp.onrender.com/

## Tecnologias Utilizadas

- **Back-end**: NodeJS com Nest
- **Front-end**: React/Next, <a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/" target="_blank"> Bootstrap 5.0</a>, SCSS
- **Banco de Dados**: PostgreSQL
- **Cloud**: Servidor do IC

## Metodologia de Desenvolvimento

A equipe está utilizando a metodologia **Kanban** com o auxílio da plataforma **Jira** para gerenciar as tarefas e acompanhar o progresso. O projeto segue um cronograma de entregas semanais.

- Link para o Jira: <a href="https://wepgcomp.atlassian.net/jira/software/projects/MFLP/boards/1" target="_blank">Jira Board</a>
- obs: Solicitar acesso aos mantenedores 

## Requisitos do Sistema

Os requisitos completos do sistema estão documentados no link abaixo:

- Link para os Requisitos: <a href="https://docs.google.com/document/d/199d8fJW4-9MX11Lvd4mdy-Vo0Pyx4ZHa53IuHKbWSn0/edit" target="_blank">Requisitos do Sistema</a>

## Arquitetura

Ambos desatualizados, a refazer.
~~- Diagrama de classe: <a href="https://cdn.discordapp.com/attachments/1293365993137115136/1296668731837120514/DER-WEPGCOMP.drawio.png?ex=6717bd9c&is=67166c1c&hm=9f53e124314a9a84b6f20d8cc89607a0221fe3bfc9968fb3381e2910bb5d6ca5&" target="_blank">Banco</a>~~
~~- Arquitetura do sistema: <a href="https://drive.google.com/file/d/10DCdoz47Gm00mArdla0npXITgNYR1KtJ/view" target="_blank">Arquitetura</a>~~

## Protótipo

O protótipo do sistema está sendo desenvolvido no **Figma**, onde todas as telas e fluxos do usuário estão disponíveis para visualização e feedback.

- Link para o Figma: <a href="https://www.figma.com/design/02Aslfd2qo4q6pjYxSkoYS/Portal-Web-PGCOMP-team-library?node-id=2365-175&node-type=canvas&t=NHVtl7ASVgSDVt2j-0" target="_blank">Figma Design</a>

## Documento de Instalação
- Link para o Documento: <a href="https://docs.google.com/document/d/1K5SnhxKYCfnvJq_T8P_5-zqXeQSpqMXPh2FfLYe_G0Y/edit?tab=t.0" target="_blank">Documento de Implantação/Instalação</a>
## Configuração do Projeto

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/usuario/projeto-wepgcomp.git
   cd projeto-wepgcomp
   ```
2. **Instalar Dependências**:

   ### Back-end

   Para rodar o projeto localmente, é necessário possuir uma instância de banco de dados (PostgreSQL). De modo a facilitar o desenvolvimento local, o projeto acompanha um arquivo docker-compose.yml, mas que tem o Docker como dependência. Após instalar a ferramenta (ou caso já a possua), construa os _containers_ executando o seguinte comando na pasta do back-end:

   ```bash
   docker-compose up -d
   ```

   As imagens serão baixadas e instaladas nas portas predefinidas. Na sequência, instale as bibliotecas utilizadas e crie uma cópia do arquivo de variáveis de ambiente através do ".env.example".

   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

   Obs.: As variáveis com dados sensíveis estarão sem valor atribuído, e deverão ser consultadas aos mantenedores atuais.

   ### Front-end

   ```
   cd frontend
   npm install
   ```
## Execução

### Back-end

```bash
cd backend
npm run start
```

### **Front-end**:

```bash
npm run dev
```

## Ambientes

### Testes
* **Front-End:** https://wepgcomp.netlify.app/
* **Backend:** https://wepgcomp-api.onrender.com/

### Produção
* **Front-End:** https://wepgcomp.app.ic.ufba.br/
* **Backend:** https://wepgcomp-api.app.ic.ufba.br
  
  
## Colaboradores

- **Alexandre Cury Lima** - [alexandre.cury@ufba.br](mailto:alexandre.cury@ufba.br)
- **Álvaro Souza Olivera** - [alvaro.oliveira@ufba.br](mailto:alvaro.oliveira@ufba.br)
- **Antonio de Sousa Cruz Neto** - [antoniocruznb@gmail.com](mailto:antoniocruznb@gmail.com)
- **Antonio Augusto Menezes de Oliveira** - [antonio.menezes@ufba.br](antonio.menezes@ufba.br)
- **Caio Nery Matos Santos** - [caionms@ufba.br](mailto:caionms@ufba.br)
- **Ernesto Santana dos Reis Filho** - [ernestosrf98@gmail.com](mailto:ernestosrf98@gmail.com)
- **Felipe Rezende** - [felipe.rezende@ufba.br](mailto:felipe.rezende@ufba.br)
- **Gabriel Borges Calheiros** - [gabrielcalheiros@ufba.br](mailto:gabrielcalheiros@ufba.br)
- **Henrique Torres Hatakeyama** - [henrique.torres@ufba.br](mailto:henrique.torres@ufba.br)
- **Iuri Rodrigues Santos** - [iurirs@ufba.br](mailto:iurirs@ufba.br)
- **Juliana Gomes Ribeiro** - [julianacrispina@gmail.com](mailto:julianacrispina@gmail.com)
- **Luiz Cláudio Dantas Cavalcanti** - [luizdantas.cavalcanti@gmail.com](mailto:luizdantas.cavalcanti@gmail.com)
- **Márcio dos Santos Junior** - [santosmarcio@ufba.br](mailto:santosmarcio@ufba.br)
- **Marcos Vinícius Queiroz** - [kieroth29@gmail.com](mailto:kieroth29@gmail.com)
- **Paloma Batista Calmon de Passos** - [palomabcp06@gmail.com](mailto:palomabcp06@gmail.com)
- **Silas Nunes** - [silasnunes105@gmail.com](mailto:silasnunes105@gmail.com)
- **Thiago Luiz Antunes Seixas** - [thiago.seixas@ufba.br](mailto:thiago.seixas@ufba.br)

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
