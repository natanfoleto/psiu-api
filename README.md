# Psiu API

## Requisitos

### Aluno

- [x] Cadastrar aluno
  - [x] Não deve ser possível cadastrar RA já cadastrado
  - [x] Gerar senha aleatória para primeiro acesso
  - [x] Criar hash para a senha aleatória gerada

- [x] Editar aluno
  - [x] Deve ser possível alterar o nome e data de nascimento do aluno
  - [x] Não deve ser possível atualizar um student inativo
  
- [] Atualizar senha
  - [] Não deve ser possível colocar uma senha fraca

- [x] Deletar aluno
  - [x] Deve utilizar soft delete
  - [x] Não deve ser possível deletar um student inativo
  
- [x] Buscar alunos
  - [] Criar páginação na busca de alunos

### Autenticação

- [] Autenticação com senha
  - [] Verificar se o RA existe
  - [] Criar um token de autenticação

### Post

- [] Criar post
- [] Editar post
- [] Deletar post
- [] Buscar posts
- [] Buscar posts por aluno

### ComentarioPost

- [] Criar comentário
- [] Editar comentário
- [] Deletar comentário

### ReacaoPost

- [] Criar reação
- [] Deletar reação

### ReacaoComentario

- [] Criar reação
- [] Deletar reação
