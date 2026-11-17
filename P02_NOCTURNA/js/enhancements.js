(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const artists = {
    alex: {name:'ÁLEX VEGA', focus:'Blackwork y ornamental', style:'Blackwork', bio:'Composiciones de alto contraste, blackwork y piezas a medida.', image:'img/artistas/alex-vega.jpg', categories:['blackwork','ornamental']},
    mar: {name:'MAR RIVERA', focus:'Fine line y ornamental', style:'Fine line', bio:'Trazos finos, símbolos y diseños delicados de línea precisa.', image:'img/artistas/mar-rivera.jpg', categories:['ornamental','lettering']},
    dana:{name:'DANA ROCA', focus:'Realismo y lettering', style:'Realismo', bio:'Retratos, composiciones figurativas y propuestas personalizadas.', image:'img/artistas/dana-roca.jpg', categories:['realismo','black-red']}
  };
  let activeArtist = null;
  let previousFocus = null;
  const artistModal=$('#artist-modal');
  function closeArtist(){
    if (!artistModal.classList.contains('is-open')) return;
    artistModal.classList.remove('is-open');artistModal.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
    if(previousFocus) previousFocus.focus();
  }
  function openArtist(key, opener){
    const a=artists[key];if(!a)return;
    activeArtist=key;previousFocus=opener;
    $('#artist-modal-image').src=a.image;
    $('#artist-modal-image').alt='Retrato de '+a.name;
    $('#artist-modal-name').textContent=a.name;
    $('#artist-modal-focus').textContent=a.focus;
    $('#artist-modal-bio').textContent=a.bio;
    const related=$$('.work-card').filter(c=>a.categories.includes(c.dataset.category)).slice(0,3);
    const target=$('#artist-modal-works');target.replaceChildren();
    related.forEach(c=>{
      const img=$('img',c),label=$('h3',c),card=document.createElement('a');
      card.href='#trabajos';card.className='artist-work-link';
      const smallImg=document.createElement('img');smallImg.src=img.src;smallImg.alt=img.alt;
      const t=document.createElement('span');t.textContent=label.textContent.trim();
      card.append(smallImg,t);card.addEventListener('click',closeArtist);target.append(card);
    });
    artistModal.classList.add('is-open');artistModal.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');$('.artist-modal-close').focus();
  }
  $$('[data-artist-open]').forEach(el=>el.addEventListener('click',()=>openArtist(el.dataset.artistOpen,el)));
  $$('[data-artist-close]').forEach(el=>el.addEventListener('click',closeArtist));
  $('#artist-book').addEventListener('click',()=>{
    if(!activeArtist)return;
    const a=artists[activeArtist];
    // Normalize labels as entered in the select options.
    const option=$$('#booking-artist option').find(x=>x.textContent.trim().toUpperCase().startsWith(a.name));
    if(option) $('#booking-artist').value=option.value;
    $('#booking-style').value=a.style;
    closeArtist(); location.hash='cita';$('#booking-artist').focus();
  });
  function constrainDialog(event,root){
    if(event.key!=='Tab')return;
    const focusable=$$('button:not([hidden]),a[href],input:not([hidden])',root).filter(x=>x.getClientRects().length&&!x.disabled);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  document.addEventListener('keydown',event=>{
    if(!artistModal.classList.contains('is-open'))return;
    if(event.key==='Escape'){event.preventDefault();closeArtist()}
    constrainDialog(event,artistModal);
  });
  const photoModal=$('#art-modal'),photo=$('#modal-img'),zoomBtn=$('#modal-zoom');
  const resetZoom=()=>{if(photoModal.classList.contains('is-zoomed'))photoModal.classList.remove('is-zoomed');zoomBtn.setAttribute('aria-pressed','false');zoomBtn.textContent='AMPLIAR +'};
  const toggleZoom=()=>{
    const value=photoModal.classList.toggle('is-zoomed');
    zoomBtn.textContent=value?'ALEJAR −':'AMPLIAR +';zoomBtn.setAttribute('aria-pressed',String(value));
  };
  zoomBtn.addEventListener('click',toggleZoom);
  photo.addEventListener('click',toggleZoom);
  const photoObserver=new MutationObserver(()=>{if(!photoModal.classList.contains('is-open'))resetZoom()});
  photoObserver.observe(photoModal,{attributes:true,attributeFilter:['class']});
  new MutationObserver(resetZoom).observe(photo,{attributes:true,attributeFilter:['src']});
  const stepEls=$$('.booking-step'),stepLabel=$('#booking-step-label'),feedback=$('.form-feedback');
  const next=$('#booking-next'),back=$('#booking-back'),submit=$('#booking-submit'),form=$('#booking-form');
  let step=0;
  const fieldsByStep=[['booking-artist','booking-style','booking-idea'],['booking-name','booking-email','booking-date','booking-time'],['booking-consent']];
  const labels=['TU IDEA','CONTACTO Y FECHA','REVISIÓN'];
  const val=id=>($('#'+id).value||'').trim();
  const clean=s=>s.replace(/[<>]/g,'');
  function feedbackText(text){feedback.textContent=text||'';}
  const date=$('#booking-date');
  const current=new Date();
  const y=current.getFullYear(),m=String(current.getMonth()+1).padStart(2,'0'),d=String(current.getDate()).padStart(2,'0');
  date.min=`${y}-${m}-${d}`;
  function validStep(index){
    feedbackText('');
    for(const id of fieldsByStep[index]){
      const field=$('#'+id);
      if(!field.checkValidity()){
        field.reportValidity();feedbackText('Revisa los campos obligatorios antes de continuar.');return false;
      }
    }
    return true;
  }
  function previewData(){
    const file=$('#booking-reference').files[0];
    return [['Artista',val('booking-artist')],['Estilo',val('booking-style')],['Zona',val('booking-zone')],['Tamaño',val('booking-size')],['Idea',val('booking-idea')],['Nombre',val('booking-name')],['Email',val('booking-email')],['Fecha preferida',val('booking-date')],['Horario preferido',val('booking-time')],['Referencia',file?file.name:'Sin archivo']];
  }
  function updateReview(){
    const dest=$('#booking-review');dest.replaceChildren();
    previewData().forEach(([k,v])=>{const pair=document.createElement('div');const a=document.createElement('strong');a.textContent=k;const b=document.createElement('span');b.textContent=v;pair.append(a,b);dest.append(pair)});
  }
  function renderStep(){
    stepEls.forEach((el,i)=>el.hidden=i!==step);
    stepLabel.textContent=`PASO ${step+1} DE 3 · ${labels[step]}`;
    $('#booking-progress-bar').style.width=`${(step+1)*100/3}%`;
    back.hidden=step===0;next.hidden=step===2;submit.hidden=step!==2;
    if(step===2)updateReview();feedbackText('');
  }
  next.addEventListener('click',()=>{if(validStep(step)){step=Math.min(step+1,2);renderStep()}});
  back.addEventListener('click',()=>{step=Math.max(step-1,0);renderStep()});
  $('#booking-reference').addEventListener('change',function(){
    const file=this.files[0],info=$('#reference-info');
    if(!file){info.textContent='PNG, JPG o WEBP · máximo 5 MB';return}
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){
      this.value='';info.textContent='Solo imágenes PNG, JPG o WEBP de hasta 5 MB.';return;
    }
    info.textContent='Seleccionada: '+file.name+'';
  });
  const bookingIntro=$('#cita > div');
  const introTitle=bookingIntro.querySelector('h2');
  const introDescription=bookingIntro.querySelector('p');
  const originalTitle=introTitle.innerHTML;
  const originalDescription=introDescription.textContent;
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(step!==2||!validStep(2))return;
    const summary=$('#booking-success-details');
    summary.replaceChildren();
    const selected=[['Nombre',val('booking-name')],['Artista',val('booking-artist')],['Estilo',val('booking-style')],['Fecha preferida',val('booking-date')],['Horario',val('booking-time')]];
    selected.forEach(([label,value])=>{
      const pair=document.createElement('div');
      const caption=document.createElement('strong');caption.textContent=label;
      const data=document.createElement('span');data.textContent=value;
      pair.append(caption,data);summary.append(pair);
    });
    form.classList.add('is-complete');
    $('#booking-result').hidden=false;
    introTitle.innerHTML='GRACIAS POR<br><em>ELEGIR NOCTURNA.</em>';
    introDescription.textContent='Tu idea es el punto de partida. Nuestro equipo revisará los detalles de tu solicitud.';
    $('#booking-result').focus({preventScroll:true});
    $('#cita').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('#booking-reset').addEventListener('click',()=>{
    form.reset();form.classList.remove('is-complete');
    $('#booking-result').hidden=true;step=0;renderStep();
    introTitle.innerHTML=originalTitle;
    introDescription.textContent=originalDescription;
    $('#reference-info').textContent='PNG, JPG o WEBP · máximo 5 MB';
    $('#cita').scrollIntoView({behavior:'smooth',block:'start'});
  });
  renderStep();

})();
