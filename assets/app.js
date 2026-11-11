(()=>{
  'use strict';
  const by=(s)=>document.querySelector(s), all=(s)=>[...document.querySelectorAll(s)];
  const pt=document.documentElement.lang.toLowerCase().startsWith('pt');
  // Clean URLs when served by HTTP; file:// always navigates to index.html directly.
  if(location.protocol==='http:'||location.protocol==='https:') all('a[href]').forEach(a=>{
    const url=a.getAttribute('href');
    if(!url||url.startsWith('http')||url.startsWith('mailto:'))return;
    if(url==='index.html')a.setAttribute('href','./');
    else if(url.endsWith('/index.html'))a.setAttribute('href',url.slice(0,-10));
  });
  const toggle=by('#menuToggle'), menu=by('#mobileNav');
  function closeMenu(){menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label',pt?'Abrir menu':'Abrir menú')}
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?(pt?'Fechar menu':'Cerrar menú'):(pt?'Abrir menu':'Abrir menú'));menu?.classList.toggle('open',open)});
  all('#mobileNav a').forEach(a=>a.addEventListener('click',closeMenu));
  const darkBtns=all('[data-dark-toggle]');
  let isDark=false;try{isDark=localStorage.getItem('frontera-dark')==='true'}catch{}
  function renderDark(){document.body.classList.toggle('dark',isDark);darkBtns.forEach(btn=>{btn.setAttribute('aria-pressed',String(isDark));btn.setAttribute('aria-label',isDark?(pt?'Ativar modo claro':'Activar modo claro'):(pt?'Ativar modo escuro':'Activar modo oscuro'));const label=btn.querySelector('.dark-label');if(label)label.textContent=isDark?(pt?'Modo claro':'Modo claro'):(pt?'Modo escuro':'Modo oscuro');else if(btn.classList.contains('mobile-dark'))btn.textContent=isDark?(pt?'☀ Modo claro':'☀ Modo claro'):(pt?'◐ Modo escuro':'◐ Modo oscuro')})}
  renderDark();darkBtns.forEach(btn=>btn.addEventListener('click',()=>{isDark=!isDark;try{localStorage.setItem('frontera-dark',String(isDark))}catch{}renderDark()}));
  // Reveal only when JS is available; otherwise content remains visible.
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
    document.body.classList.add('motion');
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('shown');observer.unobserve(e.target)}}),{threshold:.08});
    all('.reveal').forEach(el=>observer.observe(el));
  }
  // Copy and WhatsApp share
  all('[data-copy-link]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);btn.textContent=pt?'Link copiado!':'¡Enlace copiado!'}catch{btn.textContent=pt?'Copie o endereço do navegador':'Copiá la dirección del navegador'}}));
  all('[data-whatsapp]').forEach(btn=>btn.addEventListener('click',()=>{const msg=encodeURIComponent((btn.dataset.whatsapp||document.title)+' '+location.href);open('https://wa.me/?text='+msg,'_blank','noopener,noreferrer')}));
  // Facebook post share: the proposed caption invites readers back to the full communiqué.
  all('[data-facebook-share]').forEach(btn=>btn.addEventListener('click',()=>{
    const target=new URL('https://www.facebook.com/sharer/sharer.php');
    target.searchParams.set('u',location.href);
    const title=btn.dataset.facebookTitle||document.title;
    target.searchParams.set('quote',pt?`${title} · Continue lendo no site do Frontera Rivera: ${location.href}`:`${title} · Seguí leyendo en la página web de Frontera Rivera: ${location.href}`);
    open(target.toString(),'_blank','noopener,noreferrer,width=680,height=720');
  }));
  // Gallery lightbox
  const dialog=by('#lightbox');
  all('[data-lightbox]').forEach(btn=>btn.addEventListener('click',()=>{
    const image=dialog?.querySelector('img');if(!image)return;
    const path=btn.dataset.lightbox;
    // Gallery page always sits one folder below the root.
    image.src=path.startsWith('/')?path:'/'+path;image.alt=btn.dataset.caption||'Fotografía ampliada';
    dialog.querySelector('p').textContent=btn.dataset.caption||'';
    if(dialog.showModal) dialog.showModal();else dialog.setAttribute('open','');
  }));
  by('#closeLightbox')?.addEventListener('click',()=>dialog?.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  // Formulario Frontera Rivera conectado a Formspree; GitHub Pages no ejecuta funciones Netlify.
  all('[data-contact-form]').forEach(form=>form.addEventListener('submit',async ev=>{
    ev.preventDefault();
    if(!form.reportValidity())return;
    const status=form.querySelector('.form-status'),button=form.querySelector('[type=submit]');
    const payload=new FormData(form);
    // Campo trampa contra bots; las personas no lo ven.
    if(payload.get('_gotcha'))return;
    button.disabled=true;
    button.textContent='Enviando…';
    status.textContent=pt?'Enviando sua mensagem…':'Enviando tu mensaje…';
    try{
      const res=await fetch(form.action,{
        method:'POST',
        body:payload,
        headers:{Accept:'application/json'}
      });
      const result=await res.json().catch(()=>({}));
      if(!res.ok){
        if(res.status===429)throw Error(pt?'Muitas mensagens em pouco tempo. Aguarde alguns minutos e tente novamente.':'Recibimos muchos mensajes en poco tiempo. Esperá unos minutos y volvé a intentar.');
        const firstError=Array.isArray(result.errors)?result.errors[0]?.message:null;
        throw Error(firstError||result.error||(pt?'Não foi possível enviar a mensagem. Tente novamente.':'No se pudo enviar el mensaje. Intentá nuevamente.'));
      }
      status.textContent=pt?'Mensagem enviada! Obrigado por escrever.':'¡Mensaje enviado! Gracias por escribirnos.';
      form.reset();
    }catch(err){
      status.textContent=(pt?'Não conseguimos enviar sua mensagem: ':'No pudimos enviar tu mensaje: ')+(err?.message||(pt?'erro de conexão.':'error de conexión.'))+(pt?' Você também pode escrever para clubfronterarivera@gmail.com.':' También podés escribirnos a clubfronterarivera@gmail.com.');
    }finally{
      button.disabled=false;
      button.textContent=pt?'Enviar mensagem ↗':'Enviar mensaje ↗';
    }
  }));


  // Vista ampliada de la camiseta: funciona con toque y teclado.
  const camisetaDialog=by('[data-camiseta-dialog]');
  by('[data-camiseta-view]')?.addEventListener('click',()=>{
    if(camisetaDialog?.showModal)camisetaDialog.showModal();
    else camisetaDialog?.setAttribute('open','');
  });
  by('[data-camiseta-close]')?.addEventListener('click',()=>camisetaDialog?.close());
  camisetaDialog?.addEventListener('click',ev=>{if(ev.target===camisetaDialog)camisetaDialog.close()});

  // Centro de partido: pestañas accesibles con toque y flechas de teclado.
  const matchTabs=all('[data-match-tab]');
  const matchPanels=all('[data-match-panel]');
  if(matchTabs.length && matchPanels.length){
    const activateMatchTab=(button,focus=false)=>{
      const key=button.dataset.matchTab;
      matchTabs.forEach(tab=>{
        const selected=tab===button;
        tab.setAttribute('aria-selected',selected?'true':'false');
        tab.tabIndex=selected?0:-1;
      });
      matchPanels.forEach(panel=>{panel.hidden=panel.dataset.matchPanel!==key;});
      if(focus)button.focus();
    };
    matchTabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>activateMatchTab(tab));
      tab.addEventListener('keydown',ev=>{
        let idx=index;
        if(ev.key==='ArrowRight')idx=(index+1)%matchTabs.length;
        else if(ev.key==='ArrowLeft')idx=(index+matchTabs.length-1)%matchTabs.length;
        else if(ev.key==='Home')idx=0;
        else if(ev.key==='End')idx=matchTabs.length-1;
        else return;
        ev.preventDefault();
        activateMatchTab(matchTabs[idx],true);
      });
    });
  }
})();
