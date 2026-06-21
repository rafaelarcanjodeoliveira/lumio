# Documentação Inicial — App Web de Controle Financeiro Pessoal

## 1. Visão Geral

O objetivo do projeto é criar um aplicativo web para controle financeiro pessoal, permitindo registrar entradas, saídas, valores diários, lançamentos provisionados e visualizar o resumo mensal das finanças.

O sistema deve ajudar o usuário a responder perguntas como:

* Quanto entrou no mês?
* Quanto já saiu?
* Quanto ainda está provisionado para sair?
* Quanto tenho disponível hoje?
* Qual será meu saldo previsto até o fim do mês?
* Quais categorias mais consomem meu dinheiro?
* Tenho dias específicos com maior concentração de gastos?

## 2. Objetivo do Produto

Criar uma plataforma simples, rápida e visual para controle financeiro pessoal, com foco em:

* Registro manual de receitas e despesas.
* Controle diário de movimentações.
* Separação entre valores realizados e provisionados.
* Visão mensal consolidada.
* Previsão de saldo futuro.
* Organização por categoria, conta e forma de pagamento.

## 3. Público-Alvo

Inicialmente, o app será usado pelo próprio criador, mas poderá futuramente ser adaptado para outras pessoas que desejam controlar finanças pessoais de forma simples, sem depender de planilhas.

## 4. Principais Funcionalidades

### 4.1 Cadastro de Lançamentos

O usuário poderá cadastrar movimentações financeiras com os seguintes campos:

* Tipo: entrada ou saída.
* Status: realizado ou provisionado.
* Data do lançamento.
* Data de vencimento, quando aplicável.
* Valor.
* Descrição.
* Categoria.
* Conta ou carteira.
* Forma de pagamento.
* Observações.
* Recorrência, quando aplicável.

Exemplos:

* Salário.
* Freelance.
* Aluguel.
* Financiamento.
* Cartão de crédito.
* Mercado.
* Combustível.
* Internet.
* Condomínio.
* Investimentos.
* Gastos diários.

### 4.2 Controle de Entradas

O sistema deve permitir registrar todas as receitas do mês, como:

* Salário.
* Serviços extras.
* Reembolso.
* Rendimentos.
* Venda de itens.
* Outros recebimentos.

Cada entrada poderá ser marcada como:

* Recebida.
* A receber.
* Recorrente.

### 4.3 Controle de Saídas

O sistema deve permitir registrar despesas realizadas e futuras.

As saídas podem ser:

* Fixas.
* Variáveis.
* Parceladas.
* Recorrentes.
* Provisionadas.

Exemplos:

* Aluguel.
* Financiamento.
* Cartão.
* Energia.
* Internet.
* Mercado.
* Lazer.
* Saúde.
* Transporte.
* Assinaturas.

### 4.4 Valores Diários

O sistema deve ter uma tela ou seção para visualização diária, mostrando:

* Total de entradas do dia.
* Total de saídas do dia.
* Saldo do dia.
* Lançamentos realizados.
* Lançamentos provisionados.
* Saldo acumulado até aquele dia.

Essa visão deve ajudar a entender o comportamento financeiro ao longo do mês.

### 4.5 Valores Provisionados

O sistema deve permitir cadastrar despesas ou receitas futuras que ainda não aconteceram, mas que já são previstas.

Exemplos:

* Conta de luz que vence no dia 20.
* Parcela do financiamento.
* Cartão de crédito.
* Pagamento de fornecedor.
* Serviço que será recebido no fim do mês.

Os provisionados devem impactar a visão de saldo previsto, mas não o saldo realizado.

### 4.6 Visão Mensal

A visão mensal será a principal tela do sistema.

Ela deve exibir:

* Total de entradas realizadas.
* Total de entradas provisionadas.
* Total de saídas realizadas.
* Total de saídas provisionadas.
* Saldo atual.
* Saldo previsto para o fim do mês.
* Total disponível.
* Gráfico por categoria.
* Lista de dias com maior gasto.
* Comparativo entre realizado e previsto.

Exemplo:

