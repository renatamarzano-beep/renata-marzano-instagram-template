# Template Instagram — Renata Marzano

Editor visual de carrosséis 4:5 (1080 × 1350), pronto para GitHub Pages. Ele funciona sem instalar Node: basta publicar esta pasta como site estático.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie todo o conteúdo desta pasta para a branch `main`.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione `main` e a pasta `/(root)`, depois salve.
5. O GitHub mostrará o endereço público após a publicação.

## Como editar o carrossel

Edite `main.jsx` para alterar os textos, a ordem, os títulos e as imagens de cada slide. As imagens e fontes do template ficam na raiz do repositório.

O botão **Baixar carrossel** exporta todos os slides em PNG (1080 × 1350) dentro de um arquivo ZIP.

## Direção de arte

- Cores, espaçamentos e logos da marca Renata Marzano;
- Títulos em Advercase e frases de apoio em San Francisco;
- Fotografias editoriais com luz quente e atmosfera artesanal;
- Margens laterais e quebras de texto ajustadas para leitura no feed.

## Sistema editorial

A arte é composta em uma prancheta fixa de **1080 × 1350 px**. A prévia apenas
aplica uma escala proporcional: regras de celular alteram a interface, não o desenho
do slide. As setas ficam abaixo da arte em telas pequenas.

### Grade e hierarquia

- Prancheta de 1080 × 1350 px, com margens-base de 86 px e largura útil de 908 px.
- A fotografia e elementos de colagem podem sangrar; os blocos de leitura têm áreas próprias e medidas.
- Títulos em Advercase, entrelinha de 104%, tracking de −0,025 em.
- Apoios em San Francisco do sistema Apple, com alternativas sem serifa; entrelinha de 130%.
- Rodapé a 86 px da base, em 22 px, mantendo a numeração comum à série.
- `COMPOSITIONS`, em `main.jsx`, define posição, largura, limite inferior, faixa de título e tamanho do apoio para cada layout.

| Composição | Título | Apoio | Distribuição |
|---|---|---|---|
| Capa / `cover` | 118–142 px | 44 px | Verde, paisagem à direita e uma fotografia menor com borda |
| Bagna cauda / `split` | 88–104 px | 40 px | Coluna de texto creme à esquerda e fotografia à direita |
| Agnolotti / `story` | 96–112 px | 40 px | Fotografia em página inteira e painel opaco para leitura |
| Tajarin / `collage` | 112–136 px | 44 px | Título no alto, espaço livre e duas fotografias com recortes diferentes |
| Bonet / `dessert` | 88–104 px | 40 px | Fundo café, fotografia horizontal e conclusão abaixo |
| Detalhe / `detail` | 88–108 px | 42 px | Fundo verde, explicação no alto e fotografia horizontal abaixo |
| Resumo / `summary` | 88–104 px | 34 px | Quatro escolhas com miniaturas e nomes em 52 px |
| Encerramento / `closing` | 108–128 px | 44 px | Pergunta, convite à conversa e três fotografias |

A direção se inspira na referência de carrossel enviada pelo usuário: alternância
entre páginas claras e escuras, fotografias com bordas de papel, hierarquia serifada
e composições variadas dentro da mesma identidade. Não utiliza a fonte manuscrita
da referência: a tipografia de apoio continua em San Francisco.

A sequência atual tem dez slides: capa, bagna cauda, modo de comer, agnolotti,
beliscão, tajarin, gemas, bonet, resumo das escolhas e convite à conversa.
Os ajustes `region` de cada slide refinam as medidas-base: colagens usam títulos
de 88–104 px e apoio de 40 px; a capa usa 104–128 px e o encerramento 88–112 px.

### Como funciona o ajuste

Após carregar as fontes, o código mede o texto com Canvas e a altura dos elementos
no DOM. Testa a faixa de título de cada composição, em passos de 2 px, com até quatro linhas.
Uma pontuação favorece títulos com presença e combina tamanho, ocupação das linhas, quebras preferidas e finais
de linha com palavras de ligação. As quebras `\n` em `slides` são preferências,
não travas que permitam cortar o texto.

As alternativas que não cabem são descartadas. A composição final também é
verificada no DOM. Se o conteúdo não couber dentro do limite de leitura, aparece
um aviso e a exportação é bloqueada. Não há redução ilimitada, reticências ou
corte de palavras para esconder excesso de texto.

