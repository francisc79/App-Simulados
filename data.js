// Banco de Questões Padrão (Estilo Prova Anhanguera / Kroton)
const DEFAULT_QUESTIONS = [
  {
    id: "q-1",
    statement: `Na comunicação empresarial e acadêmica, a clareza e a concisão são elementos fundamentais. Considerando as funções da linguagem descritas por Roman Jakobson, avalie as afirmativas a seguir:

I) A função referencial ou denotativa tem como foco o contexto e a transmissão objetiva de informações.
II) A função emotiva ou expressiva enfatiza o emissor e suas opiniões ou sentimentos subjetivos.
III) A função conativa ou apelativa centra-se no canal de comunicação, testando seu funcionamento físico.

Está correto o que se afirma em:`,
    options: [
      { id: "A", text: "apenas I e II." },
      { id: "B", text: "apenas III." },
      { id: "C", text: "apenas I e III." },
      { id: "D", text: "apenas II e III." },
      { id: "E", text: "I, II e III." }
    ],
    correctAnswer: "A",
    explanation: "As afirmativas I e II estão corretas. A afirmativa III está incorreta pois a função centrada no canal físico é a função fática, enquanto a função conativa ou apelativa tem foco no receptor (persuasão)."
  },
  {
    id: "q-2",
    statement: `O planejamento estratégico organizacional busca alinhar recursos internos às oportunidades e ameaças do ambiente externo. A análise SWOT (FOFA) é amplamente empregada nesse diagnóstico.

Sobre a matriz SWOT, é correto afirmar que:`,
    options: [
      { id: "A", text: "forças e fraquezas são variáveis controláveis do ambiente interno da organização." },
      { id: "B", text: "ameaças e oportunidades pertencem exclusivamente ao microambiente interno da firma." },
      { id: "C", text: "as fraquezas representam fatores externos incontroláveis pelos gestores." },
      { id: "D", text: "as oportunidades devem ser combatidas para evitar riscos operacionais." },
      { id: "E", text: "as forças internas dependem prioritariamente das oscilações do mercado concorrente." }
    ],
    correctAnswer: "A",
    explanation: "Na Matriz SWOT, Forças (Strengths) e Fraquezas (Weaknesses) referem-se aos fatores internos (controláveis), enquanto Oportunidades (Opportunities) e Ameaças (Threats) vêm do ambiente externo (não controláveis)."
  },
  {
    id: "q-3",
    statement: `Considere os princípios da lógica proposicional e a seguinte afirmação:
"Se chover hoje à tarde, então a reunião será realizada de forma remota."

A negação lógica dessa proposição condicional (p → q) é dada por:`,
    options: [
      { id: "A", text: "Se não chover hoje à tarde, a reunião não será remota." },
      { id: "B", text: "Hoje à tarde chove e a reunião não é realizada de forma remota." },
      { id: "C", text: "Hoje não chove ou a reunião é realizada de forma remota." },
      { id: "D", text: "Se a reunião for remota, então choveu hoje à tarde." },
      { id: "E", text: "A reunião não será remota se e somente se não chover." }
    ],
    correctAnswer: "B",
    explanation: "A negação de uma proposição condicional p → q é dada pela equivalência ~(p → q) ≡ p ∧ ~q (mantém a primeira E nega a segunda): 'Hoje chove e a reunião não é remota'."
  },
  {
    id: "q-4",
    statement: `Esse fenômeno se chama homonímia e ele é comum na língua portuguesa. Homonímia é o termo para designar palavras com os mesmos fonemas, ou escrita, e que apresentam significados diferentes.
https://escolaeducacao.com.br/palavras-homonimas/
Pensando nas especificidades das palavras homônimas, avalie as afirmativas a seguir:
I) Homônimos homógrafos são aqueles que possuem a mesma escrita, mas significado e pronúncia diferentes, como por exemplo a palavra almoço.
II) Homônimos homófonos são aqueles que possuem grafia e pronúncia igual e significados diferentes, como o caso da palavra acento.
III) Homônimos perfeitos são aqueles que possuem a mesma grafia e o mesmo som, com sentidos diferentes, como a palavra cedo (verbo e advérbio).
Está correto o que se afirma em:`,
    options: [
      { id: "A", text: "apenas I e III." },
      { id: "B", text: "apenas III." },
      { id: "C", text: "apenas II e III." },
      { id: "D", text: "apenas I e II." },
      { id: "E", text: "apenas I." }
    ],
    correctAnswer: "A",
    explanation: "I) Correto: 'almoço' (substantivo) e 'almoço' (verbo) têm a mesma grafia, mas pronúncias diferentes (homógrafos). II) Incorreto: homófonos possuem mesmo som, mas grafias diferentes (ex: acento / assento). III) Correto: 'cedo' possui mesma grafia e mesma pronúncia (homônimos perfeitos). Portanto, apenas I e III estão corretas."
  },
  {
    id: "q-5",
    statement: `No desenvolvimento de sistemas e bancos de dados relacionais, o conceito de integridade referencial garante a consistência das relações entre tabelas.

Assinale a alternativa que descreve corretamente a Chave Estrangeira (Foreign Key):`,
    options: [
      { id: "A", text: "É uma coluna que impede valores duplicados na mesma tabela sem necessidade de índice." },
      { id: "B", text: "É um campo que armazena senhas criptografadas em serviços externos de nuvem." },
      { id: "C", text: "É um campo que estabelece um vínculo referenciando a chave primária de outra tabela." },
      { id: "D", text: "É um identificador numérico gerado exclusivamente em conexões de rede internacionais." },
      { id: "E", text: "É a tabela mestre onde todos os registros são duplicados para fins de auditoria." }
    ],
    correctAnswer: "C",
    explanation: "A Chave Estrangeira (Foreign Key) é um campo ou conjunto de campos em uma tabela que referencia a Chave Primária de outra tabela, garantindo o relacionamento e a integridade referencial."
  },
  {
    id: "q-6",
    statement: `A ética profissional estabelece os parâmetros e condutas esperadas no exercício de qualquer profissão. Acerca da diferença entre Moral e Ética, assinale a opção correta:`,
    options: [
      { id: "A", text: "A moral é a reflexão teórica e universal, enquanto a ética é o conjunto de hábitos temporários de um povo." },
      { id: "B", text: "A ética consiste na reflexão filosófica e crítica sobre os princípios morais e comportamentais." },
      { id: "C", text: "Não existe qualquer distinção acadêmica entre os conceitos de ética e moral." },
      { id: "D", text: "A ética refere-se exclusivamente às leis jurídicas positivadas no código penal." },
      { id: "E", text: "A moral é imutável ao longo da história e em todas as culturas do mundo." }
    ],
    correctAnswer: "B",
    explanation: "Enquanto a moral diz respeito aos costumes, hábitos e regras práticas de conduta de uma sociedade, a ética é o estudo e reflexão filosófica/crítica sobre a validade desses princípios morais."
  },
  {
    id: "q-7",
    statement: `Em estatística descritiva, as medidas de tendência central são utilizadas para resumir um conjunto de dados por meio de um único valor representativo.

Considere a amostra de idades dos alunos: [18, 19, 19, 20, 22, 24, 25, 29].
O valor da Mediana dessa amostra é:`,
    options: [
      { id: "A", text: "19,0" },
      { id: "B", text: "20,0" },
      { id: "C", text: "21,0" },
      { id: "D", text: "22,0" },
      { id: "E", text: "22,5" }
    ],
    correctAnswer: "C",
    explanation: "A amostra já ordenada possui 8 elementos (número par). A mediana é a média aritmética dos dois termos centrais: 4º termo (20) e 5º termo (22). Logo, (20 + 22) / 2 = 42 / 2 = 21,0."
  },
  {
    id: "q-8",
    statement: `No contexto da gestão ambiental e desenvolvimento sustentável, o conceito dos 5Rs representa práticas voltadas à minimização do impacto dos resíduos sólidos.

Qual das alternativas abaixo NÃO faz parte dos 5Rs fundamentais?`,
    options: [
      { id: "A", text: "Repensar" },
      { id: "B", text: "Recusar" },
      { id: "C", text: "Reduzir" },
      { id: "D", text: "Rentabilizar" },
      { id: "E", text: "Reciclar" }
    ],
    correctAnswer: "D",
    explanation: "Os 5Rs da sustentabilidade são: Repensar, Recusar, Reduzir, Reutilizar e Reciclar. 'Rentabilizar' não integra essa metodologia clássica de gestão de resíduos."
  },
  {
    id: "q-9",
    statement: `Segundo a Constituição da República Federativa do Brasil de 1988, são direitos sociais fundamentais assegurados a todos os cidadãos, EXCETO:`,
    options: [
      { id: "A", text: "Educação, saúde e trabalho." },
      { id: "B", text: "Direito de posse ilimitada de terras improdutivas." },
      { id: "C", text: "Moradia, transporte e lazer." },
      { id: "D", text: "Segurança, previdência social e proteção à maternidade." },
      { id: "E", text: "Assistência aos desamparados." }
    ],
    correctAnswer: "B",
    explanation: "O art. 6º da CF/88 lista como direitos sociais a educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e à infância, e assistência aos desamparados. A posse ilimitada de terras improdutivas não é direito social e viola a função social da propriedade."
  },
  {
    id: "q-10",
    statement: `Na arquitetura de computadores e sistemas operacionais, a memória cache desempenha papel crucial no desempenho do processador.

A principal função da memória cache é:`,
    options: [
      { id: "A", text: "reduzir o tempo médio de acesso a dados armazenados na memória principal (RAM)." },
      { id: "B", text: "armazenar permanentemente o sistema operacional quando o computador está desligado." },
      { id: "C", text: "substituir integralmente a memória secundária em discos rígidos e SSDs." },
      { id: "D", text: "processar gráficos 3D sem necessidade de placa de vídeo dedicada." },
      { id: "E", text: "bloquear ataques de malwares antes que atinjam os registradores da CPU." }
    ],
    correctAnswer: "A",
    explanation: "A memória cache é uma memória ultrarrápida localizada próxima ao núcleo do processador que guarda cópias de dados frequentemente utilizados para acelerar o acesso em comparação com a RAM mais lenta."
  },
  {
    id: "q-11",
    statement: `O ciclo PDCA (Plan, Do, Check, Act) é uma das metodologias mais consagradas de melhoria contínua da qualidade e gestão de processos.

A etapa "CHECK" (Verificar/Checar) corresponde a:`,
    options: [
      { id: "A", text: "monitorar e avaliar os resultados obtidos confrontando-os com as metas planejadas." },
      { id: "B", text: "definir o orçamento financeiro inicial do novo projeto." },
      { id: "C", text: "executar o treinamento da equipe operacional em campo." },
      { id: "D", text: "padronizar o processo definitivo após validação das mudanças." },
      { id: "E", text: "cancelar o plano estratégico em caso de desvios orçamentários." }
    ],
    correctAnswer: "A",
    explanation: "No ciclo PDCA: Plan = planejar metas e métodos; Do = executar o plano; Check = verificar/avaliar os dados e comparar resultados com o planejado; Act = agir corretivamente e padronizar."
  },
  {
    id: "q-12",
    statement: `Em relação à concordância verbal de acordo com a norma-padrão da língua portuguesa, assinale a opção em que a frase está inteiramente CORRETA:`,
    options: [
      { id: "A", text: "Fazem muitos anos que não visito minha cidade natal." },
      { id: "B", text: "Houveram muitos incidentes graves durante a palestra matutina." },
      { id: "C", text: "Devem fazer cerca de duas horas que iniciamos o simulado oficial." },
      { id: "D", text: "Deve haver cerca de dois meses que o edital foi publicado pelo comitê." },
      { id: "E", text: "Aluga-se salas comerciais no centro empresarial da capital." }
    ],
    correctAnswer: "D",
    explanation: "O verbo 'haver' no sentido de tempo transcorrido é impessoal (fica no singular) e contamina seu verbo auxiliar ('deve haver'). Em A o correto é 'Faz muitos anos'; em B 'Houve muitos incidentes'; em C 'Deve fazer cerca de duas horas'; e em E 'Alugam-se salas'."
  },
  {
    id: "q-13",
    statement: `No contexto de Redes de Computadores, o protocolo responsável por atribuir endereços IP automaticamente aos dispositivos conectados em uma rede local é o:`,
    options: [
      { id: "A", text: "DNS (Domain Name System)" },
      { id: "B", text: "DHCP (Dynamic Host Configuration Protocol)" },
      { id: "C", text: "HTTP (Hypertext Transfer Protocol)" },
      { id: "D", text: "SMTP (Simple Mail Transfer Protocol)" },
      { id: "E", text: "FTP (File Transfer Protocol)" }
    ],
    correctAnswer: "B",
    explanation: "O DHCP (Dynamic Host Configuration Protocol) é o serviço de rede responsável por fornecer configurações dinâmicas de TCP/IP, incluindo endereço IP, máscara e gateway, aos clientes conectados."
  },
  {
    id: "q-14",
    statement: `No âmbito da metodologia científica, uma hipótese se caracteriza fundamentalmente como:`,
    options: [
      { id: "A", text: "uma verdade absoluta e indiscutível consagrada por autoridades acadêmicas." },
      { id: "B", text: "uma suposição testável formulada como resposta provisória a um problema de pesquisa." },
      { id: "C", text: "o conjunto final de referências bibliográficas consultadas no trabalho." },
      { id: "D", text: "a comprovação empírica definitiva obtida após a conclusão dos testes." },
      { id: "E", text: "um resumo dos métodos quantitativos utilizados sem relação com a pergunta de pesquisa." }
    ],
    correctAnswer: "B",
    explanation: "Uma hipótese científica é uma proposição preliminar e provisória que busca explicar um fenômeno ou responder a um problema, sujeita à verificação ou refutação experimental."
  },
  {
    id: "q-15",
    statement: `Na microeconomia, a Lei da Oferta e da Procura descreve o comportamento de preços e quantidades em um mercado concorrencial.

Em condições normais (ceteris paribus), quando o preço de um bem normal se eleva:`,
    options: [
      { id: "A", text: "a quantidade demandada pelos consumidores tende a diminuir." },
      { id: "B", text: "a quantidade ofertada pelos produtores tende a cair imediatamente a zero." },
      { id: "C", text: "a demanda dos consumidores aumenta exponencialmente." },
      { id: "D", text: "não há qualquer alteração no comportamento de compradores e vendedores." },
      { id: "E", text: "o mercado atinge instantaneamente o equilíbrio perfeito de escassez." }
    ],
    correctAnswer: "A",
    explanation: "Pela Lei da Demanda, há uma relação inversa entre preço e quantidade demandada: mantendo as demais variáveis constantes (ceteris paribus), um aumento no preço reduz a quantidade que os consumidores estão dispostos a adquirir."
  },
  {
    id: "q-16",
    statement: `Em relação à gestão de projetos ágeis com a metodologia Scrum, a reunião diária (Daily Scrum) tem como objetivo principal:`,
    options: [
      { id: "A", text: "avaliar o desempenho individual para definição de bônus salariais." },
      { id: "B", text: "alinhar o progresso da equipe em direção à Meta da Sprint e identificar impedimentos." },
      { id: "C", text: "renegociar o escopo do contrato com o cliente final." },
      { id: "D", text: "elaborar a documentação técnica de arquitetura em detalhes." },
      { id: "E", text: "substituir a retrospectiva e o planejamento quinzenal." }
    ],
    correctAnswer: "B",
    explanation: "A Daily Scrum é um evento de 15 minutos para os desenvolvedores inspecionarem o progresso rumo à Meta da Sprint e adaptarem o plano de trabalho para o dia seguinte, identificando possíveis bloqueios e impedimentos."
  }
];