Entrada realizada: R$ 15.000
Entrada provisionada: R$ 5.000
Saída realizada: R$ 8.000
Saída provisionada: R$ 4.000
Saldo atual: R$ 7.000
Saldo previsto final: R$ 8.000

## 5. Telas do Sistema

### 5.1 Dashboard

Tela inicial com resumo financeiro.

Componentes:

* Card de saldo atual.
* Card de saldo previsto.
* Card de entradas do mês.
* Card de saídas do mês.
* Card de provisionados.
* Gráfico de gastos por categoria.
* Gráfico de evolução diária.
* Lista dos próximos vencimentos.
* Lista dos últimos lançamentos.

### 5.2 Lançamentos

Tela para listar, filtrar, editar e excluir movimentações.

Filtros:

* Mês.
* Ano.
* Tipo.
* Status.
* Categoria.
* Conta.
* Forma de pagamento.
* Texto livre.

Ações:

* Novo lançamento.
* Editar lançamento.
* Excluir lançamento.
* Marcar como realizado.
* Duplicar lançamento.
* Criar recorrência.

### 5.3 Novo Lançamento

Formulário para cadastrar entrada ou saída.

Campos principais:

* Tipo.
* Status.
* Data.
* Valor.
* Descrição.
* Categoria.
* Conta.
* Forma de pagamento.
* Observação.
* Recorrente.
* Quantidade de parcelas, se for parcelado.

### 5.4 Calendário Financeiro

Tela mensal em formato de calendário.

Cada dia deve mostrar:

* Entradas.
* Saídas.
* Saldo do dia.
* Provisionados.
* Vencimentos.

### 5.5 Categorias

Tela para gerenciar categorias.

Categorias iniciais sugeridas:

Entradas:

* Salário.
* Freelance.
* Reembolso.
* Investimentos.
* Outros.

Saídas:

* Moradia.
* Alimentação.
* Transporte.
* Saúde.
* Educação.
* Lazer.
* Assinaturas.
* Cartão de crédito.
* Financiamento.
* Impostos.
* Outros.

### 5.6 Contas

Tela para controlar contas ou carteiras.

Exemplos:

* Banco principal.
* Conta PJ.
* Carteira.
* Cartão de crédito.
* Investimentos.

### 5.7 Relatórios

Tela com análises financeiras.

Relatórios sugeridos:

* Gastos por categoria.
* Evolução mensal.
* Comparativo entre meses.
* Realizado vs provisionado.
* Entradas por fonte.
* Saídas por forma de pagamento.
* Saldo previsto futuro.

## 6. Regras de Negócio

### 6.1 Saldo Atual

O saldo atual deve considerar apenas lançamentos realizados.

Fórmula:

Saldo atual = entradas realizadas - saídas realizadas

### 6.2 Saldo Previsto

O saldo previsto deve considerar realizados e provisionados.

Fórmula:

Saldo previsto = entradas realizadas + entradas provisionadas - saídas realizadas - saídas provisionadas

### 6.3 Lançamento Realizado

Um lançamento realizado representa uma movimentação que já aconteceu.

Exemplos:

* Salário recebido.
* Compra feita.
* Conta paga.

### 6.4 Lançamento Provisionado

Um lançamento provisionado representa uma movimentação prevista.

Exemplos:

* Conta que ainda vai vencer.
* Receita que ainda será recebida.
* Despesa estimada.

### 6.5 Recorrência

O sistema deve permitir criar lançamentos recorrentes.

Exemplos:

* Todo mês no dia 5: aluguel.
* Todo mês no dia 10: salário.
* Todo mês no dia 15: internet.

### 6.6 Parcelamento

O sistema deve permitir cadastrar despesas parceladas.

Exemplo:

Compra de R$ 1.200 em 12x.

O sistema deve gerar 12 lançamentos de R$ 100, cada um em seu respectivo mês.

## 7. Modelo de Dados Inicial

### 7.1 Usuário

Campos:

* id
* nome
* email
* senha criptografada
* data de criação

### 7.2 Lançamento Financeiro

Campos:

* id
* user_id
* tipo: entrada ou saída
* status: realizado ou provisionado
* descrição
* valor
* data
* data_vencimento
* categoria_id
* conta_id
* forma_pagamento
* observação
* recorrente
* parcela_atual
* total_parcelas
* created_at
* updated_at

