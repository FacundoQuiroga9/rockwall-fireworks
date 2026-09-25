# Ajuste del hero — Rockwall Fireworks

Cambios locales para revisión. No se realizaron commits, push ni despliegues.
El proyecto mobile conserva su estado inicial, incluida `app-store-assets/`.

## Fotografía integrada

La plataforma y los cinco envases se generan como una sola imagen: Festival
Balls, Diablo, Neon Beef, The Reaper y Night Rider. Se retiraron las capas de
fotografías individuales y sus recortes SVG. La composición usa una cámara
compartida, apoyo sobre el mismo plano, sombras de contacto y luz azul/naranja.

Se inspeccionaron el hero anterior en Chrome, la plataforma y las cinco fotos
del catálogo. Se utilizó la herramienta integrada `image_gen`, con las cinco
fotografías como referencias de packaging. Una segunda edición corrigió el
texto de advertencia de Festival Balls y la indicación **200 GRAMS** de Night
Rider. Los nombres, colores principales, ilustraciones y marcas se compararon
visualmente con las referencias. El microtexto se reconstruye a partir de
fotografías de 640 px; no es una reproducción vectorial de las etiquetas.

Recursos finales RGBA, con transparencia real y dimensiones reservadas:

| Archivo | Dimensiones | Bytes |
| --- | --- | --- |
| [products-studio-480.webp](public/images/hero/products-studio-480.webp) | 480 × 480 | 88.242 |
| [products-studio-800.webp](public/images/hero/products-studio-800.webp) | 800 × 800 | 198.146 |
| [products-studio-1200.webp](public/images/hero/products-studio-1200.webp) | 1200 × 1200 | 361.892 |

El PNG maestro está en `artifacts/hero-update/products-studio-master.png`.
Los dos prompts completos están en
[image-prompts.txt](artifacts/hero-update/image-prompts.txt). No se utilizó el
fallback CLI. La integración usa `srcSet`, `sizes`, dimensiones explícitas y
prioridad de carga para la imagen del hero. Titular, botones y sello siguen
siendo HTML.

## Cielo y sello

- Estrellas en tres profundidades: 130 en móvil, 220 en tablet y 360 en
  escritorio, frente a las 36/85 anteriores. Varían tamaño, tono y brillo con
  oscilaciones lentas.
- Estallidos pequeños, medianos y grandes, trayectorias curvas, alturas y
  duraciones variables. Paletas naranja, dorada, azul, violeta, rosa y turquesa;
  varias explosiones combinan colores.
- Intervalos habituales de 1,65–2,8 s en escritorio, 2,1–3,5 s en tablet y
  2,8–4,2 s en móvil. Cada cinco lanzamientos se suma una pausa de 2,4 s.
- Hasta tres fuegos simultáneos en escritorio y dos en tablet/móvil. Partículas,
  resolución y frecuencia de dibujo tienen límites por dispositivo. No hay
  un flash central ni sonido.
- Se reubicaron estallidos tras observar que los productos ocultaban parte de
  los primeros efectos. Ahora ocupan el cielo libre arriba y a los lados.
- Se conservan pausa manual, suspensión fuera de pantalla/en segundo plano,
  movimiento reducido y limpieza al desmontar. Un evento de resize que no
  cambie las dimensiones del hero ya no reinicia la escena.
- “SERVING” y “ROCKWALL” ocupan dos líneas centradas dentro del sello. Tipografía,
  interlineado y separación escalan con el círculo. En anchos hasta 1100 px
  hay espacio adicional bajo la imagen para evitar que el sello tape Night Rider.

## Validación

- `npm run lint`: correcto, sin warnings.
- `npm run test`: **15/15**. Incluye suspensión, movimiento reducido, límites
  de partículas, superposiciones, variedad cromática, limpieza y continuidad
  del fotograma ante un resize sin cambio de dimensiones.
- `npm run build`: correcto; `dist/` incluye `.htaccess` y los 86 archivos
  públicos, verificados byte por byte.
- `git diff --check`: correcto.
- Chrome conectado: revisión visual de fotografía, lectura, sello y movimiento.
  Se observó una secuencia de estallidos y se ajustaron posiciones y estelas.
- Responsive: 320, 390, 768, 1024 y 1440 px, sin overflow horizontal. Las cuatro
  esquinas de cada bloque de texto del sello están dentro de su radio interior.
- Pausa y reanudación operables. Dos capturas durante la pausa tienen píxeles
  idénticos en el área visible del cielo; se excluyó el halo del cursor de la
  herramienta. Evidencia en [pause-check.json](artifacts/hero-update/pause-check.json).
- La consola consultada no contiene errores ni warnings de la aplicación.
- Comparación de hashes: los únicos archivos existentes modificados en esta
  tarea son `Hero.jsx`, `Hero.css`, `ProductShowcase.jsx`, `createNightSky.js` y
  `tests/night-sky.test.js`. El resto del sitio conserva el estado previo.

## Capturas y vista previa

- [Hero de escritorio](artifacts/hero-update/hero-desktop.png)
- [Hero móvil](artifacts/hero-update/hero-mobile.png)
- Secuencia de movimiento y comprobaciones en `artifacts/hero-update/`.

Vista previa: **http://127.0.0.1:4173/**.

```bash
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

## Limitaciones

La revisión automática de permisos rechazó controlar Chrome nativo:
“Computer Use was not approved to use Google Chrome”. La conexión del navegador
sí permitió revisar páginas y tomar capturas, pero no emular el ajuste de sistema
`prefers-reduced-motion` en DevTools. Su lógica está cubierta por pruebas y su
CSS fue inspeccionado; la emulación real queda pendiente. La suspensión fuera
de pantalla y en pestañas ocultas se verifica en pruebas automatizadas.

No se midió rendimiento en dispositivos físicos. Los límites de fps/DPR son
límites de implementación, no resultados de un benchmark. Las capturas son
fotogramas del hero; la vista previa permite evaluar su ritmo continuo.
