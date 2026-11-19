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

- Margens laterais e superior/inferior: 86 px; largura útil: 908 px.
- Unidade de espaçamento e alinhamento vertical: 12 px.
- Títulos em Advercase: 88–112 px, entrelinha de 104%, tracking de −0,025 em.
- Apoios em San Francisco do sistema Apple, com alternativas sem serifa: 48 px,
  entrelinha de 125%, distância de 36 px do título.
- Rodapé: 24 px, entrelinha de 28 px, a 86 px da borda inferior.
- Conteúdo termina até y=1188, deixando ao menos 48 px antes do rodapé.
- Capa começa preferencialmente em y=480; chamada final em y=444.
  Blocos grandes podem subir, respeitando y=300.
- Slides de fotografia ancoram o conteúdo acima da área segura do rodapé,
  mantendo seu início a partir de y=480. Etiquetas ocupam a faixa em y=324.

### Como funciona o ajuste

Após carregar as fontes, o código mede o texto com Canvas e a altura dos elementos
no DOM. Testa títulos de 112 a 88 px, em passos de 2 px, com até quatro linhas.
Uma pontuação combina tamanho, ocupação das linhas, quebras preferidas e finais
de linha com palavras de ligação. As quebras `\n` em `slides` são preferências,
não travas que permitam cortar o texto.

As alternativas que não cabem são descartadas. A composição final também é
verificada no DOM. Se o conteúdo não couber dentro do limite de leitura, aparece
um aviso e a exportação é bloqueada. Não há redução ilimitada, reticências ou
corte de palavras para esconder excesso de texto.

A detecção de assunto principal das fotos **não é automática**. Revise a relação
entre texto e fotografia ao trocar as imagens. As faixas verticais são decisões
editoriais por tipo de slide, não reconhecimento de imagem.

### Exportação e verificação

- PNGs de 1080 × 1350, escala 1, aguardando fontes e imagens.
- Fotografias usam fundo com recorte `cover`, compartilhado pela prévia e pelo PNG.
- Post fixo exporta somente a capa; carrossel exporta as seis páginas.
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
