# Rockwall Fireworks — rediseño visual

Entrega local: 16 de septiembre de 2026.

**Actualización posterior:** este informe y sus capturas documentan el primer
rediseño. Las correcciones de ubicación, hero y contacto, junto con el estado
actual de las validaciones, están en [REFINEMENTS_REPORT.md](REFINEMENTS_REPORT.md).

Vista previa del build: **http://127.0.0.1:4173/** y **http://127.0.0.1:4173/mobile-app**.

Los cambios están únicamente en `rockwall-fireworks`. No se modificó `rockwall-fireworks-mobile`. El estado inicial de Git estaba limpio. No se hicieron commits, push ni despliegues.

## Diseño implementado

- Identidad original: logo, Anton SC, Jura, naranja `#ff5215`, noche `#00051e` y azul `#071453`. Se incorporó un fondo de lectura cálido y variantes más oscuras del naranja para el contraste del texto sobre superficies claras.
- Hero con composición de cartel, fotografías de fuegos artificiales, productos auténticos, sello “Est. 1975” y CTA hacia productos y local.
- Diez marcas reconocibles en una franja estática. Diez productos conservados, filtros por categoría, imágenes grandes, scroll táctil, controles por teclado y enlaces originales a previews.
- Historia con fotografía real del local; temporadas con contador, calendario y próxima temporada destacada. Se conservaron sin cambios `seasonalConfig.js`, la zona `America/Chicago` y el cálculo original.
- Ofertas integradas en la página y diálogo voluntario: foco contenido, Escape, cierre por fondo y devolución del foco. No aparece automáticamente ni se cierra durante la lectura. PDF original preservado.
- Nueva sección de app en home y `/mobile-app` dedicado al catálogo, favoritos locales, countdown, información del local, fechas y seguridad. Sin compras, precios ni beneficios futuros inventados.
- iOS mantiene exactamente `https://apps.apple.com/us/app/id6793552663`, `target="_blank"` y `rel="noopener noreferrer"`. Android se muestra como “Coming soon”, sin enlace ni fecha. Se reutilizan los badges existentes manteniendo su proporción.
- Contacto, navegación, menú móvil y footer renovados. Soporte, privacidad y términos conservan su contenido y comparten la nueva identidad visual.
- Movimiento breve: entrada escalonada, chispa decorativa única, apariciones al entrar en pantalla y microinteracciones. No hay efectos en bucle, sonido, autoplay ni parallax que capture el scroll. Las reglas CSS y el hook respetan `prefers-reduced-motion`. Los elementos son visibles de forma predeterminada.
- Mockup original preservado y variantes WebP de 480 y 800 px, de 55.210 y 155.672 bytes, frente a 2.369.415 bytes del PNG original. Imágenes con dimensiones, `srcSet` y carga diferida donde corresponde.
- React, Vite y CSS conservados; ninguna dependencia agregada.

## Validación ejecutada

| Comprobación | Resultado |
| --- | --- |
| `npm run lint` | Correcto, sin warnings |
| `npm run test` | 7 de 7 tests correctos |
| `npm run build` | Correcto; salida en `dist/` |
| `git diff --check` | Correcto |
| Home y app: 320, 390, 768, 1024, 1440 px | 0 px de overflow horizontal, sin títulos recortados |
| Soporte, privacidad y términos: 390, 768, 1440 px | Sin overflow; títulos y canonical correctos |
| Menú móvil | Apertura, selección de ancla, foco inicial, ciclo de Tab, Escape, retorno del foco y fondo inerte comprobados |
| Productos | Avance real del carrusel móvil (279 px), controles habilitados según posición y filtros Cakes, Reloadables y Assortments comprobados |
| Promoción | Revisada en escritorio y móvil; fondo inerte, foco, Shift+Tab, Escape y retorno al disparador comprobados |
| iOS | Click abre una segunda pestaña con la ficha real de Rockwall Fireworks en Apple |
| Android | Estado visible “Coming soon”; no hay anchors de descarga |
| Enlaces externos | Atributos seguros en todos los enlaces `_blank`; destinos comerciales originales preservados |
| PDF | Link activado hacia el archivo original; firma `%PDF-` y copia del archivo en `dist/` verificadas |
| Hostinger | Los 81 archivos públicos son idénticos byte por byte en `dist/`, incluido `.htaccess`, sitemap, PDF, imágenes y badges |

Las capturas se tomaron en Chrome y se inspeccionaron. Se corrigieron el recorte de contacto, el apilado de badges, un desborde decorativo móvil y el desborde de las etiquetas accesibles fuera del carrusel. También se corrigió la repetición de una misma ancla y el salto entre rutas, conservando el foco accesible.

Las pruebas de datos se actualizaron para reflejar la ausencia de un enlace ficticio de Android. `scripts/visual-audit.mjs` se adaptó al nuevo diálogo y los nuevos selectores; la revisión de esta entrega se hizo con las herramientas del navegador, no ejecutando ese script CDP.

## Capturas y evidencias

| Página | Escritorio | Móvil |
| --- | --- | --- |
| Home | [Captura](artifacts/redesign/home-desktop.png) | [Captura](artifacts/redesign/home-mobile.png) |
| Mobile App | [Captura](artifacts/redesign/app-desktop.png) | [Captura](artifacts/redesign/app-mobile.png) |

También se guardaron las revisiones de tablet, historia, temporadas, contacto y popup en `artifacts/redesign/`. Allí están las matrices responsive en JSON, los logs de los tres scripts, la comprobación del build y la consola del navegador.

## Límites reales de la revisión

- La revisión automática de permisos rechazó el control de la app nativa de Chrome (“Computer Use was not approved to use Google Chrome”). Por ello no se pudo activar la emulación del ajuste de sistema `prefers-reduced-motion` en DevTools. Su implementación CSS/JS está revisada; la emulación real queda pendiente. Las animaciones normales y la disponibilidad del contenido se revisaron en el navegador.
- La consola de producción no mostró warnings de React ni excepciones de la aplicación. Chrome sí registró `FILE_ERROR_NO_SPACE` en su almacenamiento `.ldb`; queda preservado en el log como limitación del entorno. No se eliminaron archivos ajenos al proyecto para resolverlo.
- No se probaron dispositivos físicos ni se desplegó en Hostinger. Se verificó el build estático y la configuración de fallback existente; Vite Preview no ejecuta reglas Apache.

## Información comercial a confirmar

Se conservó la información original sin inventar reemplazos:

1. Campaña de 50.º aniversario: corresponde a la referencia 1975–2025 y sigue presente en el flyer, el PDF y la imagen social. En la página se pide confirmar disponibilidad de las ofertas.
2. “No tariff tax guaranteed”: mensaje comercial existente; conviene confirmar su vigencia.
3. Diwali y Memorial Day: las fechas están configuradas como rangos anuales fijos. Deben ser confirmadas por el negocio antes de cada temporada; no fueron recalculadas ni sustituidas.
4. El horario general `8am - 12am` y las horas de inicio/cierre de algunos rangos estacionales son diferentes en la configuración original. Ambos se preservaron.

## Volver a abrir la vista previa

```bash
npm run preview -- --host 127.0.0.1 --port 4173
```

Para desarrollo con recarga automática: `npm run dev`. Los artefactos de revisión y `dist/` permanecen locales según el `.gitignore` existente.
