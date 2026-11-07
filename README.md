# Frontera Rivera — sitio web completo

Este ZIP **sí contiene la web completa** y puede publicarse directamente en Netlify: `index.html` está en la raíz, junto a las carpetas de las páginas, `assets/`, `contenido/`, `netlify/` y `netlify.toml`.

## Ver en Windows sin publicar

1. Extraé el ZIP entero.
2. Entrá en `Frontera_Rivera_SITIO_COMPLETO` si al extraer aparece una carpeta con ese nombre.
3. Abrí **`index.html`**, el de la raíz.
4. Todos los enlaces apuntan a los `index.html` correspondientes, de modo que funcionan también abriendo archivos locales directamente (Chrome y otros navegadores).

## Ver en celular o publicar en Netlify

1. Extraé el ZIP.
2. En Netlify Drop, arrastrá la carpeta extraída cuyo primer nivel contiene `index.html`, `assets`, `historia`, `galeria`, etc. No subas solo `index.html`.
3. Netlify generará un enlace `.netlify.app` que se puede abrir en el celular.
4. Antes del lanzamiento definitivo, vinculá este proyecto con GitHub para hacer despliegues automáticos.

## Qué contiene

- `index.html` — Inicio (foto horizontal 2024 de Joaquín Duarte, foto de la hinchada junto a la cita del padre Silva, tres escudos en tamaños iguales, destacados, artículos, galería y mascota).
- `historia/index.html` — historia y cronología.
- `historia/homenajes/index.html` — cinco fichas de homenaje, incluida la foto de **Walter Silva Godoy solo en Homenajes**.
- `historia/homenajes/<nombre>/index.html` — página individual para cada persona.
- `articulos/index.html` — catálogo de artículos.
- `articulos/la-cuaro/index.html` — poema completo de Roberto Araujo.
- `articulos/ascenso-1998/index.html` — crónica del ascenso.
- `articulos/el-santo-de-rivera/index.html` — texto de Facundo y la imagen completa del padre Silva en marco horizontal.
- `galeria/index.html` — fotografías íntegras con 5 nuevas incorporaciones: NACIONAL, PEÑAROL, LA LOCA, JUGADORES y ASCENSO FESTEJOS, más las anteriores.
- `musica/index.html` — cuatro canciones con reproductor real, sin reproducción automática.
- `frontera-tv/index.html` — video de YouTube del ascenso y la caravana.
- `contacto/index.html` — formulario preparado para enviar a `clubfronterarivera@gmail.com`.
- `assets/styles.css`, `assets/app.js` — estilos responsive, modo oscuro, navegación, animaciones y galería ampliable.
- `contenido/colecciones.json` — un índice de recursos para facilitar un panel de administración futuro.

## Tipografías: Albertus Nova

- `font-family` en títulos prioriza **Albertus Nova**, con fallback **Cinzel**.
- **No se incluyen archivos de Albertus Nova**, porque su licencia web tiene que estar confirmada. Los visitantes que no la tengan instalada verán Cinzel, hasta que se incorporen los archivos de fuente legalmente autorizados.
- Se utilizan Satoshi (Fontshare) para el texto y Cormorant Garamond (Google Fonts) para detalles editoriales, ambos cargados externamente.
- Cuando tengas licencia de web-font para Albertus Nova, incorporá los `.woff2` autorizados a `assets/fonts/` y agregá las declaraciones `@font-face` en `assets/styles.css`. No redistribuyas fuentes sin permiso.

## Formulario de contacto: estado técnico

**El formulario no puede enviar mensajes reales todavía.** Incluye un backend preparado para Netlify Functions + Resend, pero deben configurarse credenciales privadas y un remitente verificado:

- `RESEND_API_KEY`
- `FRONTERA_FROM_EMAIL`

Estas variables deben configurarse en Netlify, **nunca** incluirse en archivos públicos. El remitente debe pertenecer a un dominio verificado; el destinatario de la función es `clubfronterarivera@gmail.com`. Debe configurarse protección antispam adicional antes de recibir mensajes masivos. La web informa claramente si el envío no funciona.

## Últimas comprobaciones antes de publicar

- [ ] Revisar las páginas en 390 px, 768 px y escritorio (en este entorno hubo un bloqueo de navegador para la comprobación visual automatizada).
- [ ] Comprobar licencia e instalación web de Albertus Nova.
- [ ] Confirmar autorización para difusión de las canciones y fotografías.
- [ ] Configurar y probar el formulario real de extremo a extremo.
- [ ] Conectar GitHub a Netlify, vincular dominio propio y verificar la web en un teléfono.

La estética se mantiene retro, roja, amarilla y beige, con navegación multipágina real. No hay sección de afiliación de socios.
