const { useState, useRef, useLayoutEffect } = React;
const { createRoot } = ReactDOM;

// All composition measurements are in the 1080 × 1350 artwork coordinate space.
const EDITORIAL = Object.freeze({
  width: 1080, height: 1350, margin: 86, grid: 12,
  titleLeading: 1.04,
  contentBottom: 1188, footerGap: 48
});
// Layout regions belong to the artwork, never to the device viewport.
const COMPOSITIONS = Object.freeze({
  cover: { left:86, top:252, width:908, bottom:984, max:142, min:118, support:44, supportWidth:570, gap:36 },
  split: { left:86, top:288, width:460, bottom:984, max:104, min:88, support:40, supportWidth:460, gap:36 },
  story: { left:122, top:780, width:836, bottom:1188, max:112, min:96, support:40, supportWidth:800, gap:24 },
  collage: { left:86, top:216, width:908, bottom:660, max:136, min:112, support:44, supportWidth:780, gap:36 },
  dessert: { left:86, top:816, width:908, bottom:1188, max:104, min:88, support:40, supportWidth:880, gap:24 },
  closing: { left:86, top:216, width:908, bottom:708, max:128, min:108, support:44, supportWidth:744, gap:36 }
});
const slides = [
  { label:'Capa', eyebrow:'PIEMONTE, À MESA', title:'O Piemonte\ntambém se conhece\nà mesa.',
    italic:'Se você gosta de pensar na viagem também pela comida, vem conhecer estes quatro sabores.',
    image:'turim-por-do-sol.jpg', type:'cover', detail:'4 SABORES PARA A SUA VIAGEM' },
  { label:'Bagna cauda', eyebrow:'01 / BAGNA CAUDA', title:'Vamos começar\npor aqui.',
    italic:'Legumes, alho e anchovas se encontram na bagna cauda. Já dá vontade de sentar à mesa.',
    image:'bagna-cauda.png', type:'split', detail:'ALHO, ANCHOVAS E LEGUMES' },
  { label:'Agnolotti', eyebrow:'02 / AGNOLOTTI DEL PLIN', title:'Esse beliscão\ntem nome.',
    italic:'Sabe o gesto de fechar a massa? É o plin, que dá nome ao agnolotti del plin.',
    image:'agnolotti-plin.png', type:'story', detail:'O GESTO QUE DÁ NOME À MASSA' },
  { label:'Tajarin', eyebrow:'03 / TAJARIN', title:'Reparou\nnessa cor?',
    italic:'É a quantidade de gemas que deixa o tajarin tão amarelo. Dá vontade de provar, né?',
    image:'tajarin.png', type:'collage', detail:'TAJARIN · PIEMONTE' },
  { label:'Bonet', eyebrow:'04 / BONET', title:'E pra terminar,\num bonet.',
    italic:'Se você deixou espaço pra sobremesa, aqui entram cacau, café e amaretti.',
    image:'bonet.png', type:'dessert', detail:'A SOBREMESA TAMBÉM ENTRA NO ROTEIRO' },
  { label:'Vamos conversar', eyebrow:'SUA PRÓXIMA VIAGEM', title:'Qual vai ser\na sua escolha?',
    italic:'Me conta qual você quer provar primeiro. A gente pode começar a pensar na viagem por aí.',
    type:'closing', detail:'BAGNA CAUDA / AGNOLOTTI / TAJARIN / BONET' }
];


