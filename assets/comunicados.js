(()=>{
 'use strict';
 const paper=document.querySelector('[data-bulletin]');if(!paper)return;
 const $=s=>document.querySelector(s),status=$('[data-bulletin-status]');
 const url=document.querySelector('link[rel="canonical"]').href;
 const title=$('[data-bulletin-title]').textContent.trim();
 const pt=document.documentElement.lang.toLowerCase().startsWith('pt');
 const panel=$('#story-panel'),preview=$('[data-story-preview]'),download=$('[data-story-download]'),share=$('[data-story-share]');
 let file,objectURL,building;
 async function copy(){try{await navigator.clipboard.writeText(url);status.textContent=pt?'Link copiado. No Instagram, cole-o no adesivo «Link».':'Enlace copiado. En Instagram, pegalo en el sticker «Enlace».'}catch{panel.hidden=false;openButton.setAttribute('aria-expanded','true');const input=$('[data-bulletin-url]');input.focus();input.select();status.textContent=pt?'Selecione e copie o link abaixo.':'Seleccioná y copiá el enlace que aparece abajo.'}}
 document.querySelectorAll('[data-bulletin-copy]').forEach(b=>b.addEventListener('click',copy));
 function wrap(ctx,text,width){const lines=[];for(const para of text.split(/\n+/)){let line='';for(const word of para.trim().split(/\s+/)){if(!word)continue;const candidate=line?line+' '+word:word;if(ctx.measureText(candidate).width<=width){line=candidate;continue}if(line)lines.push(line);line='';for(const char of word){if(ctx.measureText(line+char).width>width){lines.push(line);line=''}line+=char}}if(line)lines.push(line);lines.push('')}return lines.length?lines.slice(0,-1):[]}
 function drawLines(ctx,lines,x,y,lineHeight){lines.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight))}
 async function build(){
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#c41013';ctx.fillRect(0,0,540,18);ctx.fillStyle='#fec10e';ctx.fillRect(540,0,540,18);
  const logo=new Image();logo.src=$('[data-bulletin-logo]').src;await logo.decode();const scale=Math.min(108/logo.naturalWidth,120/logo.naturalHeight);ctx.drawImage(logo,90,110,logo.naturalWidth*scale,logo.naturalHeight*scale);
  ctx.fillStyle='#252525';await document.fonts.load('800 37px FuturaHv');ctx.font='800 37px FuturaHv';ctx.fillText('FRONTERA RIVERA',225,145);ctx.font='20px Arial';ctx.fillText(pt?'FUTEBOL CLUBE':'FÚTBOL CLUB',225,183);
  ctx.fillStyle='#666';ctx.font='24px Arial';ctx.fillText(paper.querySelector('time').textContent.trim(),90,265);
  ctx.fillStyle='#b70f12';ctx.font='bold 23px Arial';ctx.fillText(pt?'COMUNICADO OFICIAL':'COMUNICADO OFICIAL',90,325);
  ctx.font='800 54px FuturaHv';let titles=wrap(ctx,title,900);if(titles.length>3){titles=titles.slice(0,3);titles[2]=titles[2].slice(0,-2)+'…'}drawLines(ctx,titles,90,405,63);
  let y=405+titles.length*63+28;
  ctx.fillStyle='#3e3e3e';ctx.font='29px Arial';
  const content=$('[data-bulletin-body]');
  const text=[...content.children].map(el=>{if(el.tagName==='OL'||el.tagName==='UL')return [...el.children].map((li,i)=>(el.tagName==='OL'?(i+1)+'. ':'• ')+li.innerText.trim()).join('\n');return el.innerText.trim()}).filter(Boolean).join('\n\n');
  const lines=wrap(ctx,text,900),maxLines=Math.max(1,Math.floor((985-y)/42));const truncated=lines.length>maxLines;let visible=lines.slice(0,maxLines);if(truncated){let last=visible.length-1;while(last>0&&!visible[last])last--;visible=visible.slice(0,last+1);while(ctx.measureText(visible[last]+'…').width>900)visible[last]=visible[last].slice(0,-1);visible[last]+='…'}drawLines(ctx,visible,90,y,42);
  ctx.fillStyle='#b70f12';ctx.font='bold 25px Arial';const signature=wrap(ctx,$('[data-bulletin-signature]').textContent.trim(),900).slice(0,2);drawLines(ctx,signature,90,1035,32);
  ctx.fillStyle='#c41013';ctx.fillRect(90,1140,900,78);ctx.fillStyle='#fff';ctx.font='bold 29px Arial';ctx.textAlign='center';ctx.fillText(truncated?(pt?'CONTINUE LENDO NO SITE':'SEGUIR LEYENDO EN LA WEB'):(pt?'LEIA E COMPARTILHE NO SITE':'LEÉ Y COMPARTÍ EN LA WEB'),540,1189);ctx.fillStyle='#555';ctx.font='22px Arial';ctx.fillText('fronterarivera.com',540,1270);
  ctx.fillStyle='#c41013';ctx.fillRect(0,1332,540,18);ctx.fillStyle='#fec10e';ctx.fillRect(540,1332,540,18);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('No se pudo generar la imagen');file=new File([blob],'frontera-comunicado-'+paper.querySelector('time').dateTime+'.png',{type:'image/png'});objectURL=URL.createObjectURL(blob);preview.src=objectURL;preview.hidden=false;download.disabled=false;share.hidden=!(navigator.canShare&&navigator.canShare({files:[file]}));
 }
 const openButton=$('[data-story-open]');openButton.addEventListener('click',async()=>{panel.hidden=!panel.hidden;openButton.setAttribute('aria-expanded',String(!panel.hidden));if(panel.hidden||file)return;status.textContent=pt?'Preparando a imagem para o Instagram…':'Preparando la imagen para Instagram…';try{if(!building)building=build();await building;status.textContent=pt?'Imagem pronta. Baixe-a e adicione o link ao publicá-la no Instagram.':'Imagen lista. Descargala y agregá el enlace al subirla a Instagram.'}catch{building=null;status.textContent=pt?'Não foi possível preparar a imagem. Verifique sua conexão e tente novamente.':'No se pudo preparar la imagen. Revisá tu conexión y volvé a intentarlo.'}});
 download.addEventListener('click',()=>{if(!file)return;const a=document.createElement('a');a.href=objectURL;a.download=file.name;document.body.append(a);a.click();a.remove()});
 share.addEventListener('click',async()=>{if(!file)return;try{await navigator.share({files:[file]});status.textContent=pt?'Adicione o link do comunicado ao adesivo «Link» do story.':'Agregá el enlace al comunicado en el sticker «Enlace» de tu historia.'}catch(e){if(e.name!=='AbortError')status.textContent=pt?'Não foi possível compartilhar. Você pode baixar a imagem e publicá-la pelo Instagram.':'No se pudo compartir. Podés descargar la imagen y subirla desde Instagram.'}});
})();