A detecção de assunto principal das fotos **não é automática**. Revise a relação
entre texto e fotografia ao trocar as imagens. As áreas de texto e os recortes das fotos são decisões editoriais por composição,
não reconhecimento de imagem. Ao trocar conteúdo, revise também as colagens e
legendas fora do bloco principal; a validação automática mede título e apoio.

### Exportação e verificação

- PNGs de 1080 × 1350, escala 1, aguardando fontes e imagens.
- Fotografias usam fundo com recorte `cover`, compartilhado pela prévia e pelo PNG.
- Post fixo exporta somente a capa; carrossel exporta as dez páginas.
- Erros de carregamento/exportação aparecem na interface.
- Ao publicar CSS ou JSX, atualize seus parâmetros de versão no HTML para evitar cache.

Antes de aprovar novos textos, confira margens, quebras, contraste e rodapé na
prévia e em um PNG exportado. O sistema limita falhas geométricas; a revisão
editorial continua necessária para sentido, contraste e relação com a imagem.

## Voz e elaboração dos textos

Escreva como quem conversa com uma pessoa: português brasileiro natural, próximo
e fluido, com clareza e conhecimento do assunto. O leitor deve sentir que alguém
está lhe contando algo interessante, sem precisar decifrar uma frase de campanha.

### Regras de escrita

- Dirija-se a uma pessoa, usando “você” quando fizer sentido, sem repetir em toda frase.
- Prefira palavras familiares, verbos concretos e ordem direta.
- Conecte as ideias: cada frase deve continuar a anterior, e cada slide deve ajudar
  a conversa a avançar. Evite coleções de frases de efeito sem ligação.
- Varie o comprimento das frases para criar ritmo. Ser breve não significa cortar
  conectivos, eliminar verbos ou transformar tudo em fragmentos.
- Use “a gente” e “pra” quando soarem naturais à voz da marca, sem impor gírias,
  intimidade artificial ou informalidade em excesso.
- Explique termos locais ou técnicos no fluxo da conversa, sem soar como verbete.
- Prefira detalhes observáveis a adjetivos genéricos. Evite clichês como “experiência
  inesquecível”, “mergulhe nessa jornada” e “sabores que encantam”.
- Evite fórmulas repetitivas, perguntas retóricas em série e slogans como
  “Muitas gemas. Pouca pressa.” quando uma frase conectada comunica melhor.
- Faça convites e perguntas que tenham relação com o conteúdo, sem pressão de venda.
- Preserve a exatidão: o tom pessoal não autoriza inventar vivências da Renata,
  depoimentos, recomendações pessoais ou fatos.

### Aplicação ao carrossel

O título abre a conversa e o apoio acrescenta informação, em vez de repetir o título.
A sequência deve ter continuidade e cumprir o que a capa promete, inclusive em
listas e quantidades. Na conclusão, retome o assunto com uma pergunta ou um convite
que a pessoa consiga responder.

Escreva primeiro a ideia completa. Depois corte redundâncias para caber na grade,
preservando sentido e ritmo. Se não couber com boa leitura, reescreva ou distribua
o conteúdo entre slides; não sacrifique a voz para encaixar uma frase.

### Exemplos de direção de voz

Os exemplos abaixo ilustram o tom; não são substituições automáticas dos slides.

| Formulação fragmentada ou formal | Formulação mais falada |
|---|---|
| “Muitas gemas. Pouca pressa.” | “É a quantidade de gemas que dá essa cor ao tajarin.” |
| “Plin é o gesto de fechar.” | “Sabe o beliscão que fecha a massa? É daí que vem o nome plin.” |
| “A gastronomia também faz parte do roteiro.” | “Na hora de pensar na viagem, vale escolher também o que você quer provar.” |

Antes de aprovar, leia o conjunto em voz alta: eu diria isso assim para alguém?
As ideias se conectam? Há alguma frase que parece escrita só para impressionar?
O texto mantém informação concreta e continua confortável de ler no slide?

Esta é uma regra de criação e revisão editorial. O aplicativo verifica o espaço
ocupado pelo texto, mas não avalia automaticamente o tom de voz.

## Referências do conteúdo gastronômico

- [Bagna cauda — El Comidista](https://elpais.com/gastronomia/el-comidista/2024-11-25/bagna-cauda-una-receta-del-piamonte-perfecta-para-compartir.html)
- [Produtos e pratos do Piemonte — Italia.it](https://www.italia.it/it/piemonte/cosa-fare/prodotti-piatti-tipici-piemonte)
- [Turim — Italia.it](https://www.italia.it/it/piemonte/torino/guida-storia-curiosita)