// Classificação inicial do banco de demonstração. Questões antigas sem tema recebem a categoria correspondente.
const DEFAULT_CATEGORY_BY_ID = {
  "q-1": "Português", "q-2": "Conhecimentos Gerais", "q-3": "Matemática",
  "q-4": "Português", "q-5": "Conhecimentos Gerais", "q-6": "Didática",
  "q-7": "Matemática", "q-8": "Conhecimentos Gerais", "q-9": "Legislação",
  "q-10": "Conhecimentos Gerais", "q-11": "Didática", "q-12": "Português",
  "q-13": "Conhecimentos Gerais", "q-14": "Tipologia Textual", "q-15": "Matemática", "q-16": "Didática"
};

// Funções de inicialização e persistência de dados
function getInitialQuestions() {
  const stored = localStorage.getItem("anhanguera_question_bank");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 12) {
        const migrated = parsed.map((question) => ({
          ...question,
          category: question.category || question.categoria || DEFAULT_CATEGORY_BY_ID[question.id] || "Geral"
        }));
        localStorage.setItem("anhanguera_question_bank", JSON.stringify(migrated));
        return migrated;
      }
    } catch (e) {
      console.error("Erro ao carregar banco do localStorage", e);
    }
  }
  localStorage.setItem("anhanguera_question_bank", JSON.stringify(DEFAULT_QUESTIONS));
  return DEFAULT_QUESTIONS;
}