function titleCandidates(text, measure, width) {
  const words = text.trim().split(/[ \n\t]+/);
  if (words.length > 40) return [];
  const preferred = new Set();
  let count = 0;
  text.split('\n').slice(0, -1).forEach(line => {
    count += line.trim().split(/[ \n\t]+/).length;
    preferred.add(count);
  });
  const candidates = [];
  for (let lineCount = 1; lineCount <= Math.min(4, words.length); lineCount++) {
    const memo = new Map();
    function solve(start, remaining) {
      if (!remaining) return start === words.length ? { cost: 0, lines: [] } : null;
      const key = start + ':' + remaining;
      if (memo.has(key)) return memo.get(key);
      let best = null;
      for (let end = start + 1; end <= words.length - remaining + 1; end++) {
        const line = words.slice(start, end).join(' ');
        const length = measure(line);
        if (length > width) break;
        const rest = solve(end, remaining - 1);
        if (!rest) continue;
        const weakEnd = /^(o|a|os|as|de|do|da|dos|das|e|em|no|na|para|que)$/i.test(words[end - 1]);
        const cost = rest.cost + Math.pow(1 - length / width, 2) * 40
          + (end < words.length && weakEnd ? 8 : 0)
          - (preferred.has(end) ? 10 : 0);
        if (!best || cost < best.cost) best = { cost, lines: [line, ...rest.lines] };
      }
      memo.set(key, best);
      return best;
    }
    const result = solve(0, lineCount);
    if (result) candidates.push({ ...result, cost: result.cost + Math.max(0, lineCount - 2) * 10 });
  }
  return candidates;
}

function Mark() {
  return <img className="mark" src="monograma-ouro.svg" alt="Monograma Renata Marzano"/>;
}

function Frame({ slide, index, total, onLayout }) {
  const articleRef = useRef(null);
  const [layout, setLayout] = useState(null);
  const [issue, setIssue] = useState('');
  const region = COMPOSITIONS[slide.type];
  useLayoutEffect(() => {
    let cancelled = false;
    setLayout(null);
    setIssue('');
    const article = articleRef.current;
    article.dataset.ready = 'false';
    async function compose() {
      await Promise.all([
        document.fonts.load('112px Advercase'),
        document.fonts.load('24px "DM Mono"'),
        document.fonts.ready
      ]);
      if (cancelled) return;
      const heading = article.querySelector('h1');
      const block = article.querySelector('.post-content');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = block.clientWidth;
      const fixedHeight = block.offsetHeight - heading.offsetHeight;
      const candidates = [];
      for (let size = region.max; size >= region.min; size -= 2) {
        context.font = size + 'px Advercase';
        const measure = line => context.measureText(line).width - Math.max(0, line.length - 1) * size * 0.025;
        for (const candidate of titleCandidates(slide.title, measure, width - 8)) {
          const height = candidate.lines.length * size * EDITORIAL.titleLeading + fixedHeight;
          if (height > region.bottom - region.top) continue;
          candidates.push({ ...candidate, size, height,
            cost: candidate.cost + (region.max - size) * 3 });
        }
      }
      candidates.sort((a, b) => a.cost - b.cost);
      const best = candidates[0];
      if (!best) {
        setIssue('O texto de “' + slide.label + '” precisa ser encurtado para manter a leitura e as margens.');
        article.dataset.ready = 'error';
        onLayout?.(index, false);
        return;
      }
      if (!cancelled) setLayout({ size: best.size, lines: best.lines, top: region.top });
    }
    compose().catch(() => {
      if (!cancelled) {
        setIssue('Não foi possível preparar as fontes. Recarregue a página.');
        article.dataset.ready = 'error';
        onLayout?.(index, false);
      }
    });
    return () => { cancelled = true; };
  }, [slide]);

  useLayoutEffect(() => {
    if (!layout) return;
    const article = articleRef.current;
    const heading = article.querySelector('h1');
    const block = article.querySelector('.post-content');
    const bottom = layout.top + block.offsetHeight;
    const valid = heading.scrollWidth <= heading.clientWidth + 1 &&
      bottom <= region.bottom + 1 &&
      [...heading.children].every(line => line.scrollWidth <= heading.clientWidth + 1);
    article.dataset.ready = valid ? 'true' : 'error';
    setIssue(valid ? '' : 'Revise o texto de “' + slide.label + '”: ele ultrapassa a área editorial.');
    onLayout?.(index, valid);
  }, [layout]);

  function Photo({ src, className, caption }) {
    return <figure className={className}>
      <div className="photo-fill" data-image={src} style={{ backgroundImage:'url("' + src + '")' }}/>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>;
  }
  return <article ref={articleRef} className={'post ' + slide.type} data-ready="false">
    {slide.type === 'cover' && <>
      <Photo src={slide.image} className="cover-landscape"/>
      <div className="cover-shade"/>
      <Photo src="agnolotti-plin.png" className="cover-postcard" caption="Um gostinho da viagem."/>
      <div className="cover-detail">{slide.detail}<span>CONTINUE POR AQUI →</span></div>
    </>}
    {slide.type === 'split' && <>
      <Photo src={slide.image} className="split-photo"/>
      <div className="split-number" aria-hidden="true">01</div>
      <div className="photo-label">{slide.detail}</div>
    </>}
    {slide.type === 'story' && <>
      <Photo src={slide.image} className="story-photo"/>
      <div className="story-shade"/><div className="story-panel"/>
      <div className="story-caption">{slide.detail}</div>
    </>}
    {slide.type === 'collage' && <>
      <Photo src={slide.image} className="collage-main" caption="Olha esse amarelo."/>
      <Photo src={slide.image} className="collage-detail" caption="Tajarin, de perto."/>
      <span className="collage-word" aria-hidden="true">a tavola.</span>
    </>}
    {slide.type === 'dessert' && <>
      <Photo src={slide.image} className="dessert-photo"/>
      <div className="dessert-detail">{slide.detail}</div>
    </>}
    {slide.type === 'closing' && <>
      <Photo src="bagna-cauda.png" className="closing-photo closing-one" caption="Pra começar."/>
      <Photo src="tajarin.png" className="closing-photo closing-two" caption="Mais um prato?"/>
      <Photo src="bonet.png" className="closing-photo closing-three" caption="E a sobremesa."/>
      <div className="closing-rule"><span>VAMOS CONVERSAR</span><span>↗</span></div>
    </>}
    <header><span className="eyebrow">{slide.eyebrow}</span><Mark/></header>
    <div className="post-content" style={{ top:region.top, left:region.left, width:region.width,
      '--support-size':region.support + 'px', '--support-width':region.supportWidth + 'px', '--text-gap':region.gap + 'px' }}>
      <h1 style={{ fontSize:layout ? layout.size : region.max }}>
        {layout ? layout.lines.map((line, i) => <span key={i}>{line}{i < layout.lines.length - 1 && ' '}</span>) : slide.title.replace(/\s+/g, ' ')}
      </h1>
      <p className="italic">{slide.italic}</p>
    </div>
    <footer><span>RENATA MARZANO</span><span>{String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}</span></footer>
    {issue && <div className="layout-warning" role="alert">{issue}</div>}
  </article>;
}

