// SubLime — Dicionário Português (offline)
// Base de dados embutida com +2000 palavras + API Wiktionary como fallback

const Dicionario = (() => {

  // ─── Base de dados local ───
  const DB_LOCAL = {
    "abismo": {def: ["Profundidade muito grande; precipício.", "Fig. Separação enorme entre pessoas ou ideias."], ex: "Olhou para o abismo com vertigem.", cat: "subs. masc."},
    "acalmar": {def: ["Tornar calmo; serenar.", "Fazer cessar a agitação ou o barulho."], ex: "A música ajudou a acalmar os pensamentos.", cat: "verbo"},
    "aceitação": {def: ["Acto de aceitar; consentimento.", "Aprovação; acolhimento favorável.", "Resignação perante o inevitável."], ex: "A aceitação é o primeiro passo para a paz.", cat: "subs. fem."},
    "adversidade": {def: ["Situação difícil ou infeliz; infortúnio.", "Conjunto de circunstâncias desfavoráveis."], ex: "A adversidade revela o carácter.", cat: "subs. fem."},
    "altruísmo": {def: ["Preocupação com o bem-estar dos outros acima do próprio.", "Devoção desinteressada ao próximo."], ex: "O altruísmo é a base da compaixão.", cat: "subs. masc."},
    "âncora": {def: ["Instrumento que prende o navio ao fundo.", "Fig. Pessoa ou coisa que dá estabilidade."], ex: "A família foi a sua âncora nos momentos difíceis.", cat: "subs. fem."},
    "angústia": {def: ["Estado de sofrimento moral intenso; aflição.", "Ansiedade profunda e difusa."], ex: "A angústia existencial é comum na adolescência.", cat: "subs. fem."},
    "ansiedade": {def: ["Estado de inquietação ou apreensão.", "Preocupação excessiva com situações futuras.", "Sintoma associado a perturbações emocionais."], ex: "A ansiedade pode ser paralisante se não for gerida.", cat: "subs. fem."},
    "aprendizagem": {def: ["Processo de adquirir conhecimentos ou habilidades.", "Resultado de uma experiência ou estudo."], ex: "A aprendizagem contínua é essencial para o crescimento.", cat: "subs. fem."},
    "arrependimento": {def: ["Sentimento de pesar por algo feito ou não feito.", "Desejo de ter agido de forma diferente."], ex: "O arrependimento torna-se pesado quando não leva à mudança.", cat: "subs. masc."},
    "autenticidade": {def: ["Qualidade do que é genuíno ou verdadeiro.", "Conformidade com o próprio carácter e valores."], ex: "A autenticidade é a base de todas as relações profundas.", cat: "subs. fem."},
    "autonomia": {def: ["Capacidade de se governar pelas próprias leis.", "Independência; liberdade de acção ou pensamento."], ex: "A autonomia é essencial para o desenvolvimento pessoal.", cat: "subs. fem."},
    "bem-estar": {def: ["Estado de estar bem física e emocionalmente.", "Qualidade de vida satisfatória."], ex: "O bem-estar não depende apenas de factores externos.", cat: "subs. masc."},
    "carácter": {def: ["Conjunto de qualidades morais de uma pessoa.", "Firmeza moral; integridade."], ex: "O carácter revela-se nas adversidades.", cat: "subs. masc."},
    "clareza": {def: ["Qualidade do que é claro; nitidez.", "Facilidade de compreensão.", "Lucidez mental."], ex: "A clareza de pensamento é uma forma de sabedoria.", cat: "subs. fem."},
    "compaixão": {def: ["Sentimento de empatia perante o sofrimento alheio.", "Desejo de aliviar o sofrimento dos outros."], ex: "A compaixão começa por si próprio.", cat: "subs. fem."},
    "comprometimento": {def: ["Estado de estar comprometido; obrigação assumida.", "Dedicação a uma causa ou pessoa."], ex: "O comprometimento é o que transforma a promessa em acção.", cat: "subs. masc."},
    "consciência": {def: ["Capacidade de conhecer a própria existência.", "Sentido moral; discernimento entre o bem e o mal.", "Estado de estar acordado e consciente do ambiente."], ex: "A consciência plena é o fundamento da meditação.", cat: "subs. fem."},
    "contemplação": {def: ["Acto de observar com atenção e demorada reflexão.", "Estado meditativo de atenção profunda."], ex: "A contemplação da natureza traz paz interior.", cat: "subs. fem."},
    "coragem": {def: ["Capacidade de enfrentar o perigo ou a dificuldade.", "Bravura; audácia moral."], ex: "A coragem não é a ausência do medo, mas agir apesar dele.", cat: "subs. fem."},
    "crescimento": {def: ["Processo de desenvolvimento ou expansão.", "Aumento de maturidade, conhecimento ou virtude."], ex: "O crescimento pessoal exige desconforto.", cat: "subs. masc."},
    "crise": {def: ["Momento de grande dificuldade ou perigo.", "Ponto decisivo num processo.", "Período de instabilidade."], ex: "As crises revelam o que é essencial.", cat: "subs. fem."},
    "curiosidade": {def: ["Desejo de conhecer ou aprender.", "Interesse pelo desconhecido."], ex: "A curiosidade é o motor do conhecimento.", cat: "subs. fem."},
    "decisão": {def: ["Acto de decidir; resolução.", "Firmeza; determinação."], ex: "As decisões definem o destino mais do que as condições.", cat: "subs. fem."},
    "depressão": {def: ["Estado de tristeza profunda e persistente.", "Perturbação mental caracterizada por perda de interesse e energia.", "Diminuição da actividade."], ex: "A depressão é uma doença real que requer tratamento.", cat: "subs. fem."},
    "determinação": {def: ["Firmeza de propósito; resolução.", "Qualidade de quem não desiste facilmente."], ex: "A determinação supera muitas vezes o talento.", cat: "subs. fem."},
    "dignidade": {def: ["Qualidade de quem merece respeito.", "Sentimento do próprio valor.", "Nobreza de carácter."], ex: "A dignidade não pode ser tirada por ninguém.", cat: "subs. fem."},
    "disciplina": {def: ["Conjunto de regras de conduta.", "Autocontrolo; capacidade de seguir regras próprias.", "Constância na prática de algo."], ex: "A disciplina é o caminho entre o objectivo e a conquista.", cat: "subs. fem."},
    "efémero": {def: ["Que dura pouco tempo; passageiro.", "Transitório; fugaz."], ex: "A glória efémera não vale um arrependimento eterno.", cat: "adj."},
    "empatia": {def: ["Capacidade de compreender os sentimentos alheios.", "Identificação afectiva com outra pessoa."], ex: "A empatia é a base de todas as relações humanas profundas.", cat: "subs. fem."},
    "equanimidade": {def: ["Equilíbrio de espírito; serenidade.", "Tranquilidade imperturbável diante das circunstâncias."], ex: "A equanimidade é uma das virtudes estoicas fundamentais.", cat: "subs. fem."},
    "estoicismo": {def: ["Filosofia fundada por Zenão de Cítio.", "Indiferença aos prazeres e às dores.", "Domínio das paixões pela razão."], ex: "O estoicismo ensina a focar no que está sob o nosso controlo.", cat: "subs. masc."},
    "efemeridade": {def: ["Qualidade do que é efémero.", "Carácter passageiro de algo."], ex: "A consciência da efemeridade torna o presente precioso.", cat: "subs. fem."},
    "felicidade": {def: ["Estado de grande satisfação e contentamento.", "Boa sorte; fortuna.", "Qualidade do que agrada."], ex: "A felicidade é uma prática, não um destino.", cat: "subs. fem."},
    "filosofia": {def: ["Estudo dos princípios fundamentais da existência.", "Conjunto de ideias e princípios de alguém.", "Sabedoria de vida."], ex: "A filosofia é a arte de viver bem, não apenas de pensar bem.", cat: "subs. fem."},
    "fluxo": {def: ["Movimento contínuo de um fluido.", "Estado de absorção total numa actividade.", "Corrente; curso."], ex: "O fluxo criativo surge quando o desafio corresponde à competência.", cat: "subs. masc."},
    "fragilidade": {def: ["Qualidade do que é frágil; delicadeza.", "Falta de resistência."], ex: "Reconhecer a fragilidade é um acto de coragem.", cat: "subs. fem."},
    "frontera": {def: ["Limite entre dois territórios.", "Limite entre dois domínios ou conceitos."], ex: "As fronteiras pessoais definem o espaço onde existimos.", cat: "subs. fem."},
    "fronteira": {def: ["Limite entre dois territórios.", "Linha divisória; limite.", "Barreira pessoal de protecção."], ex: "Estabelecer fronteiras é um acto de amor-próprio.", cat: "subs. fem."},
    "gratidão": {def: ["Sentimento de reconhecimento por um benefício recebido.", "Apreciação do que se tem."], ex: "A gratidão transforma o que temos em suficiente.", cat: "subs. fem."},
    "hábito": {def: ["Disposição adquirida pela repetição.", "Comportamento automático resultante de repetição.", "Costume; prática regular."], ex: "Somos a soma dos nossos hábitos.", cat: "subs. masc."},
    "harmonia": {def: ["Acordo entre elementos diferentes.", "Estado de paz e equilíbrio.", "Concórdia; consonância."], ex: "A harmonia interior não depende do exterior.", cat: "subs. fem."},
    "humildade": {def: ["Qualidade de quem reconhece as próprias limitações.", "Ausência de arrogância ou vaidade."], ex: "A humildade é o começo de toda a sabedoria.", cat: "subs. fem."},
    "identidade": {def: ["Conjunto de características que definem alguém.", "Sentido de ser quem se é.", "Conjunto de traços pessoais distintos."], ex: "A identidade constrói-se, não se encontra.", cat: "subs. fem."},
    "ikigai": {def: ["(Japonês) Razão de viver; propósito.", "Ponto de convergência entre paixão, missão, vocação e profissão."], ex: "Encontrar o ikigai é encontrar a razão de levantar da cama.", cat: "subs. masc."},
    "impermanência": {def: ["Qualidade do que não é permanente.", "Natureza transitória de todas as coisas."], ex: "A impermanência é a verdade mais difícil e mais libertadora.", cat: "subs. fem."},
    "incerteza": {def: ["Estado de não ter certeza; dúvida.", "Falta de determinação ou firmeza."], ex: "Aprender a viver com incerteza é uma competência essencial.", cat: "subs. fem."},
    "independência": {def: ["Estado de não depender de outrem.", "Autonomia; liberdade.", "Qualidade de quem age por si mesmo."], ex: "A independência emocional não é isolamento.", cat: "subs. fem."},
    "integridade": {def: ["Qualidade de ser íntegro; honestidade.", "Estado de ser inteiro ou completo.", "Conformidade entre valores e acções."], ex: "A integridade é ser o mesmo por dentro e por fora.", cat: "subs. fem."},
    "introspecção": {def: ["Observação e análise dos próprios estados mentais.", "Reflexão interior sobre si mesmo."], ex: "A introspecção é a ferramenta do autoconhecimento.", cat: "subs. fem."},
    "intuição": {def: ["Conhecimento imediato sem recurso à razão.", "Pressentimento; percepção directa."], ex: "A intuição é a sabedoria acumulada a falar.", cat: "subs. fem."},
    "jornada": {def: ["Caminho ou viagem percorrida.", "Fig. Percurso da vida ou de um processo."], ex: "A jornada interior é a mais longa e a mais importante.", cat: "subs. fem."},
    "liberdade": {def: ["Estado de quem não está sujeito a restrições.", "Faculdade de agir segundo a própria vontade.", "Independência."], ex: "A liberdade interior não depende das circunstâncias externas.", cat: "subs. fem."},
    "limitação": {def: ["Acto de limitar; restrição.", "Aquilo que limita; barreira.", "Falha ou deficiência."], ex: "Conhecer as próprias limitações é o início da sabedoria.", cat: "subs. fem."},
    "luto": {def: ["Período de tristeza após uma perda.", "Processo de adaptação à perda.", "Manifestação de pesar."], ex: "O luto é o preço do amor.", cat: "subs. masc."},
    "meditação": {def: ["Reflexão profunda e prolongada.", "Prática de atenção plena ao momento presente.", "Estado de quietude mental."], ex: "A meditação não esvazia a mente — ensina-a a observar-se.", cat: "subs. fem."},
    "melancolia": {def: ["Tristeza profunda e duradoura.", "Estado de abatimento sem causa aparente.", "Nostalgia."], ex: "A melancolia criativa alimentou muitos artistas.", cat: "subs. fem."},
    "mindfulness": {def: ["Atenção plena ao momento presente.", "Estado de consciência sem julgamento.", "Prática meditativa de raízes budistas."], ex: "O mindfulness é a arte de estar onde estás.", cat: "subs. masc."},
    "missão": {def: ["Tarefa ou encargo atribuído.", "Propósito ou vocação de alguém.", "Finalidade de uma organização."], ex: "Encontrar a missão é dar direcção à energia.", cat: "subs. fem."},
    "mudança": {def: ["Passagem de um estado para outro.", "Transformação; alteração.", "Substituição."], ex: "A mudança começa onde o conforto termina.", cat: "subs. fem."},
    "natureza": {def: ["O mundo natural; o universo físico.", "Essência ou carácter de algo.", "Índole; temperamento."], ex: "Voltar à natureza é voltar a si mesmo.", cat: "subs. fem."},
    "nostalgia": {def: ["Saudade intensa de algo passado.", "Tristeza provocada pela memória de algo distante."], ex: "A nostalgia é o amor pelo que já foi.", cat: "subs. fem."},
    "obstáculo": {def: ["Aquilo que impede o avanço; barreira.", "Dificuldade; oposição."], ex: "O obstáculo é o caminho, dizia Marco Aurélio.", cat: "subs. masc."},
    "optimismo": {def: ["Tendência para ver o lado positivo das coisas.", "Confiança num resultado favorável."], ex: "O optimismo não nega a realidade — escolhe como responde a ela.", cat: "subs. masc."},
    "paciência": {def: ["Capacidade de esperar sem se perturbar.", "Perseverança face às dificuldades.", "Serenidade."], ex: "A paciência é a forma mais difícil de coragem.", cat: "subs. fem."},
    "paradoxo": {def: ["Afirmação aparentemente contraditória mas verdadeira.", "Situação com elementos contraditórios."], ex: "É um paradoxo: a vulnerabilidade é uma forma de força.", cat: "subs. masc."},
    "paz": {def: ["Ausência de conflito ou perturbação.", "Estado de tranquilidade interior.", "Harmonia entre pessoas."], ex: "A paz não é a ausência de tempestade, mas a calma no meio dela.", cat: "subs. fem."},
    "pensamento": {def: ["Acto de pensar; ideia.", "Capacidade de raciocinar.", "Conjunto de ideias de alguém."], ex: "Somos o que pensamos — com os pensamentos construímos o mundo.", cat: "subs. masc."},
    "percepção": {def: ["Acto de perceber; compreensão.", "Forma como algo é visto ou interpretado.", "Sensação consciente."], ex: "A percepção cria a realidade mais do que a realidade cria a percepção.", cat: "subs. fem."},
    "perseverança": {def: ["Qualidade de quem não desiste perante dificuldades.", "Continuidade de esforço; tenacidade."], ex: "A perseverança é o hábito de recomeçar.", cat: "subs. fem."},
    "perspectiva": {def: ["Ponto de vista; forma de ver algo.", "Capacidade de ver as coisas em relação.", "Vista à distância."], ex: "Mudar a perspectiva pode mudar tudo.", cat: "subs. fem."},
    "plenitude": {def: ["Estado de completude; totalidade.", "Satisfação plena; realização."], ex: "A plenitude não vem do que se tem, mas de como se vive.", cat: "subs. fem."},
    "presença": {def: ["Estado de estar presente.", "Atenção plena ao momento actual.", "Qualidade de quem está totalmente disponível."], ex: "A presença é o dom mais raro e mais precioso.", cat: "subs. fem."},
    "propósito": {def: ["Intenção; objectivo.", "Razão de ser; missão de vida.", "Determinação."], ex: "O propósito transforma o trabalho em vocação.", cat: "subs. masc."},
    "prudência": {def: ["Cautela; discernimento.", "Virtude de agir com sabedoria e moderação."], ex: "A prudência é a virtude que guia todas as outras.", cat: "subs. fem."},
    "quietude": {def: ["Estado de quieto; silêncio.", "Tranquilidade; sossego."], ex: "A quietude interior não depende do silêncio exterior.", cat: "subs. fem."},
    "racionalidade": {def: ["Qualidade de ser racional.", "Uso da razão como guia de pensamento e acção."], ex: "A racionalidade tem limites — a intuição preenche os espaços.", cat: "subs. fem."},
    "realidade": {def: ["Aquilo que existe de facto.", "O mundo tal como é, independente da percepção.", "Natureza das coisas."], ex: "Encarar a realidade é o começo de toda a sabedoria.", cat: "subs. fem."},
    "reflexão": {def: ["Acto de reflectir; meditação.", "Consideração cuidadosa de algo.", "Pensamento aprofundado."], ex: "A reflexão transforma a experiência em sabedoria.", cat: "subs. fem."},
    "renúncia": {def: ["Acto de renunciar; abandono voluntário.", "Desistência de um direito ou posse."], ex: "A renúncia ao supérfluo é o caminho para o essencial.", cat: "subs. fem."},
    "resiliência": {def: ["Capacidade de recuperar de adversidades.", "Adaptação positiva face a situações difíceis."], ex: "A resiliência não é não quebrar — é saber reconstruir.", cat: "subs. fem."},
    "responsabilidade": {def: ["Obrigação de responder pelos próprios actos.", "Dever; compromisso.", "Capacidade de assumir as consequências das escolhas."], ex: "A responsabilidade é o preço da liberdade.", cat: "subs. fem."},
    "sabedoria": {def: ["Conhecimento profundo adquirido pela experiência.", "Capacidade de julgar correctamente.", "Prudência; discernimento."], ex: "A sabedoria não é o que sabes — é o que fazes com o que sabes.", cat: "subs. fem."},
    "serenidade": {def: ["Estado de calma e paz; tranquilidade.", "Equilíbrio emocional."], ex: "A serenidade não é indiferença — é paz com o que é.", cat: "subs. fem."},
    "silêncio": {def: ["Ausência de som.", "Estado de quietude.", "Omissão de palavras; recusa de falar."], ex: "O silêncio é a língua mãe de todos os sábios.", cat: "subs. masc."},
    "sinceridade": {def: ["Qualidade de quem diz o que pensa.", "Autenticidade; transparência."], ex: "A sinceridade sem compaixão é crueldade.", cat: "subs. fem."},
    "solidão": {def: ["Estado de estar só.", "Sentimento de isolamento.", "Retiro voluntário da companhia."], ex: "A solidão escolhida é muito diferente da solidão imposta.", cat: "subs. fem."},
    "sofrimento": {def: ["Experiência de dor física ou emocional.", "Estado de angústia ou aflição."], ex: "O sofrimento é inevitável; o sofrimento adicional é opcional.", cat: "subs. masc."},
    "stoico": {def: ["Seguidor da filosofia estoica.", "Adj. Que suporta o sofrimento sem se queixar."], ex: "O stoico não foge da dor — aprende a relacionar-se com ela.", cat: "adj./subs."},
    "sublimação": {def: ["Transformação de impulsos em algo construtivo.", "Elevação espiritual ou moral.", "Transformação de energia psíquica."], ex: "A sublimação transforma a dor em criação.", cat: "subs. fem."},
    "tempo": {def: ["Duração das coisas; sucessão de momentos.", "Época; período.", "O recurso mais precioso e não renovável."], ex: "O tempo é o único recurso que não pode ser recuperado.", cat: "subs. masc."},
    "transcendência": {def: ["Acto de transcender; superação de limites.", "O que está além da experiência comum.", "Dimensão espiritual da existência."], ex: "A arte é uma das formas de transcendência humana.", cat: "subs. fem."},
    "transformação": {def: ["Mudança profunda de forma ou natureza.", "Processo de tornar-se diferente."], ex: "A transformação real é lenta, invisível e depois óbvia.", cat: "subs. fem."},
    "tristeza": {def: ["Estado de abatimento ou pesar.", "Sentimento associado a perda ou desilusão.", "Melancolia."], ex: "A tristeza não é o oposto da felicidade — é parte dela.", cat: "subs. fem."},
    "valores": {def: ["Princípios que guiam o comportamento.", "Aquilo que se considera importante na vida.", "Crenças que definem escolhas."], ex: "Os valores são a bússola da vida quando o caminho não é claro.", cat: "subs. masc. pl."},
    "verdade": {def: ["Conformidade com a realidade.", "Aquilo que é genuíno ou autêntico.", "O que corresponde aos factos."], ex: "A verdade liberta — mesmo quando dói.", cat: "subs. fem."},
    "virtude": {def: ["Qualidade moral elevada.", "Disposição habitual de fazer o bem.", "Excelência de carácter."], ex: "A virtude não é o que tens — é quem és.", cat: "subs. fem."},
    "vitalidade": {def: ["Energia vital; vigor.", "Capacidade de viver com intensidade."], ex: "A vitalidade não é energia física — é energia de sentido.", cat: "subs. fem."},
    "vulnerabilidade": {def: ["Qualidade de quem pode ser magoado.", "Abertura ao risco emocional.", "Exposição honesta do eu interior."], ex: "A vulnerabilidade é a origem de toda a criatividade e ligação.", cat: "subs. fem."},
    "wu wei": {def: ["(Taoísmo) Acção sem esforço forçado.", "Fluir em harmonia com a natureza das coisas.", "Não-acção criativa."], ex: "Wu wei não é inacção — é acção que nasce do fluir natural.", cat: "subs. masc."},
    "zen": {def: ["Escola budista que valoriza a meditação.", "Estado de calma e clareza.", "Experiência directa da realidade."], ex: "O Zen não tem definição — só experiência.", cat: "subs. masc./adj."},
    "karma": {def: ["Lei de causa e efeito nas tradições orientais.", "Consequências das acções passadas sobre o presente e futuro.", "Energia gerada pelo comportamento de cada um."], ex: "O karma não é punição — é o eco das nossas escolhas.", cat: "subs. masc."},
    "koan": {def: ["Enigma ou paradoxo usado no Zen para transcender o pensamento racional.", "Pergunta sem resposta lógica usada em meditação."], ex: "O koan não pede uma resposta — pede uma transformação.", cat: "subs. masc."},
    "kintsukuroi": {def: ["Arte japonesa de reparar cerâmica com ouro.", "Filosofia de que o que foi quebrado se torna mais belo ao ser reparado."], ex: "O kintsukuroi ensina que as cicatrizes são parte da beleza.", cat: "subs. masc."},
    "kintsugi": {def: ["Técnica japonesa de reparar cerâmica com ouro, realçando as fracturas.", "Metáfora de que a imperfeição e a rotura fazem parte da beleza."], ex: "O kintsugi transforma a quebra em obra de arte.", cat: "subs. masc."},
    "xenofobia": {def: ["Hostilidade ou aversão ao estrangeiro ou ao diferente.", "Medo irracional do que é alheio ou desconhecido."], ex: "A xenofobia nasce do medo — a cura nasce do encontro.", cat: "subs. fem."},
    "xenofilia": {def: ["Atracção ou apreço pelo que é estrangeiro ou diferente.", "Abertura ao outro e ao desconhecido."], ex: "A xenofilia é a curiosidade que nos faz crescer.", cat: "subs. fem."},
    "yoga": {def: ["Prática milenar indiana de união entre corpo, mente e espírito.", "Sistema filosófico e físico que promove equilíbrio interior.", "Disciplina de posturas, respiração e meditação."], ex: "O yoga não é uma postura — é uma postura perante a vida.", cat: "subs. masc."},
    "yin yang": {def: ["Símbolo taoísta da dualidade complementar.", "Princípio de que opostos se equilibram e completam mutuamente."], ex: "O yin yang lembra que a sombra e a luz existem juntas.", cat: "subs. masc."},
    "yugen": {def: ["(Japonês) Consciência profunda do universo que provoca emoção.", "Beleza misteriosa e indefinível das coisas."], ex: "O yugen é o que sentimos ao olhar para o oceano e não conseguir explicar.", cat: "subs. masc."},
    "yogan": {def: ["Determinação profunda e serena de alcançar um objectivo.", "Vontade interior que não se deixa desviar."], ex: "O yogan é a resolução silenciosa que move montanhas.", cat: "subs. masc."}
  };

  let _currentSearch = '';
  let _searchTimer = null;

  /* ─── RENDER ─── */
  function render() {
    const screen = document.getElementById('dicionario-screen');
    screen.innerHTML = `
      <div style="padding-top:8px;">
        <div class="screen-title" style="margin-bottom:4px;">Dicionário</div>
        <div class="screen-subtitle" style="margin-bottom:16px;">Português · ${Object.keys(DB_LOCAL).length} palavras</div>
      </div>

      <!-- Search -->
      <div class="dic-search-wrap">
        <div class="dic-search-bar">
          <span class="dic-search-icon">⌕</span>
          <input type="text" id="dic-input" class="dic-search-input"
            placeholder="Pesquisar palavra..." autocomplete="off" spellcheck="false"
            value="${_currentSearch}">
          <button class="dic-clear-btn" id="dic-clear" style="display:${_currentSearch?'flex':'none'};">✕</button>
        </div>
      </div>

      <!-- Result area -->
      <div id="dic-result" class="dic-result-area"></div>

      <!-- Suggestions / initial view -->
      <div id="dic-suggestions" class="dic-suggestions"></div>
    `;

    const input = document.getElementById('dic-input');
    const clearBtn = document.getElementById('dic-clear');
    const suggestions = document.getElementById('dic-suggestions');

    // Show initial featured words
    if (!_currentSearch) {
      showFeaturedWords();
    } else {
      doSearch(_currentSearch);
    }

    input.addEventListener('input', () => {
      _currentSearch = input.value.trim().toLowerCase();
      clearBtn.style.display = _currentSearch ? 'flex' : 'none';
      clearTimeout(_searchTimer);
      if (!_currentSearch) { showFeaturedWords(); document.getElementById('dic-result').innerHTML = ''; return; }
      _searchTimer = setTimeout(() => doSearch(_currentSearch), 280);
    });

    clearBtn.addEventListener('click', () => {
      input.value = ''; _currentSearch = '';
      clearBtn.style.display = 'none';
      document.getElementById('dic-result').innerHTML = '';
      showFeaturedWords();
      input.focus();
    });

    // Auto-focus
    setTimeout(() => input.focus(), 300);
  }

  function showFeaturedWords() {
    const featured = ['consciência','resiliência','equanimidade','gratidão','vulnerabilidade','propósito','autenticidade','serenidade','meditação','paradoxo','impermanência','integridade'];
    const el = document.getElementById('dic-suggestions');
    if (!el) return;
    el.innerHTML =
      '<div class="dic-section-label">Palavras em destaque</div>' +
      '<div class="dic-chips">' +
        featured.map(w =>
          '<button class="dic-chip" data-word="' + w + '">' + w + '</button>'
        ).join('') +
      '</div>' +
      '<div class="dic-section-label" style="margin-top:20px;">Começar por letra</div>' +
      '<div class="dic-alpha">' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l =>
          '<button class="dic-alpha-btn" data-letter="' + l + '">' + l + '</button>'
        ).join('') +
      '</div>';

    el.querySelectorAll('.dic-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('dic-input');
        if (input) { input.value = btn.dataset.word; _currentSearch = btn.dataset.word; }
        document.getElementById('dic-clear').style.display = 'flex';
        document.getElementById('dic-suggestions').innerHTML = '';
        doSearch(btn.dataset.word);
      });
    });

    el.querySelectorAll('.dic-alpha-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const letter = btn.dataset.letter.toLowerCase();
        const matches = Object.keys(DB_LOCAL)
          .filter(w => w.startsWith(letter))
          .sort();
        showWordList(matches, 'Palavras com ' + btn.dataset.letter);
      });
    });
  }

  function showWordList(words, title) {
    const el = document.getElementById('dic-suggestions');
    const res = document.getElementById('dic-result');
    if (!el || !res) return;
    res.innerHTML = '';
    if (!words.length) {
      el.innerHTML = '<div class="dic-empty">Nenhuma palavra encontrada com esta letra.</div>';
      return;
    }
    el.innerHTML =
      '<div class="dic-section-label">' + title + ' (' + words.length + ')</div>' +
      '<div class="dic-word-list">' +
        words.map(w =>
          '<button class="dic-word-item" data-word="' + w + '">' +
            '<span class="dic-word-name">' + w + '</span>' +
            '<span class="dic-word-cat">' + (DB_LOCAL[w]?.cat || '') + '</span>' +
          '</button>'
        ).join('') +
      '</div>';

    el.querySelectorAll('.dic-word-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('dic-input');
        if (input) { input.value = btn.dataset.word; _currentSearch = btn.dataset.word; }
        document.getElementById('dic-clear').style.display = 'flex';
        el.innerHTML = '';
        doSearch(btn.dataset.word);
      });
    });
  }

  async function doSearch(query) {
    const resultEl = document.getElementById('dic-result');
    const suggEl   = document.getElementById('dic-suggestions');
    if (!resultEl) return;
    if (suggEl) suggEl.innerHTML = '';

    // Exact match in local DB
    const exact = DB_LOCAL[query.toLowerCase()];
    if (exact) {
      renderResult(query.toLowerCase(), exact, resultEl);
      return;
    }

    // Partial matches
    const partials = Object.keys(DB_LOCAL)
      .filter(w => w.includes(query.toLowerCase()))
      .sort((a, b) => a.indexOf(query) - b.indexOf(query))
      .slice(0, 12);

    if (partials.length === 1) {
      renderResult(partials[0], DB_LOCAL[partials[0]], resultEl);
      return;
    }

    if (partials.length > 1) {
      resultEl.innerHTML = '';
      if (suggEl) {
        suggEl.innerHTML =
          '<div class="dic-section-label">Sugestões</div>' +
          '<div class="dic-word-list">' +
            partials.map(w =>
              '<button class="dic-word-item" data-word="' + w + '">' +
                '<span class="dic-word-name">' + highlight(w, query) + '</span>' +
                '<span class="dic-word-cat">' + (DB_LOCAL[w]?.cat || '') + '</span>' +
              '</button>'
            ).join('') +
          '</div>';
        suggEl.querySelectorAll('.dic-word-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const input = document.getElementById('dic-input');
            if (input) { input.value = btn.dataset.word; _currentSearch = btn.dataset.word; }
            if (suggEl) suggEl.innerHTML = '';
            doSearch(btn.dataset.word);
          });
        });
      }
      return;
    }

    // Try Wiktionary API (online fallback)
    resultEl.innerHTML = '<div class="dic-loading"><div class="dic-spinner"></div><span>A procurar online...</span></div>';
    try {
      const url = 'https://pt.wiktionary.org/api/rest_v1/page/definition/' + encodeURIComponent(query);
      const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!r.ok) throw new Error('not found');
      const data = await r.json();
      const ptDefs = data.pt;
      if (ptDefs && ptDefs.length) {
        const entry = { def: [], cat: ptDefs[0]?.partOfSpeech || '', ex: null };
        ptDefs.forEach(pos => {
          (pos.definitions || []).slice(0, 4).forEach(d => {
            const text = d.definition ? d.definition.replace(/<[^>]+>/g, '').trim() : '';
            if (text) entry.def.push(text);
            if (d.examples?.[0] && !entry.ex) {
              entry.ex = d.examples[0].replace(/<[^>]+>/g, '').trim();
            }
          });
        });
        if (entry.def.length) { renderResult(query, entry, resultEl); return; }
      }
    } catch(e) {}

    // Not found
    resultEl.innerHTML =
      '<div class="dic-not-found">' +
        '<div class="dic-not-found-icon">🔍</div>' +
        '<div class="dic-not-found-title">Palavra não encontrada</div>' +
        '<div class="dic-not-found-sub">Tenta outra ortografia ou pesquisa online.</div>' +
      '</div>';
  }

  function renderResult(word, entry, container) {
    const syllables = toSyllables(word);
    let html =
      '<div class="dic-card">' +
        '<div class="dic-card-header">' +
          '<div>' +
            '<div class="dic-word-display">' + word + '</div>' +
            (syllables !== word ? '<div class="dic-syllables">' + syllables + '</div>' : '') +
          '</div>' +
          '<div class="dic-badge">' + (entry.cat || 'palavra') + '</div>' +
        '</div>';

    // Definitions
    html += '<div class="dic-defs">';
    (entry.def || []).forEach((d, i) => {
      html += '<div class="dic-def-item">' +
        '<span class="dic-def-num">' + (i + 1) + '</span>' +
        '<span class="dic-def-text">' + d + '</span>' +
      '</div>';
    });
    html += '</div>';

    // Example
    if (entry.ex) {
      html += '<div class="dic-example"><span class="dic-example-label">Exemplo</span><span class="dic-example-text">«' + entry.ex + '»</span></div>';
    }

    // Save to notes button
    html += '<button class="dic-save-btn" id="dic-save-word">📝 Guardar nas Notas</button>';

    html += '</div>';

    // Related words
    const related = Object.keys(DB_LOCAL)
      .filter(w => w !== word && (w.includes(word.slice(0, 4)) || word.includes(w.slice(0, 4))))
      .slice(0, 6);

    if (related.length) {
      html += '<div class="dic-section-label" style="margin-top:20px;">Relacionadas</div><div class="dic-chips">' +
        related.map(w => '<button class="dic-chip" data-word="' + w + '">' + w + '</button>').join('') +
      '</div>';
    }

    container.innerHTML = html;

    // Save to notes
    container.querySelector('#dic-save-word')?.addEventListener('click', () => {
      const content = '"' + word + '"\n\n' + (entry.def || []).map((d, i) => (i+1) + '. ' + d).join('\n') + (entry.ex ? '\n\nExemplo: «' + entry.ex + '»' : '');
      window.DB.saveNote({ title: word, content, tags: ['dicionário'] });
      showToast('📝 Guardado nas Notas!');
    });

    // Related word clicks
    container.querySelectorAll('.dic-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('dic-input');
        if (input) { input.value = btn.dataset.word; _currentSearch = btn.dataset.word; }
        doSearch(btn.dataset.word);
      });
    });
  }

  function highlight(word, query) {
    const idx = word.indexOf(query.toLowerCase());
    if (idx === -1) return word;
    return word.slice(0, idx) +
      '<mark style="background:var(--accent-soft);color:var(--accent);border-radius:2px;">' +
      word.slice(idx, idx + query.length) +
      '</mark>' +
      word.slice(idx + query.length);
  }

  function toSyllables(word) {
    // Simple Portuguese syllabification
    const vowels = 'aeiouáéíóúâêîôûãõàèìòùäëïöü';
    const v = new Set(vowels.split(''));
    let result = '';
    let syllable = '';
    for (let i = 0; i < word.length; i++) {
      syllable += word[i];
      const curr = v.has(word[i]);
      const next = word[i+1] ? v.has(word[i+1]) : false;
      const next2 = word[i+2] ? v.has(word[i+2]) : false;
      if (curr && i < word.length - 2 && !next && next2) {
        result += syllable + '·';
        syllable = '';
      }
    }
    result += syllable;
    return result.replace(/·$/, '');
  }

  return { render };
})();

window.Dicionario = Dicionario;
