(()=>{
 'use strict';
 const paper=document.querySelector('[data-bulletin]');if(!paper)return;
 const $=s=>document.querySelector(s),status=$('[data-bulletin-status]');
 const url=document.querySelector('link[rel="canonical"]').href;
 const title=$('[data-bulletin-title]').textContent.trim();
 const pt=document.documentElement.lang.toLowerCase().startsWith('pt');
 const download=$('[data-story-download]');
 let file,objectURL,building,format="story";
 async function copy(){try{await navigator.clipboard.writeText(url);status.textContent=pt?'Link copiado. No Instagram, cole-o no adesivo «Link».':'Enlace copiado. En Instagram, pegalo en el sticker «Enlace».'}catch{window.prompt(pt?'Copie o link:':'Copiá el enlace:',url)}}
 document.querySelectorAll('[data-bulletin-copy]').forEach(b=>b.addEventListener('click',copy));
 function wrap(ctx,text,width){const lines=[];for(const para of text.split(/\n+/)){let line='';for(const word of para.trim().split(/\s+/)){if(!word)continue;const candidate=line?line+' '+word:word;if(ctx.measureText(candidate).width<=width){line=candidate;continue}if(line)lines.push(line);line='';for(const char of word){if(ctx.measureText(line+char).width>width){lines.push(line);line=''}line+=char}}if(line)lines.push(line);lines.push('')}return lines.length?lines.slice(0,-1):[]}
 function drawLines(ctx,lines,x,y,lineHeight){lines.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight))}
 async function build(){
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#f2f2f2';ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#c41013';ctx.fillRect(0,0,540,18);ctx.fillStyle='#fec10e';ctx.fillRect(540,0,540,18);
  const logo=new Image();logo.src=$('[data-bulletin-logo]').src;await logo.decode();const scale=Math.min(108/logo.naturalWidth,120/logo.naturalHeight);ctx.drawImage(logo,90,110,logo.naturalWidth*scale,logo.naturalHeight*scale);
  await document.fonts.load('800 37px FuturaHv');ctx.fillStyle='#666';ctx.font='22px Arial';ctx.textAlign='right';ctx.fillText(paper.querySelector('time').textContent.trim(),990,180);ctx.textAlign='left';ctx.fillStyle='#c41013';
  ctx.font='800 40px FuturaHv';let titles=wrap(ctx,title,900);if(titles.length>3){titles=titles.slice(0,3);titles[2]=titles[2].slice(0,-2)+'…'}drawLines(ctx,titles,90,310,50);
  let y=310+titles.length*50+35;
  ctx.fillStyle='#3e3e3e';ctx.font='29px Arial';
  const content=$('[data-bulletin-body]');
  const text=[...content.children].map(el=>{if(el.tagName==='OL'||el.tagName==='UL')return [...el.children].map((li,i)=>(el.tagName==='OL'?(i+1)+'. ':'• ')+li.innerText.trim()).join('\n');return el.innerText.trim()}).filter(Boolean).join('\n\n');
  const lines=wrap(ctx,text,900),maxLines=Math.max(1,Math.floor((985-y)/42));const truncated=lines.length>maxLines;let visible=lines.slice(0,maxLines);if(truncated){let last=visible.length-1;while(last>0&&!visible[last])last--;visible=visible.slice(0,last+1);while(ctx.measureText(visible[last]+'…').width>900)visible[last]=visible[last].slice(0,-1);visible[last]+='…'}drawLines(ctx,visible,90,y,42);
  ctx.fillStyle='#b70f12';ctx.font='bold 25px Arial';const signature=wrap(ctx,$('[data-bulletin-signature]').textContent.trim(),900).slice(0,2);drawLines(ctx,signature,90,1035,32);
  ctx.fillStyle='#c41013';ctx.beginPath();ctx.roundRect(90,1140,900,78,24);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 29px Arial';ctx.textAlign='center';ctx.fillText(pt?'Comunicado completo em fronterarivera.uy':'Comunicado completo en fronterarivera.uy',540,1189);ctx.fillStyle='#555';ctx.font='22px Arial';ctx.fillText('',540,1270);
  ctx.fillStyle='#c41013';ctx.fillRect(0,1332,540,18);ctx.fillStyle='#fec10e';ctx.fillRect(540,1332,540,18);
  let output=canvas;if(format==='story'){output=document.createElement('canvas');output.width=1080;output.height=1920;const sc=output.getContext('2d');sc.fillStyle='#c41013';sc.fillRect(0,0,1080,1920);const background=new Image();background.src='/assets/img/fondo.jpeg';await background.decode();const zoom=Math.max(1080/background.naturalWidth,1920/background.naturalHeight);const bw=background.naturalWidth*zoom,bh=background.naturalHeight*zoom;sc.drawImage(background,(1080-bw)/2,(1920-bh)/2,bw,bh);sc.save();sc.beginPath();sc.roundRect(54,352,972,1215,32);sc.clip();sc.drawImage(canvas,54,352,972,1215);sc.restore()}const blob=await new Promise(resolve=>output.toBlob(resolve,'image/png'));if(!blob)throw Error('No se pudo generar la imagen');file=new File([blob],'frontera-comunicado-'+paper.querySelector('time').dateTime+'.png',{type:'image/png'});if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(blob);
 }

 const instagram=$('[data-instagram-share]');
 async function downloadReady(){if(!file)await build();const a=document.createElement('a');a.href=objectURL;a.download=file.name;document.body.append(a);a.click();a.remove()}
 download.addEventListener('click',async()=>{download.disabled=true;status.textContent=pt?'Preparando imagem…':'Preparando imagen…';try{await downloadReady();status.textContent=pt?'Imagem pronta para publicar no Instagram.':'Imagen lista para subir a una historia o publicación de Instagram.'}catch(error){status.textContent=(pt?'Falha ao gerar a imagem: ':'Error al generar la imagen: ')+(error.message||String(error))}finally{download.disabled=false}});
 instagram.addEventListener('click',async()=>{instagram.disabled=true;status.textContent=pt?'Preparando para compartilhar…':'Preparando para compartir…';try{if(!file)await build();if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:title});status.textContent=pt?'Escolha Instagram no menu de compartilhamento.':'Elegí Instagram en el menú para compartir.'}else{await downloadReady();status.textContent=pt?'Imagem baixada. Abra o Instagram e escolha Story ou publicação.':'Imagen descargada. Abrí Instagram y elegí Historia o Publicación.'}}catch(error){if(error.name==='AbortError'){status.textContent=pt?'Compartilhamento cancelado.':'Se canceló el menú para compartir.'}else{try{await downloadReady();status.textContent=pt?'Imagem baixada. Publique-a pelo aplicativo Instagram.':'Imagen descargada. Subila desde la aplicación de Instagram.'}catch(fallbackError){status.textContent=(pt?'Falha ao gerar a imagem: ':'Error al generar la imagen: ')+(fallbackError.message||String(fallbackError))}}}finally{instagram.disabled=false}});
})();