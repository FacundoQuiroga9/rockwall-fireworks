# Correcciones del rediseño — Rockwall Fireworks

Continuación del trabajo del 16 de septiembre de 2026. Cambios locales en
`rockwall-fireworks`, sin push ni despliegue. El proyecto mobile conserva su
estado inicial, incluida su carpeta no versionada `app-store-assets/`.

## Cambios implementados

- **Rockwall como referencia comercial:** hero, historia, contacto, footer,
  página de la app y metadatos comunican que el negocio sirve a Rockwall, Texas.
  Se mantiene **10489 State Hwy 205, Lavon, TX 75166** en los bloques de dirección,
  Maps y JSON-LD. Las únicas apariciones literales de Lavon en `src/` e
  `index.html` están en la configuración de dirección y los datos estructurados.
- **Productos auténticos:** la primera generación de la sesión anterior había
  alterado etiquetas. Se retomó el fallback autorizado: cinco fotografías reales
  (Festival Balls de Black Cat, Diablo, Neon Beef, The Reaper y Night Rider),
  reencuadradas mediante SVG y dispuestas sobre el entorno de estudio generado.
  No se regeneraron las etiquetas ni se sustituyó Festival Balls por su variante
  amarilla. `ProductShowcase.jsx` compone las capas, con proporciones reservadas
  y un nombre accesible. Es una composición web, no una fotografía nueva de los
  productos generada íntegramente por IA.
- **Cielo nocturno:** se retiraron la fotografía de fondo y su preload. Un
  degradado y estrellas CSS ofrecen un fondo estático; canvas añade estrellas
  suaves, estelas y un único estallido gradual por vez. Los efectos se concentran
  a la derecha en escritorio y en la zona de productos en móvil.
- **Movimiento controlado:** botón Pause/Resume, suspensión fuera del hero y en
  pestañas ocultas, versión estática con `prefers-reduced-motion` y limpieza de
  observadores, eventos y `requestAnimationFrame` al desmontar. Límite de dibujo
  de 30 fps en escritorio y 24 en móvil; densidad de píxeles limitada a 1.5 y
  1.25, respectivamente. Estos son límites de implementación, no mediciones de
  rendimiento en dispositivos.
- **Contacto sin fotografía:** panel tipográfico azul noche, acento naranja y
  datos en una cuadrícula responsive. Dirección, horarios, teléfono, email,
  redes y enlaces de indicaciones conservados.
- No se modificaron el catálogo, los rangos estacionales, las rutas, el PDF de
  ofertas ni los badges. App Store conserva su URL exacta y apertura segura en
  otra pestaña. Android sigue como “Coming soon”, sin enlace de descarga.
- Sin nuevas dependencias.

## Recursos visuales

Se reutilizan los recursos creados con la herramienta integrada de generación
de imágenes en la sesión anterior:

- `public/images/hero/studio-plinth-600.webp` — 12.152 bytes.
- `public/images/hero/studio-plinth-1000.webp` — 31.758 bytes.

Las cinco fotografías existentes suman 173.504 bytes y se conservan sin editar.
El soporte usa la variante pequeña en móvil. El prompt original está guardado
en [artifacts/refinements/image-prompt.txt](artifacts/refinements/image-prompt.txt):
una base ovalada baja, azul noche mate, luz azul suave y borde naranja, fondo
transparente y espacio vacío; sin productos, etiquetas ni texto generados.
Los archivos originales del collage y del fondo se conservaron, pero el hero
y el contacto ya no los referencian.

## Validaciones realizadas

- `npm run lint`: correcto, sin advertencias.
- `npm run test`: **12/12**. Incluye límites de partículas y resolución,
  pausa manual, suspensión fuera de pantalla/en segundo plano, cambios de
  movimiento reducido, limpieza al desmontar y canvas no disponible.
- `npm run build`: correcto; salida estática en `dist/`.
- `git diff --check`: correcto.
- Render estático de React para home y `/mobile-app`: un H1 por página,
  recursos existentes, los cinco productos del hero, contacto sin `<img>`,
  dirección real y enlaces comerciales presentes. Resultados en
  [markup-checks.json](artifacts/refinements/markup-checks.json).
- Los **83 archivos públicos**, incluido `.htaccess`, coinciden byte por byte
  con su copia en `dist/`. Evidencia en
  [build-checks.json](artifacts/refinements/build-checks.json).
- Revisión de las menciones de Lavon y de los metadatos iniciales/de React.
- El servidor Vite Preview se inició en `http://127.0.0.1:4173/`.

## Pendiente: revisión visual y capturas

La revisión automática de permisos rechazó el control de Google Chrome:
“Computer Use was not approved to use Google Chrome”. Tampoco hay un navegador
conectado disponible. La comprobación HTTP desde el entorno de comandos fue
bloqueada con `EPERM` para `127.0.0.1:4173`.

Por estas restricciones **no se obtuvieron capturas nuevas** ni se verificaron
en navegador el encuadre, overflow, consola, rendimiento o apariencia de las
partículas en escritorio/tablet/móvil. Las pruebas de movimiento usan un
contexto canvas simulado; no sustituyen la comprobación visual real. Las
capturas de `artifacts/redesign/` corresponden a la versión anterior.

Vista previa para revisión: [Home](http://127.0.0.1:4173/),
[Contacto](http://127.0.0.1:4173/#contact),
[Mobile App](http://127.0.0.1:4173/mobile-app).

Para reiniciarla:

```bash
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

La información comercial pendiente de confirmación del informe anterior
(campaña del 50.º aniversario, aranceles y fechas móviles) sigue sin cambios.
