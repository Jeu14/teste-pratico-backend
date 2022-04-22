# Be mobile - Desafio Back-end
O teste de back-end da Be mobile consiste em estruturar uma API RESTful e um banco de dados ligado a esta API. Trate-se de um sistema que permite cadastrar usuários externamente e, ao realizarem login, poderão registrar clientes, produtos e vendas. O(a) candidato(a) poderá escolher desenvolver em Node.js (Adonis, Koa ou Express) ou PHP (Laravel).

## Banco de Dados
O banco de dados deve ser estruturado à escolha do(a) candidato(a), mas minimamente deverá conter o seguinte:
- usuários: email, senha;
- clientes: nome, cpf;
- endereço: todos os campos de endereço;
- telefones: cliente, número;
- produtos: colocar os dados necessários para um tipo de produto (livros), além de preço.
- vendas: cliente, produto, quantidade, preço unitário, preço total, data e hora.

## Rotas do Sistema
- cadastro de usuário do sistema (signup)
- login com JWT de usuário cadastrado (login)
- clientes:
    - listar todos os clientes cadastrados (index)
        - apenas dados principais devem vir aqui;
        - ordenar pelo id.
    - detalhar um(a) cliente e vendas a ele(a) (show)
        - trazer as vendas mais recentes primeiro;
        - possibilidade de filtrar as vendas por mês + ano.
    - adicionar um(a) cliente (store)
    - editar um(a) cliente (update)
    - excluir um(a) cliente e vendas a ele(a) (delete)
- produtos:
    - listar todos os produtos cadastrados (index)
        - apenas dados principais devem vir aqui;
        - ordenar alfabeticamente.
    - detalhar um produto (show)
    - criar um produto (store)
    - editar um produto (update)
    - exclusão lógica ("soft delete") de um produto (delete)
- vendas:
    - registrar venda de 1 produto a 1 cliente (store)

Obs: as rotas em clientes, produtos e vendas só podem ser acessadas por usuário logado.

## Requisitos
- estruturar o sistema observando o MVC (mas sem as views);
- deve usar mySQL no banco de dados;
- as respostas devem ser em JSON;
- pode usar recursos e bibliotecas que auxiliam na administração do banco de dados (Eloquent, Lucid, Knex, Bookshelf, etc.);
- documentar as instruções necessárias em um README (requisitos, como rodar, detalhamento de rotas);
- fazer um Pull Request para este repositório ao finalizar.

Obs: caso o(a) candidato(a) não consiga completar o teste até o prazo combinado com o avaliador, deve garantir que tudo que foi efetivamente feito esteja em pleno funcionamento. Relatar no README quais foram as dificuldades encontradas.

## Critérios de Avaliação
- lógica de programação;
- organização do projeto;
- legibilidade do código;
- validação necessária dos dados;
- forma adequada de utilização dos recursos;
- seguimento dos padrões especificados;
- clareza na documentação.