### 7.3 Categoria

Campos:

* id
* user_id
* nome
* tipo: entrada, saída ou ambos
* cor
* ativo

### 7.4 Conta

Campos:

* id
* user_id
* nome
* tipo
* saldo_inicial
* ativo

## 8. Stack Técnica Recomendada

### Front-end

* Next.js
* TypeScript
* Tailwind CSS
* React Hook Form
* Zod
* Recharts

### Back-end

* Next.js API Routes ou Server Actions
* Supabase
* PostgreSQL
* Prisma, opcional

### Autenticação

* Supabase Auth

### Banco de Dados

* PostgreSQL via Supabase

### Deploy

* Vercel para aplicação web
* Supabase para banco e autenticação

## 9. MVP — Primeira Versão

A primeira versão deve ser simples e funcional.

Funcionalidades do MVP:

* Login.
* Cadastro de entradas.
* Cadastro de saídas.
* Status realizado/provisionado.
* Categorias.
* Visão mensal.
* Visão diária.
* Saldo atual.
* Saldo previsto.
* Listagem e filtros.
* Edição e exclusão de lançamentos.

Não incluir inicialmente:

* Integração bancária.
* Importação automática de extrato.
* Open Finance.
* Multiusuário.
* Aplicativo mobile.
* Inteligência artificial interna.

## 10. Evoluções Futuras

Após o MVP, o sistema poderá evoluir com:

* Importação de extrato CSV.
* Leitura automática de PDF de cartão.
* Integração com bancos.
* Alertas de vencimento.
* Metas financeiras.
* Orçamento mensal por categoria.
* Comparativo mês a mês.
* Dashboard anual.
* Previsão de fluxo de caixa.
* IA para classificar despesas automaticamente.
* App mobile.
* Exportação para Excel.
* Backup dos dados.

## 11. Sugestão de Layout

O app deve ter uma interface limpa, parecida com dashboard financeiro.

Menu lateral:

* Dashboard
* Lançamentos
* Calendário
* Categorias
* Contas
* Relatórios
* Configurações

Cards principais:

* Saldo atual
* Saldo previsto
* Entradas
* Saídas
* Provisionados

Cores sugeridas:

* Verde para entradas.
* Vermelho para saídas.
* Azul para saldo.
* Amarelo ou laranja para provisionados.
* Cinza para informações neutras.

## 12. Critérios de Aceite

O sistema será considerado funcional quando o usuário conseguir:

* Fazer login.
* Cadastrar uma entrada.
* Cadastrar uma saída.
* Marcar um lançamento como realizado ou provisionado.
* Visualizar o resumo mensal.
* Visualizar o saldo atual.
* Visualizar o saldo previsto.
* Consultar lançamentos por dia.
* Filtrar lançamentos por mês.
* Editar e excluir lançamentos.

## 13. Prompt Sugerido para IA Desenvolver o Projeto

Crie um app web de controle financeiro pessoal usando Next.js, TypeScript, Tailwind CSS e Supabase.

O sistema deve permitir ao usuário controlar entradas, saídas, valores diários, lançamentos provisionados e visão mensal.

Funcionalidades obrigatórias:

1. Autenticação de usuário.
2. Cadastro de lançamentos financeiros.
3. Tipo do lançamento: entrada ou saída.
4. Status do lançamento: realizado ou provisionado.
5. Cadastro de categorias.
6. Cadastro de contas.
7. Dashboard mensal com:

   * total de entradas realizadas;
   * total de saídas realizadas;
   * total provisionado;
   * saldo atual;
   * saldo previsto;
   * gráfico por categoria;
   * evolução diária.
8. Tela de lançamentos com filtros.
9. Tela de calendário financeiro mensal.
10. Permitir editar, excluir e marcar lançamentos como realizados.

Use boas práticas de organização de projeto, componentes reutilizáveis, validação de formulário com Zod e layout responsivo.

Crie também o schema do banco de dados no Supabase/PostgreSQL e explique como rodar o projeto localmente.
