# Pdf_Reader

PWA lector de PDFs (Biblioteca Drive): novelas, mangas y manhwas desde Google Drive, con progreso sincronizado y lectura sin conexión.

## Iconos
PNG 192, 512 y maskable 512 (más `apple-touch-icon.png`) para que Chrome genere bien el WebAPK.
Si cambias iconos o el manifest: desinstalar la app, borrar datos del sitio y reinstalar.
Para cambios normales de código basta con subir `index.html`/`sw.js` (el service worker usa red primero, así que la versión nueva se ve en cuanto hay conexión). Si añades archivos al precaché, sube el número de `C` en `sw.js`.

## Novedades de esta versión
- PDFs guardados como Blob y abiertos por URL: sin copias del archivo en RAM (menos cierres en tablets antiguas). Los PDFs locales se guardan sin leerlos enteros en memoria.
- Opción en Ajustes «Abrir desde Drive sin descargar todo» (experimental): carga solo las páginas que se leen mediante peticiones Range. Si falla, vuelve a la descarga completa.
- Gestión de memoria: en dispositivos de ≤2 GB se reducen la caché de páginas y la resolución máxima.
- Almacenamiento persistente solicitado al navegador y uso mostrado en Ajustes.
- Sincronización: se sube cada 6 s como mucho (y al salir de la app), sin portadas manuales en base64 (se quedan en cada dispositivo) y con aviso «Sincronización pendiente» si falla.
- `localStorage` protegido contra «almacenamiento lleno».
- Service worker: precachea pdf.js, solo cachea respuestas válidas, tolera iconos ausentes y cachea el CSS de fuentes.
- Manifest: descripción, idioma, categorías, icono SVG y atajo «Continuar leyendo» (`./?continue=1`). Botón «Instalar app» en Ajustes.

## Pendiente (ideas)
- Mover `lib`, `localLib` y portadas de `localStorage` a IndexedDB.
- Capturas (`screenshots`) en el manifest para el diálogo de instalación enriquecido.
- Separar el script en `app.js`.
- Restringir el CORS del Worker de OAuth solo al origen de GitHub Pages.
