// Local editing and portable project files. No photo or draft is sent to a server.
const PROJECT_FORMAT = 'renata-marzano-carousel';
const TEXT_FIELDS = { title:'Título', italic:'Texto de apoio', eyebrow:'Linha superior', detail:'Chamada da foto', caption:'Legenda da foto principal', detailCaption:'Legenda do detalhe', accent:'Palavra de destaque' };
function photoSlots(slide) {
  const slots = {
    cover:[['cover-landscape','Paisagem',slide.image],['cover-postcard','Foto pequena','agnolotti-plin.png','Um gostinho da viagem.']],
    split:[['split-photo','Foto principal',slide.image]], story:[['story-photo','Foto de fundo',slide.image]],
    collage:[['collage-main','Foto principal',slide.image],['collage-detail','Foto de detalhe',slide.image]],
    detail:[['detail-photo','Foto principal',slide.image]], dessert:[['dessert-photo','Foto principal',slide.image]],
    closing:[['closing-photo closing-one','Foto à esquerda','bagna-cauda.png','Pra começar.'],['closing-photo closing-two','Foto central','tajarin.png','Mais um prato?'],['closing-photo closing-three','Foto à direita','bonet.png','E a sobremesa.']],
    summary:(slide.choices || []).map((choice,i)=>['choice-'+i,'Foto da opção '+(i+1),choice.image])
  };
  return slots[slide.type] || [];
}
function projectData(items) { return {format:PROJECT_FORMAT,version:1,slides:items}; }
function validateProject(data, defaults) {
  if (!data || data.format !== PROJECT_FORMAT || data.version !== 1 || !Array.isArray(data.slides) || data.slides.length !== defaults.length) throw new Error('Escolha um arquivo de projeto deste editor, com dez slides.');
  return defaults.map((base,i)=> {
    const source=data.slides[i];
    if (!source || source.type !== base.type) throw new Error('A estrutura do projeto não corresponde a este modelo.');
    const result={...base,photos:{}};
    for (const key of Object.keys(TEXT_FIELDS)) if (key in base) {
      if (typeof source[key] !== 'string' || source[key].length>2000) throw new Error('O projeto contém um texto inválido.');
      result[key]=source[key];
    }
    if (base.choices) {
      if (!Array.isArray(source.choices) || source.choices.length!==base.choices.length) throw new Error('As opções do resumo estão incompletas.');
      result.choices=base.choices.map((choice,j)=> {
        const c=source.choices[j];
        if (!c || typeof c.taste!=='string' || typeof c.name!=='string' || c.taste.length>200 || c.name.length>200) throw new Error('Texto de opção inválido.');
        return {...choice,taste:c.taste,name:c.name};
      });
    }
    for (const [key] of photoSlots(base)) {
      const p=source.photos?.[key];
      if (!p) continue;
      if (p.src !== undefined && (typeof p.src!=='string' || p.src.length>12000000 || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.src))) throw new Error('Uma foto do projeto não é válida.');
      const photo={};
      if (p.src) photo.src=p.src;
      for (const [field,min,max] of [['x',0,100],['y',0,100],['zoom',1,3]]) if (p[field] !== undefined) {
        if (!Number.isFinite(p[field]) || p[field]<min || p[field]>max) throw new Error('Enquadramento inválido.');
        photo[field]=p[field];
      }
      if (p.caption !== undefined) {
        if (typeof p.caption!=='string' || p.caption.length>100) throw new Error('Legenda inválida.');
        photo.caption=p.caption;
      }
      result.photos[key]=photo;
    }
    return result;
  });
}
let draftDatabase;
function openDraftDB() {
  if (!draftDatabase) draftDatabase=new Promise((resolve,reject)=> {
    const request=indexedDB.open('renata-marzano-editor',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('drafts');
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('Armazenamento indisponível.'));
  });
  return draftDatabase;
}
async function readDraft() {
  const db=await openDraftDB();
  return new Promise((resolve,reject)=> {
    const r=db.transaction('drafts').objectStore('drafts').get('current');
    r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error);
  });
}
async function writeDraft(data) {
  const db=await openDraftDB();
  return new Promise((resolve,reject)=> {
    const tx=db.transaction('drafts','readwrite');
    tx.objectStore('drafts').put(data,'current');
    tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error);
  });
}
function saveFile(blob,name) {
  const url=URL.createObjectURL(blob), link=document.createElement('a');
  link.href=url; link.download=name; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
}
async function readPhoto(file) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Use uma foto JPG, PNG ou WebP. No iPhone, exporte HEIC como JPG.');
  if (file.size>20*1024*1024) throw new Error('Escolha uma foto de até 20 MB.');
  const url=URL.createObjectURL(file);
  try {
    const image=new Image(); image.src=url; await image.decode();
    if (!image.naturalWidth) throw new Error();
    const ratio=Math.min(1,2400/Math.max(image.naturalWidth,image.naturalHeight));
    const canvas=document.createElement('canvas'); canvas.width=Math.round(image.naturalWidth*ratio); canvas.height=Math.round(image.naturalHeight*ratio);
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',.92);
  } catch { throw new Error('Não foi possível abrir essa foto. Tente outro arquivo.'); }
  finally { URL.revokeObjectURL(url); }
}
function Editor({slide,index,onChange,disabled,onBusy}) {
  const [slot,setSlot]=React.useState(photoSlots(slide)[0]?.[0]);
  const [busy,setBusy]=React.useState(false), [message,setMessage]=React.useState('');
  const slots=photoSlots(slide), selected=slots.find(s=>s[0]===slot) || slots[0];
  const photo=slide.photos?.[selected?.[0]] || {};
  function editPhoto(patch) { onChange({photos:{...slide.photos,[selected[0]]:{...photo,...patch}}}); }
  return <section className="editor" aria-label="Editor do slide">
    <h3>Editar slide {String(index+1).padStart(2,'0')}</h3>
    <p className="editor-note">As mudanças aparecem na prévia. As margens e as fontes seguem o padrão da marca.</p>
    <fieldset disabled={disabled || busy}>
      <details open><summary>Textos</summary>
        {Object.entries(TEXT_FIELDS).filter(([key])=>key in slide).map(([key,label])=> <label key={key}>{label}<textarea aria-label={label} rows={key==='title'?3:key==='italic'?4:2} maxLength={key==='title'||key==='italic'?2000:100} value={slide[key]} onChange={e=>onChange({[key]:e.target.value})}/></label>)}
        {slide.choices?.map((choice,i)=><div className="choice-edit" key={i}><b>Opção {i+1}</b>{[['taste','Preferência'],['name','Nome do prato']].map(([key,label])=><label key={key}>{label}<input aria-label={label+" "+(i+1)} maxLength={200} value={choice[key]} onChange={e=>onChange({choices:slide.choices.map((c,j)=>j===i?{...c,[key]:e.target.value}:c)})}/></label>)}</div>)}
      </details>
      {selected && <details open><summary>Fotos e enquadramento</summary>
        <label>Foto para editar<select aria-label="Foto para editar" value={selected[0]} onChange={e=>{setSlot(e.target.value);setMessage('');}}>{slots.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
        <img className="editor-thumb" src={photo.src || selected[2]} alt="Foto selecionada"/>
        <label className="upload-label">Trocar foto<input type="file" accept="image/jpeg,image/png,image/webp" onChange={async e=> {
          const file=e.target.files[0];e.target.value='';if (!file) return;
          setBusy(true);onBusy(true);setMessage('Preparando foto…');
          try {const src=await readPhoto(file);editPhoto({src,x:50,y:50,zoom:1});setMessage('Foto atualizada.');} catch(error){setMessage(error.message);} finally{setBusy(false);onBusy(false);}
        }}/></label>
        {[['x','Posição horizontal',0,100,1,50],['y','Posição vertical',0,100,1,50],['zoom','Zoom',1,3,.05,1]].map(([key,label,min,max,step,value])=><label key={key}>{label}<input aria-label={label} type="range" min={min} max={max} step={step} value={photo[key]??value} onInput={e=>editPhoto({[key]:Number(e.target.value)})}/></label>)}
        {selected[3]!==undefined && <label>Legenda da foto<input maxLength={100} value={photo.caption??selected[3]} onChange={e=>editPhoto({caption:e.target.value})}/></label>}
        <button type="button" onClick={()=>{const photos={...slide.photos};delete photos[selected[0]];onChange({photos});}}>Restaurar foto original</button>
      </details>}
    </fieldset>
    {message && <p role="status">{message}</p>}
  </section>;
}
