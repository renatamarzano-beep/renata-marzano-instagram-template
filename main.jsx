const { useState, useRef } = React;
const { createRoot } = ReactDOM;

const slides = [
  { label: 'Capa', eyebrow: 'PIEMONTE · ITÁLIA', title: '5 sabores para\nentender o Piemonte', italic: 'e não, não é só Barolo.', image: '/turim-por-do-sol.jpg', type: 'cover' },
  { label: 'Bagna cauda', eyebrow: '01 · ASTI E MONFERRATO', title: 'O ritual que\naquece a mesa.', italic: 'Legumes, alho e anchovas.', tape: 'bagna cauda', image: '/bagna-cauda.png', type: 'photo' },
  { label: 'Agnolotti', eyebrow: '02 · LANGHE', title: 'O beliscão\nque vira massa.', italic: '“Plin” é o gesto de fechar.', tape: 'agnolotti del plin', image: '/agnolotti-plin.png', type: 'photo' },
  { label: 'Tajarin', eyebrow: '03 · LANGHE', title: 'A massa mais\namarela daqui.', italic: 'Muitas gemas. Pouca pressa.', tape: 'tajarin', image: '/tajarin.png', type: 'photo' },
  { label: 'Bonet', eyebrow: '04 · UM DOCE PIEMONTÊS', title: 'O final que\nfecha o almoço.', italic: 'Cacau, café e amaretti.', tape: 'bonet', image: '/bonet.png', type: 'photo' },
  { label: 'Chamada final', eyebrow: 'VAMOS CONVERSAR?', title: 'Qual deles você\nprovaria primeiro?', italic: 'A gastronomia também faz parte do roteiro.', type: 'cta' },
];

function Mark(){ return <img className="mark" src="/monograma-ouro.svg" alt="Monograma Renata Marzano"/> }
function Frame({slide,index,total}){
  const plainTitle = slide.title.split('\n').map((line,i)=><span key={i}>{line}{i === 0 && <br/>}</span>);
  return <article className={`post ${slide.type}`}>
    {slide.image && <img className="post-image" src={slide.image} alt=""/>}
    <div className="wash"/>
    <header><span className="eyebrow">{slide.eyebrow}</span><Mark/></header>
    {slide.type === 'note' && <div className="passport"><span>RM</span><small>FEITO À MÃO</small></div>}
    <main>
      <span className="diamond" aria-hidden="true"/>
      <h1>{plainTitle}</h1>
      <p className="italic">{slide.italic}</p>
      {slide.type === 'cta' && <button>QUERO MEU ROTEIRO <span>→</span></button>}
    </main>
    {slide.type === 'photo' && <div className="tape">{slide.tape}</div>}
    <footer><span>RENATA MARZANO</span><span>{String(index + 1).padStart(2,'0')} — {String(total).padStart(2,'0')}</span></footer>
    {slide.type === 'note' && <div className="sketch"/>}
  </article>
}

function App(){
  const [mode,setMode] = useState('carousel');
  const [current,setCurrent] = useState(0);
  const [downloading,setDownloading] = useState(false);
  const exportRef = useRef(null);
  const visible = mode === 'fixed' ? [slides[0]] : slides;
  const shownIndex = mode === 'fixed' ? 0 : current;
  async function downloadAll(){
    if (!window.html2canvas || !window.JSZip) return;
    setDownloading(true);
    try {
      const zip = new JSZip();
      const pages = [...exportRef.current.querySelectorAll('.post')];
      for (let i = 0; i < pages.length; i += 1) {
        const canvas = await window.html2canvas(pages[i], { scale: 2.25, useCORS: true, backgroundColor: null });
        const image = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        zip.file(`renata-marzano-${String(i + 1).padStart(2, '0')}.png`, image);
      }
      const archive = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(archive);
      link.download = 'renata-marzano-carrossel.zip';
      link.click();
      URL.revokeObjectURL(link.href);
    } finally { setDownloading(false); }
  }
  return <div className="app-shell">
    <aside className="panel">
      <div className="brand"><img src="/logo-vertical-ouro.svg" alt="Renata Marzano"/></div>
      <div><p className="label">FORMATO</p><div className="segmented"><button className={mode==='fixed'?'active':''} onClick={()=>{setMode('fixed');setCurrent(0)}}>Post fixo</button><button className={mode==='carousel'?'active':''} onClick={()=>setMode('carousel')}>Carrossel</button></div></div>
      <div className="divider"/>
      <div className="template-list"><p className="label">ESTRUTURA</p>{slides.map((s,i)=><button key={s.eyebrow} className={shownIndex===i?'selected':''} onClick={()=>{setMode('carousel');setCurrent(i)}}><b>{String(i+1).padStart(2,'0')}</b><span>{s.label}</span></button>)}</div>
      <p className="hint">Edite os textos em <code>main.jsx</code>. O arquivo já nasce em 4:5, ideal para o feed.</p>
    </aside>
    <section className="workspace">
      <div className="workspace-top"><div><p className="label">TEMPLATE INSTAGRAM</p><h2>Itália fora do óbvio</h2></div><div className="toolbar"><span className="format">1080 × 1350</span><button className="download" onClick={downloadAll} disabled={downloading}>{downloading ? 'PREPARANDO…' : '↓ BAIXAR CARROSSEL'}</button></div></div>
      <div className="canvas-area">
        <button className="nav prev" onClick={()=>setCurrent(Math.max(0,current-1))} disabled={shownIndex===0}>←</button>
        <Frame slide={visible[shownIndex === current ? current : 0]} index={shownIndex} total={mode==='fixed'?1:slides.length}/>
        <button className="nav next" onClick={()=>setCurrent(Math.min(slides.length-1,current+1))} disabled={shownIndex===slides.length-1 || mode==='fixed'}>→</button>
      </div>
      <div className="dots">{visible.map((_,i)=><button aria-label={`Slide ${i+1}`} key={i} onClick={()=>setCurrent(i)} className={shownIndex===i?'on':''}/>)}</div>
    </section>
    <div className="export-pages" ref={exportRef} aria-hidden="true">{slides.map((slide,i)=><Frame key={slide.eyebrow} slide={slide} index={i} total={slides.length}/>)}</div>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
