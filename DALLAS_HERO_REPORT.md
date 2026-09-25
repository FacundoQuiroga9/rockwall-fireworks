# Dallas en el hero — revisión local

## Resultado

El hero incorpora una interpretación nocturna del skyline de Dallas con Reunion
Tower, Bank of America Plaza, Fountain Place, Renaissance Tower y Chase Tower.
La ciudad ocupa el sector inferior; en escritorio se desplaza hacia la derecha
para liberar el titular. En móvil, el encuadre conserva Reunion Tower y Bank of
America Plaza y el hero mide aproximadamente 789 px a 390 px de ancho, frente
a los 1036 px de la versión previa.

Las capas son canvas del cielo (z=0), imagen de ciudad con alpha (z=1), degradado
de contraste (z=2), textos/sello/controles (z=3). El cielo se ve entre edificios
y en la abertura de Chase Tower; las fachadas ocultan visualmente las estelas
y partículas que pasan por detrás. La ciudad no contiene cielo estático ni
fuegos artificiales horneados en la imagen.

Se conservaron densidad de estrellas, paletas, intervalos, partículas, límites
por dispositivo y ciclo de vida del cielo. Sólo se ajustaron las posiciones
de lanzamiento para la nueva composición. Se añadió `aria-pressed` al control
de pausa. El sello conserva su diseño, tipografía, giro y texto interior.

La imagen aprobada de los cinco productos abre la sección existente del
catálogo, junto a su título y descripción en escritorio y debajo de ellos en
móvil. No se añadió una sección independiente. Los filtros y las flechas
permanecen junto al carrusel. Los tres WebP de productos son **idénticos byte
por byte** a los aprobados: no se regeneraron ni modificaron.

No cambiaron el nombre comercial, Rockwall, la dirección
**10489 State Hwy 205, Lavon, TX 75166**, navegación, rutas, contacto,
promociones ni integración de la app. El proyecto mobile no fue modificado.

## Referencias y método

Se investigaron vistas nocturnas reales y se inspeccionó en el navegador la
fotografía de Carol M. Highsmith del archivo de la Library of Congress:

- [Dallas night skyline — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dallas_night_skyline.jpg).
- [Registro de la Library of Congress, highsm.12950](https://www.loc.gov/item/2011631144/).
- [Otras vistas nocturnas de Dallas](https://commons.wikimedia.org/wiki/Category:Dallas_night_skylines).
- [Reunion Tower](https://reuniontower.com/).

La revisión automática rechazó descargar el archivo desde Wikimedia porque
esa solicitud no estaba autorizada. No se descargó por una vía alternativa.
Se utilizó la herramienta integrada `image_gen` para crear un recurso original
a partir de las referencias visuales inspeccionadas y una descripción de sus
rasgos arquitectónicos. No se usó el fallback CLI ni se reutilizó la fotografía.

Se corrigieron las coronas de Bank of America Plaza, Renaissance Tower y Chase
Tower. Una iteración adicional eliminó un falso patrón de transparencia: el
recurso final es RGBA y tiene alpha real en el cielo y las aberturas. Es una
interpretación arquitectónica generada, no una fotografía documental ni una
reproducción cartográfica exacta de la ciudad actual.

- [Prompt inicial](artifacts/dallas-hero/image-prompt.txt).
- [Prompts de corrección y extracción del fondo](artifacts/dallas-hero/image-edits.txt).
- [PNG maestro final](artifacts/dallas-hero/dallas-skyline-master.png).

## Recursos optimizados

| Archivo | Dimensiones | Peso |
| --- | --- | --- |
| [dallas-skyline-800.webp](public/images/hero/dallas-skyline-800.webp) | 800 × 268 | 69.240 bytes |
| [dallas-skyline-1440.webp](public/images/hero/dallas-skyline-1440.webp) | 1440 × 482 | 184.246 bytes |
| [dallas-skyline-2160.webp](public/images/hero/dallas-skyline-2160.webp) | 2160 × 723 | 329.186 bytes |

Se conservó el alpha al reducir y codificar el PNG. `srcSet`, `sizes` y
dimensiones explícitas reservan el espacio y permiten seleccionar la variante.
El skyline carga con prioridad alta; los productos reubicados usan carga
diferida. No se añadieron dependencias.

## Verificación

- `npm run lint`: correcto, sin warnings.
- `npm run test`: **15/15** correctas.
- `npm run build`: correcto.
- `git diff --check`: correcto.
- Los 89 archivos públicos coinciden byte por byte con sus copias en `dist/`.
- Revisión visual en Chrome de escritorio 1440 px, tablet 768 px y móvil 390 px.
- Controles adicionales a 320 y 1024 px: sin overflow horizontal; imagen de
  productos y controles dentro del ancho disponible; texto del sello dentro
  del círculo.
- Se observaron distintos momentos de la animación y se ajustaron posiciones.
  Se verificó la separación de capas y la transparencia del skyline.
- Pausa manual y reanudación operables. Dos capturas separadas durante la pausa
  son idénticas en toda el área visible del hero.
- El enlace «Explore the fireworks» lleva a la nueva apertura del catálogo.
  El filtro «Cakes» muestra tres productos de esa categoría. La flecha «Next
  products» desplaza el carrusel y habilita el retroceso.
- No se registraron errores de la aplicación. El registro sí contiene un error
  de una extensión de Chrome (`chrome-extension://… Cannot respond`), ajeno
  al código del sitio.
- Comparación SHA-256: sólo cambiaron seis archivos existentes del hero y
  catálogo. Los demás cambios locales anteriores permanecen intactos.

Evidencia: [controles responsive y consola](artifacts/dallas-hero/browser-checks.json),
[comprobación de pausa](artifacts/dallas-hero/pause-check.json),
[comparación final](artifacts/dallas-hero/final-checks.json).

### Pendiente real

`prefers-reduced-motion`, pausa fuera de pantalla, pausa en pestaña oculta y
limpieza al desmontar están cubiertos por las pruebas automatizadas. Queda
pendiente la emulación de movimiento reducido en un navegador con acceso a ese
ajuste; la conexión disponible no ofrece esa emulación. No se hizo un benchmark
en dispositivos físicos.

## Capturas y vista previa

- [Hero de escritorio](artifacts/dallas-hero/hero-desktop.png).
- [Productos en escritorio](artifacts/dallas-hero/products-desktop.png).
- [Hero móvil](artifacts/dallas-hero/hero-mobile.png).
- [Productos en móvil](artifacts/dallas-hero/products-mobile.png).
- [Hero tablet](artifacts/dallas-hero/hero-tablet.png).
- [Fotograma con estallido](artifacts/dallas-hero/motion-large.png).

Vista previa local: **http://127.0.0.1:4173/**. La pestaña se dejó abierta con
la animación activa y se restauró el tamaño normal del navegador.

Todos los cambios quedan locales. No se hicieron commits, push ni despliegues.
