# 🎓 Simulador de Prova Anhanguera (Prova Digital)

Sistema completo de simulados e avaliações online desenvolvido no padrão visual e funcional da **Anhanguera / Kroton (Prova Digital)**.

---

## 🌟 Principais Recursos

1. **Interface Fiel ao Portal Anhanguera**:
   - Tela inicial limpa e focada diretamente na questão ativa e suas alternativas.
   - Layout responsivo idêntico à imagem de referência da Prova Digital.
   - Opções A, B, C, D e E com radio button customizado e realce azul suave na alternativa selecionada.
   - Botões de navegação: `< ANTERIOR`, `PRÓXIMA >` e `FINALIZAR PROVA`.

2. **Card Lateral de Acompanhamento (Questões da Prova)**:
   - 12 badges circulares de questões divididos exatamente em 3 fileiras (1-5, 6-10, 11-12).
   - Indicadores visuais dinâmicos:
     - **Questão Ativa**: Círculo azul sólido preenchido com texto em branco (`4A`).
     - **Questão Respondida**: Círculo branco com borda e texto azul (`1A`, `2C`, `3D`...).
     - **Questão Pendente**: Círculo branco com borda cinza.
   - Barra de progresso azul horizontal em tempo real.
   - Contador de tempo de prova ativo com ícone de relógio.

3. **Feedback Completo de Acertos e Erros**:
   - Ao finalizar a prova, o sistema gera um relatório detalhado com:
     - Total de acertos (ex: 10 de 12).
     - Taxa de aproveitamento percentual (ex: 83%).
     - Tempo total de realização.
     - Status de aprovação pedagógica.
     - **Gabarito Comentado**: Comparação lado a lado entre a resposta escolhida pelo aluno e o gabarito oficial com justificativa explicativa para cada uma das 12 questões.

4. **Adicionar Várias Questões de Uma Só Vez (Importação em Lote)**:
   - **Upload de Arquivo .JSON**: Selecione ou arraste um arquivo `.json` com dezenas de questões.
   - **Colar Diretamente (JSON ou Texto Comum)**: Cole um bloco de JSON ou texto copiado de apostilas/PDFs (com formatos como `A) ... B) ... Gabarito: A`). O sistema analisa e extrai tudo automaticamente!
   - **Opções de Importação**: Escolha entre adicionar ao banco existente ou substituir, e se deseja iniciar o simulado imediatamente com as novas questões.
   - **Botões Rápidos**: Modelos prontos para testar (*Exemplo JSON* e *Exemplo Texto*) e botão para baixar o banco atual em `.JSON`.

5. **Barra Lateral de Gerenciamento (Drawer)**:
   - **Configurações**: Permite alterar o **Nome do Simulado** e a **Data Oficial**, além de sortear 12 novas questões do banco ou restaurar o modelo padrão da foto.
   - **Nova Questão**: Modo em lote (JSON / Colar) ou modo manual individual (1 por 1).
   - **Histórico dos Resolvidos**: Armazena todas as provas já feitas, com notas, datas e botão para rever o gabarito completo de qualquer tentativa anterior.

6. **Persistência Total no Navegador**:
   - Dados salvos via `localStorage` (questões adicionadas, histórico e configurações não se perdem ao recarregar a página).

7. **Atalhos de Teclado**:
   - Teclas `A`, `B`, `C`, `D`, `E` (ou `1`, `2`, `3`, `4`, `5`) para marcar alternativas.
   - Setas `←` e `→` para avançar ou voltar questões.
   - Tecla `Esc` para fechar modais e gavetas.

---

## 🧩 Banco de questões por temas e simulados configuráveis

- O banco aceita importação em lote de centenas ou milhares de questões, sem limite artificial de 1.000 registros no código.
- Cada questão pode informar sua categoria usando `category`, `categoria` ou `tema` no JSON.
- Categorias disponíveis: BNCC, LDB, Tipologia Textual, Gêneros Textuais, Português, Matemática, Legislação, Didática, Conhecimentos Gerais e Geral.
- Na configuração do simulado, é possível escolher de 1 a 100 questões por tentativa.
- É possível selecionar um ou mais temas; sem filtros marcados, o sorteio considera todo o banco.
- Questões antigas sem categoria são migradas automaticamente para uma categoria, quando existe classificação padrão; as demais ficam em **Geral**.
- A importação e a exportação JSON preservam a categoria da questão.
- A nota de aprovação usa o percentual de 60%, independentemente da quantidade de questões da prova.

Exemplo de questão JSON com categoria:

```json
{
  "statement": "Enunciado da questão...",
  "category": "BNCC",
  "options": [
    { "id": "A", "text": "Alternativa A" },
    { "id": "B", "text": "Alternativa B" },
    { "id": "C", "text": "Alternativa C" },
    { "id": "D", "text": "Alternativa D" },
    { "id": "E", "text": "Alternativa E" }
  ],
  "correctAnswer": "B",
  "explanation": "Comentário pedagógico."
}
```

**Persistência:** nesta versão, o banco continua salvo no `localStorage` do navegador. Para uso com bancos muito grandes ou sincronização entre dispositivos, a próxima evolução recomendada é migrar o armazenamento para IndexedDB ou um backend.

---

## 🚀 Como Executar

Basta abrir o arquivo **`index.html`** em qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox, Brave, Safari):

- Dê dois cliques no arquivo `index.html` na pasta `c:\Users\franc\Desktop\SIMULADOR`.
- Ou execute com um servidor local (Live Server no VS Code, `npx serve`, etc.).
