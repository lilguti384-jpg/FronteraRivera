(()=>{
  'use strict';
  const by=(s)=>document.querySelector(s), all=(s)=>[...document.querySelectorAll(s)];
  // Clean URLs when served by HTTP; file:// always navigates to index.html directly.
  if(location.protocol==='http:'||location.protocol==='https:') all('a[href]').forEach(a=>{
    const url=a.getAttribute('href');
    if(!url||url.startsWith('http')||url.startsWith('mailto:'))return;
    if(url==='index.html')a.setAttribute('href','./');
    else if(url.endsWith('/index.html'))a.setAttribute('href',url.slice(0,-10));
  });
  const toggle=by('#menuToggle'), menu=by('#mobileNav');
  function closeMenu(){menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Abrir menú')}
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');menu?.classList.toggle('open',open)});
  all('#mobileNav a').forEach(a=>a.addEventListener('click',closeMenu));
  const darkBtns=all('[data-dark-toggle]');
  let isDark=false;try{isDark=localStorage.getItem('frontera-dark')==='true'}catch{}
  function renderDark(){document.body.classList.toggle('dark',isDark);darkBtns.forEach(btn=>{btn.setAttribute('aria-pressed',String(isDark));btn.setAttribute('aria-label',isDark?'Activar modo claro':'Activar modo oscuro');const label=btn.querySelector('.dark-label');if(label)label.textContent=isDark?'Modo claro':'Modo oscuro';else if(btn.classList.contains('mobile-dark'))btn.textContent=isDark?'☀ Modo claro':'◐ Modo oscuro'})}
  renderDark();darkBtns.forEach(btn=>btn.addEventListener('click',()=>{isDark=!isDark;try{localStorage.setItem('frontera-dark',String(isDark))}catch{}renderDark()}));
  // Reveal only when JS is available; otherwise content remains visible.
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
    document.body.classList.add('motion');
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('shown');observer.unobserve(e.target)}}),{threshold:.08});
    all('.reveal').forEach(el=>observer.observe(el));
  }
  // Copy and WhatsApp share
  all('[data-copy-link]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);btn.textContent='¡Enlace copiado!'}catch{btn.textContent='Copiá la dirección del navegador'}}));
  all('[data-whatsapp]').forEach(btn=>btn.addEventListener('click',()=>{const msg=encodeURIComponent((btn.dataset.whatsapp||document.title)+' '+location.href);open('https://wa.me/?text='+msg,'_blank','noopener,noreferrer')}));
  // Gallery lightbox
  const dialog=by('#lightbox');
  all('[data-lightbox]').forEach(btn=>btn.addEventListener('click',()=>{
    const image=dialog?.querySelector('img');if(!image)return;
    const path=btn.dataset.lightbox;
    // Gallery page always sits one folder below the root.
    image.src='../'+path;image.alt=btn.dataset.caption||'Fotografía ampliada';
    dialog.querySelector('p').textContent=btn.dataset.caption||'';
    if(dialog.showModal) dialog.showModal();else dialog.setAttribute('open','');
  }));
  by('#closeLightbox')?.addEventListener('click',()=>dialog?.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  // Contact form requires live Netlify function; never fake successful delivery.
  all('[data-contact-form]').forEach(form=>form.addEventListener('submit',async ev=>{
    ev.preventDefault();if(!form.reportValidity())return;
    const status=form.querySelector('.form-status'), button=form.querySelector('[type=submit]');
    const data=Object.fromEntries(new FormData(form));
    if(data.website){status.textContent='Gracias por escribirnos.';return}
    button.disabled=true;button.textContent='Enviando…';status.textContent='Intentando enviar el mensaje…';
    try{
      const res=await fetch('/.netlify/functions/contacto',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(result.error||'Todavía no está configurado el envío de correos.');
      status.textContent='¡Mensaje enviado! Gracias por escribirnos.';form.reset();
    }catch(err){status.textContent='No pudimos enviar el mensaje: '+(location.protocol==='file:'?'publicá la web y configurá el correo primero.':err.message)+' También podés escribir a clubfronterarivera@gmail.com.'}
    finally{button.disabled=false;button.textContent='Enviar mensaje ↗'}
  }));
})();
