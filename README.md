
# Sistema de Gerenciamento de Despesas

Este projeto permite registrar, consultar e excluir despesas de forma simples e eficiente. Ele utiliza o `localStorage` para persistência dos dados e foi desenvolvido com JavaScript e HTML.

## Funcionalidades

- **Cadastro de Despesas**: O usuário pode registrar despesas, especificando ano, mês, dia, tipo, descrição e valor.
- **Consulta de Despesas**: O sistema permite consultar as despesas cadastradas, com a possibilidade de filtrar por ano, mês, tipo e descrição.
- **Exclusão de Despesas**: As despesas podem ser excluídas de forma fácil com um botão de confirmação.
- **Validação de Dados**: Antes de salvar, o sistema valida se os dados inseridos são corretos (exemplo: ano válido, valor maior que 0, descrição mínima de 3 caracteres, etc.).
- **Formatação**: Os valores são formatados como moeda brasileira (BRL) e as datas são formatadas para o padrão `dd/mm/yyyy`.

## Tecnologias Utilizadas

- **JavaScript**: Lógica de negócios e manipulação de dados.
- **HTML**: Estruturação das páginas.
- **CSS (Bootstrap)**: Para o estilo e criação de modais.
- **localStorage**: Armazenamento local das despesas no navegador.

## Como Usar

### 1. Cadastro de Despesas
1. Preencha os campos do formulário (ano, mês, dia, tipo, descrição e valor).
2. Clique no botão "Cadastrar" para adicionar a despesa.
3. Após o cadastro, uma mensagem de sucesso ou erro será exibida.

### 2. Consulta de Despesas
1. Na página de consulta, você pode filtrar as despesas por ano, mês, tipo, descrição ou valor.
2. As despesas cadastradas serão listadas em uma tabela, e o total das despesas será exibido ao final da lista.

### 3. Exclusão de Despesas
1. Ao lado de cada despesa na tabela, há um botão de exclusão.
2. Após confirmar a exclusão, a despesa será removida da lista e do armazenamento.

## Estrutura do Projeto

```
/projeto
  ├── index.html        # Página principal para cadastro de despesas
  ├── consulta.html     # Página para consulta e exclusão de despesas
  ├── /styles/style.css # Arquivo de estilos
  ├── /scripts/app.js   # Arquivo com a lógica de cadastro, consulta e exclusão de despesas
  ├── assets/           # Imagens e outros recursos
  └── README.md         # Este arquivo
```

## Como Executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/Numbzin/Orcamento-Pessoal.git
   ```

2. Abra o arquivo `index.html` em seu navegador para acessar o sistema.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contribuindo

Se você quiser contribuir para este projeto, siga os seguintes passos:

1. Faça um fork deste repositório.
2. Crie uma branch para a sua feature (`git checkout -b feature/nomedafeature`).
3. Faça commit das suas alterações (`git commit -am 'Add new feature'`).
4. Envie para o repositório remoto (`git push origin feature/nomedafeature`).
5. Abra um Pull Request.

