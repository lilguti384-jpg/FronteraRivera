(()=>{
 'use strict';
 const paper=document.querySelector('[data-bulletin]');if(!paper)return;
 const $=s=>document.querySelector(s),status=$('[data-bulletin-status]');
 const url=document.querySelector('link[rel="canonical"]').href;
 const title=$('[data-bulletin-title]').textContent.trim();
 const panel=$('#story-panel'),preview=$('[data-story-preview]'),download=$('[data-story-download]'),share=$('[data-story-share]');
 const openButton=$('[data-story-open]');
 const TITLE_FONT="'FUTURAHV','Futura','Trebuchet MS',Arial,sans-serif";
 const W=1080,H=1350; // Publicación de Instagram 4:5
 let file,objectURL,building;

 async function copy(){try{await navigator.clipboard.writeText(url);status.textContent='Enlace copiado.'}catch{panel.hidden=false;openButton.setAttribute('aria-expanded','true');const input=$('[data-bulletin-url]');input.focus();input.select();status.textContent='Seleccioná y copiá el enlace que aparece abajo.'}}
 document.querySelectorAll('[data-bulletin-copy]').forEach(b=>b.addEventListener('click',copy));

 // Facebook: comparte el enlace como publicación (vista previa con título, descripción e imagen del comunicado)
 const fb=$('[data-facebook]');
 if(fb)fb.addEventListener('click',()=>{
  const quote=title+' — Seguir leyendo en la página web de Frontera Rivera.';
  const shareUrl='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&quote='+encodeURIComponent(quote);
  const w=window.open(shareUrl,'facebook-share','noopener,noreferrer,width=640,height=640');
  if(!w)location.href=shareUrl;
  status.textContent='Se abrió Facebook con el enlace. La publicación dirá «Seguir leyendo en la página web».';
 });

 function wrap(ctx,text,width){const lines=[];for(const para of text.split(/\n+/)){let line='';for(const word of para.trim().split(/\s+/)){if(!word)continue;const candidate=line?line+' '+word:word;if(ctx.measureText(candidate).width<=width){line=candidate;continue}if(line)lines.push(line);line='';for(const char of word){if(ctx.measureText(line+char).width>width){lines.push(line);line=''}line+=char}}if(line)lines.push(line);lines.push('')}return lines.length?lines.slice(0,-1):[]}
 function drawLines(ctx,lines,x,y,lineHeight){lines.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight))}

 async function build(){
  try{await document.fonts.load("52px 'FUTURAHV'");await document.fonts.ready}catch{}
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');
  ctx.textAlign='left';ctx.textBaseline='alphabetic';
  // fondo y franjas
  ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#c41013';ctx.fillRect(0,0,W/2,18);ctx.fillStyle='#fec10e';ctx.fillRect(W/2,0,W/2,18);
  // membrete
  const logo=new Image();logo.src=$('[data-bulletin-logo]').src;await logo.decode();const scale=Math.min(108/logo.naturalWidth,120/logo.naturalHeight);ctx.drawImage(logo,90,66,logo.naturalWidth*scale,logo.naturalHeight*scale);
  ctx.fillStyle='#252525';ctx.font='bold 28px Arial';ctx.fillText('FRONTERA RIVERA',225,112);ctx.font='20px Arial';ctx.fillText('FÚTBOL CLUB',225,148);
  ctx.fillStyle='#666';ctx.font='24px Arial';ctx.fillText(paper.querySelector('time').textContent.trim(),90,246);
  ctx.fillStyle='#b70f12';ctx.font='bold 23px Arial';ctx.fillText('COMUNICADO OFICIAL',90,298);
  // título en FUTURAHV (máx. 3 líneas)
  ctx.fillStyle='#b70f12';ctx.font='50px '+TITLE_FONT;let titles=wrap(ctx,title,900);if(titles.length>3){titles=titles.slice(0,3);let t=titles[2];while(ctx.measureText(t+'…').width>900)t=t.slice(0,-1);titles[2]=t.trimEnd()+'…'}drawLines(ctx,titles,90,372,60);
  const y=372+(titles.length-1)*60+56;
  // cuerpo
  ctx.fillStyle='#3e3e3e';ctx.font='30px Arial';
  const content=$('[data-bulletin-body]');
  const text=[...content.children].map(el=>{if(el.tagName==='OL'||el.tagName==='UL')return [...el.children].map((li,i)=>(el.tagName==='OL'?(i+1)+'. ':'• ')+li.innerText.trim()).join('\n');return el.innerText.trim()}).filter(Boolean).join('\n\n');
  const lh=43,bodyBottom=1050;
  const lines=wrap(ctx,text,900),maxLines=Math.max(1,Math.floor((bodyBottom-y)/lh));const truncated=lines.length>maxLines;let visible=lines.slice(0,maxLines);if(truncated){let last=visible.length-1;while(last>0&&!visible[last])last--;visible=visible.slice(0,last+1);while(ctx.measureText(visible[last]+'…').width>900)visible[last]=visible[last].slice(0,-1);visible[last]+='…'}drawLines(ctx,visible,90,y,lh);
  // firma
  ctx.fillStyle='#b70f12';ctx.font='bold 27px Arial';const signature=wrap(ctx,$('[data-bulletin-signature]').textContent.trim(),900).slice(0,1);drawLines(ctx,signature,90,1100,34);
  // llamada a la acción
  ctx.fillStyle='#c41013';ctx.fillRect(90,1140,900,84);ctx.fillStyle='#fff';ctx.font='bold 31px Arial';ctx.textAlign='center';ctx.fillText(truncated?'SEGUIR LEYENDO EN LA WEB':'LEÉ Y COMPARTÍ EN LA WEB',W/2,1194);
  ctx.fillStyle='#555';ctx.font='24px Arial';ctx.fillText('fronterarivera.com',W/2,1272);
  ctx.fillStyle='#c41013';ctx.fillRect(0,H-18,W/2,18);ctx.fillStyle='#fec10e';ctx.fillRect(W/2,H-18,W/2,18);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('No se pudo generar la imagen');file=new File([blob],'frontera-comunicado-'+paper.querySelector('time').dateTime+'-1080x1350.png',{type:'image/png'});objectURL=URL.createObjectURL(blob);preview.src=objectURL;preview.hidden=false;download.disabled=false;share.hidden=!(navigator.canShare&&navigator.canShare({files:[file]}));
 }

 openButton.addEventListener('click',async()=>{panel.hidden=!panel.hidden;openButton.setAttribute('aria-expanded',String(!panel.hidden));if(panel.hidden||file)return;status.textContent='Preparando la imagen para tu publicación…';try{if(!building)building=build();await building;status.textContent='Imagen lista (1080 × 1350 px). Descargala y subila como publicación de Instagram.'}catch{building=null;status.textContent='No se pudo preparar la imagen. Revisá tu conexión y volvé a intentarlo.'}});
 download.addEventListener('click',()=>{if(!file)return;const a=document.createElement('a');a.href=objectURL;a.download=file.name;document.body.append(a);a.click();a.remove()});
 share.addEventListener('click',async()=>{if(!file)return;try{await navigator.share({files:[file]});status.textContent='Agregá el enlace al comunicado en la descripción de tu publicación.'}catch(e){if(e.name!=='AbortError')status.textContent='No se pudo compartir. Podés descargar la imagen y subirla desde Instagram.'}});
})();
