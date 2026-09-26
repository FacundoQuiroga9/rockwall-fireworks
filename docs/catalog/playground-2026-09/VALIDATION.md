# Validación local — 2026-09-25

Esta revisión corresponde a My List simplificada y al playground de cuatro perfiles. No se hizo commit, push, despliegue ni publicación. Los HEAD permanecen en `af99a9a` (web) y `c06142d` (app); se conservaron los cambios previos sin consolidarlos en Git.

## Comandos y paridad

| Proyecto | Comprobación | Resultado |
| --- | --- | --- |
| Web | `npm run catalog:sync` | Correcto; 302 productos, perfiles y recursos compartidos sincronizados. Ejecutado antes de la corrida del log. |
| Web | `npm run catalog:check` | Correcto; compara datos y archivos por producto, además de perfiles y runtime generado. |
| Web | `npm run lint` | Correcto. |
| Web | `npm run test` | 104 aprobadas, 0 fallidas, 0 omitidas. |
| Web | `npm run build` | Correcto; incluye la ruta playground y metadatos. |
| App | `npm run typecheck` | Correcto. |
| App | `npm run lint` | Correcto, sin advertencias de ESLint. |
| App | `npm run test` | 36 aprobadas, 0 fallidas, 0 omitidas. |
| App | `npx expo export --platform all --output-dir dist-review-playground` | Correcto para iOS, Android y web; 16 rutas estáticas, incluida `/playground`. |
| Ambos | `git diff --check` | Correcto. |

Logs completos: [web](web-validation.log) y [app](app-validation.log). El build web conserva la advertencia de tamaño del chunk de miniaturas del PDF (≈ 1,49 MB, carga diferida). El chunk nuevo del motor de escritorio ocupa ≈ 37,9 kB / 11,7 kB gzip. Los avisos de Node sobre módulos ESM y variables de color no son fallos de pruebas ni de exportación.

Las pruebas cubren identidades reales, segmentos y eventos válidos, reproducción/pausa/continuación/reinicio/final, comparación de dos perfiles, ausencia de eventos duplicados, frames tardíos, congelación al recibir background, calidad determinista, presupuesto de partículas, audio limitado y limpieza de recursos. También verifican movimiento reducido, nombres de variantes, conservación de listas, paridad web–app y serialización del runtime antes de Hermes.

[baseline.json](baseline.json) conserva hashes del inicio de esta iteración. Pasaron las comparaciones del catálogo, promociones, motor comercial, PDF, hero, plataforma aprobada y `.htaccess`. Las reglas BOGO y los estados de promociones no se cambiaron. No se migraron claves ni estructuras de listas o favoritos.

## Revisión en navegador

Entorno: Chrome automatizado en macOS 26.5.2. Vista previa existente en <http://127.0.0.1:5176/>.

- Acceso directo a `/playground`, navegación y enlaces a las cuatro fichas. Seleccionar no reproduce ni activa sonido; un tercer producto queda deshabilitado mientras hay dos seleccionados.
- Reproducción completa de ambas cakes en comparación hasta 33,8 s y de ambas muestras de shell hasta 4,8 s. Modos individuales A/B, pausa, continuación, reinicio y momentos estáticos revisados.
- Contraste visual con cuadros de las referencias reales: palmas de Bump Bear, peonías y final de Band of Brothers, anillos de Ghostacular y puntas rojas con estelas doradas de Maelstrom. Evidencia y limitaciones en el [informe](README.md).
- Teclado: activación de reproducción/pausa, Tab hacia Restart, reinicio, momentos estáticos y ajuste de volumen. Foco visible. No se ejecutó una sesión completa con lector de pantalla.
- Sonido inicialmente apagado; activación explícita, silencio y control de volumen comprobados en la interfaz. No se realizó escucha física ni medición acústica. Límites de voces y limpieza comprobados con pruebas automatizadas.
- Pausa al desplazar el escenario fuera de pantalla comprobada. La visibilidad y el background tardío se cubren con pruebas del runtime. No se verificó una transición real del sistema operativo a segundo plano: el acceso nativo al navegador no estaba autorizado y no se eludió esa restricción.
- Movimiento reducido: documento compacto iniciado estático, primera reproducción explícita desde cero y controles de momentos representativos. No hay animación ambiental automática.
- Consola de la revisión final en pestañas nuevas: sin errores ni advertencias. Se excluyen mensajes transitorios de HMR de pestañas abiertas mientras se editaban archivos.

