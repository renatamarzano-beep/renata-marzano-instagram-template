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