function Preview({ slide, index, total }) {
  const viewport = useRef(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const element = viewport.current;
    const resize = () => setScale(element.clientWidth / EDITORIAL.width);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className="preview" ref={viewport}>
    <div className="preview-art" style={{ transform: 'scale(' + scale + ')', visibility: scale ? 'visible' : 'hidden' }}>
      <Frame key={slide.label} slide={slide} index={index} total={total}/>
    </div>
  </div>;
}

async function waitForImages(root) {
  await Promise.all([...root.querySelectorAll('[data-image]')].map(element => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = () => reject(new Error('Uma fotografia não carregou. Recarregue a página.'));
    image.src = element.dataset.image;
  })));
  await Promise.all([...root.querySelectorAll('img')].map(async image => {
    if (!image.complete) await new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', reject, { once: true });
    });
    if (!image.naturalWidth) throw new Error('Uma imagem não carregou. Recarregue a página e tente novamente.');
    if (image.decode) await image.decode();
  }));
}

function App() {
  const [mode, setMode] = useState('carousel');
  const [current, setCurrent] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [ready, setReady] = useState({});
  const [error, setError] = useState('');
  const exportRef = useRef(null);
  const visible = mode === 'fixed' ? [slides[0]] : slides;
  const shownIndex = mode === 'fixed' ? 0 : current;
  const hasIssue = visible.some(slide => ready[slides.indexOf(slide)] === false);
  const allReady = visible.every((slide) => ready[slides.indexOf(slide)] === true);
  function onLayout(index, valid) {
    setReady(previous => previous[index] === valid ? previous : { ...previous, [index]: valid });
  }
  async function downloadAll() {
    setError('');
    if (!window.html2canvas || !window.JSZip) {
      setError('Não foi possível carregar a exportação. Recarregue a página e tente novamente.');
      return;
    }
    setDownloading(true);
    try {
      await document.fonts.ready;
      await waitForImages(exportRef.current);
      const zip = new JSZip();
      const pages = [...exportRef.current.querySelectorAll('.post')].slice(0, visible.length);
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].dataset.ready !== 'true') throw new Error('Revise o texto antes de exportar: uma página não cabe na área editorial.');
        const canvas = await window.html2canvas(pages[i], {
          scale: 1, width: EDITORIAL.width, height: EDITORIAL.height,
          useCORS: true, backgroundColor: null, windowWidth: 1440, windowHeight: 1800
        });
        const image = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!image) throw new Error('Não foi possível gerar a imagem. Tente novamente.');
        zip.file('renata-marzano-' + String(i + 1).padStart(2, '0') + '.png', image);
      }
      const archive = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(archive);
      link.href = url;
      link.download = mode === 'fixed' ? 'renata-marzano-post.zip' : 'renata-marzano-carrossel.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      setError(error.message || 'Falha ao exportar. Tente novamente.');
    } finally { setDownloading(false); }
  }
  return <div className="app-shell">
    <aside className="panel">
      <div className="brand"><img src="logo-vertical-ouro.svg" alt="Renata Marzano"/></div>
      <div><p className="label">FORMATO</p><div className="segmented">
        <button className={mode === 'fixed' ? 'active' : ''} onClick={() => {setMode('fixed'); setCurrent(0);}}>Post fixo</button>
        <button className={mode === 'carousel' ? 'active' : ''} onClick={() => setMode('carousel')}>Carrossel</button>
      </div></div>
      <div className="divider"/>
      <div className="template-list"><p className="label">ESTRUTURA</p>{slides.map((slide, i) =>
        <button key={slide.label} className={shownIndex === i ? 'selected' : ''} onClick={() => {setMode('carousel'); setCurrent(i);}}>
          <b>{String(i + 1).padStart(2, '0')}</b><span>{slide.label}</span>
        </button>)}</div>
      <p className="hint">Edite os textos em <code>main.jsx</code>. A composição preserva as margens e a hierarquia do carrossel.</p>
    </aside>
    <section className="workspace">
      <div className="workspace-top">
        <div><p className="label">TEMPLATE INSTAGRAM</p><h2>Itália fora do óbvio</h2></div>
        <div className="toolbar"><span className="format">1080 × 1350</span>
          <button className="download" onClick={downloadAll} disabled={downloading || !allReady}>
            {downloading ? 'PREPARANDO…' : !allReady ? (hasIssue ? 'REVISAR TEXTO' : 'AJUSTANDO…') : mode === 'fixed' ? '↓ BAIXAR POST' : '↓ BAIXAR CARROSSEL'}
          </button>
        </div>
      </div>
      {error && <p className="export-error" role="alert">{error}</p>}
      {Object.values(ready).some(value => value === false) && <p className="export-error" role="alert">Revise os textos antes de exportar: {slides.filter((_, i) => ready[i] === false).map(slide => slide.label).join(', ')}.</p>}
      <div className="canvas-area">
        <button className="nav prev" aria-label="Slide anterior" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={shownIndex === 0}>←</button>
        <Preview slide={visible[shownIndex]} index={shownIndex} total={visible.length}/>
        <button className="nav next" aria-label="Próximo slide" onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))} disabled={shownIndex === visible.length - 1}>→</button>
      </div>
      <div className="dots">{visible.map((_, i) => <button aria-label={'Slide ' + (i + 1)} aria-current={shownIndex === i ? 'true' : undefined} key={i} onClick={() => setCurrent(i)} className={shownIndex === i ? 'on' : ''}/>)}</div>
    </section>
    <div className="export-pages" ref={exportRef} aria-hidden="true">{slides.map((slide, i) =>
      <Frame key={slide.label} slide={slide} index={i} total={mode === 'fixed' ? 1 : slides.length} onLayout={onLayout}/>)}</div>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
