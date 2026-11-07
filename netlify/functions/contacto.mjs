// Envío real mediante Netlify Function + Resend. No expone credenciales al navegador.
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const clean=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
export default async function handler(request){
 if(request.method!=='POST')return json(405,{error:'Método no permitido.'});
 if((Number(request.headers.get('content-length'))||0)>12000)return json(413,{error:'Mensaje demasiado largo.'});
 let body;try{body=await request.json()}catch{return json(400,{error:'Datos inválidos.'})}
 if(body.website)return json(200,{ok:true});
 const nombre=clean(body.nombre,120),correo=clean(body.correo,200),asunto=clean(body.asunto,100),mensaje=clean(body.mensaje,4000);
 if(nombre.length<2||!/^\S+@\S+\.\S+$/.test(correo)||asunto.length<2||mensaje.length<10)return json(400,{error:'Revisá los datos del formulario.'});
 const key=process.env.RESEND_API_KEY,from=process.env.FRONTERA_FROM_EMAIL;
 if(!key||!from)return json(503,{error:'El correo aún no está configurado por el administrador.'});
 const text=`Nombre: ${nombre}\nCorreo: ${correo}\nAsunto: ${asunto}\n\n${mensaje}`;
 try{
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from,to:['clubfronterarivera@gmail.com'],reply_to:correo,subject:'[Web Frontera] '+asunto.replace(/[\r\n]/g,' '),text})});
  if(!r.ok)return json(502,{error:'No fue posible enviar el mensaje. Intentá otra vez.'});
  return json(200,{ok:true});
 }catch{return json(502,{error:'No se pudo conectar con el servicio de correo.'})}
}
export const config={path:'/.netlify/functions/contacto'};