La alternativa web estática se revisó a 390×844, 844×390, 768×1024 y 1024×768. Sin overflow horizontal, iframe ni canvas: [responsive-checks.json](responsive-checks.json). Se comprobó el enlace iOS exacto con `target="_blank"` y `rel="noopener noreferrer"`, Android “Coming soon” y texto que no promete el playground en la versión publicada.

Estas capturas usan dimensiones de Chrome y una opción de desarrollo para mostrar la alternativa. No son pruebas con UA ni hardware reales. Los fixtures de detección cubren laptop táctil, iPad con UA de escritorio, Android y navegadores desconocidos. El parámetro de demostración no está en el bundle de producción.

## My List y PDF

Se revisaron la lista editable y la vista de mostrador en escritorio, más 390 px y 768 px. Las filas muestran fotografía, nombre, categoría y cantidad; conservan avisos y cantidades promocionales necesarias. Sin códigos, descripciones o espacios vacíos de los campos retirados.

La lista existente del navegador conservó sus cinco unidades y sus grupos, incluido un BOGO pendiente. Se agregó Bump Bear desde el playground, se comprobó el incremento tras recargar y se retiró únicamente ese grupo de prueba. Se modificó y restauró una cantidad existente. La lista final vuelve a las mismas cinco unidades; no se borró ni sustituyó la selección del usuario.

Ambas descargas PDF se activaron desde My List. Además, `npm run playground:fixtures` generó ejemplos con los cuatro perfiles, [con fotos](../../../output/pdf/playground-2026-09/my-list-with-photos.pdf) y [sin fotos](../../../output/pdf/playground-2026-09/my-list-without-photos.pdf). Se abrieron/renderizaron con Poppler y se inspeccionaron sus páginas: nombres, marcas, categorías y cantidades alineados, sin SKU ni descripciones. El generador compacto es idéntico al baseline; esta iteración no repite toda la matriz de paginación y promociones de la iteración anterior.

## Rendimiento observado

| Superficie | Productos simultáneos | Calidad | Secuencia | FPS dibujados | Dibujo medio Canvas |
| --- | --- | --- | --- | --- | --- |
| Web escritorio, Chrome | Bump Bear + Band of Brothers | High | 33,8 s | 59,9 | 0,46 ms |
| Documento compacto en Chrome, 390×844 | Ghostacular + Maelstrom | Balanced | 4,8 s | 29,6 | 0,34 ms |

Fuente: indicador Performance al completar la reproducción, guardado en [performance.json](performance.json). El modelo de hardware no se pudo consultar (`sysctl` bloqueado). Estas cifras miden el dibujo Canvas en ese entorno, no el tiempo de GPU/composición, batería ni fluidez de un teléfono. La segunda fila **no es una medición nativa**.

## App: comprobado y pendiente

Comprobado: TypeScript, ESLint, pruebas, paridad y exportaciones iOS/Android/web. Se inspeccionó el mismo documento compacto del WebView en Chrome, vertical y horizontal, como validación del HTML y los controles; no sustituye una ejecución React Native.

No se ejecutó la actualización en simulador o dispositivo. Metro no pudo abrir un puerto: `listen EPERM: operation not permitted 127.0.0.1:8087`. El intento `expo start --offline --port 8087` agotó la búsqueda de puertos y terminó con `ERR_SOCKET_BAD_PORT`. `simctl` enumera el runtime iOS 26.4 y simuladores instalados, pero ninguno se inició para esta revisión.

Pendiente antes de publicar: interacción táctil, VoiceOver/TalkBack, safe areas y rotación reales; sonido y mute/interrupciones en WKWebView y Android WebView; pausa/reanudación real al cambiar de pantalla o enviar la app al fondo; rendimiento, temperatura y batería en teléfonos. No se afirma que la versión de App Store incluya esta funcionalidad.

## Rutas y entrega

`public/.htaccess` y `dist/.htaccess` son idénticos. El build contiene `playground.html` y la configuración existente conserva el fallback de rutas. El acceso directo se verificó en la vista previa Vite; no se desplegó ni se probó Apache/Hostinger en producción.

Se entregan capturas, perfiles, eventos y fuentes en este directorio, junto con instrucciones para incorporar otro producto. No se produjo una grabación audiovisual final. Las imágenes y los videos originales de producto, el hero y la plataforma circular permanecen intactos.
