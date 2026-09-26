# My List simplificada y Playground — revisión local 2026-09-25

> Informe histórico. Estado actual, grabación, perfiles y autorización de commit/push en [la continuación del 26 de septiembre](../playground-continuity-2026-09/README.md).


> Informe histórico de la primera versión. Ver la [evolución panorámica con siete perfiles](../playground-evolution-2026-09/README.md) para el estado actual.

Vista previa: <http://127.0.0.1:5176/playground> y <http://127.0.0.1:5176/my-list>.
Todo queda local. Sin commit, push, despliegue ni publicación. Los cambios anteriores de catálogo, BOGO, promociones, imágenes y videos permanecen en el árbol de trabajo.

## Resultado

My List, tanto editable como en modo mostrador, muestra foto, nombre, categoría y cantidad. Se retiraron de las filas códigos, descripciones, presentación redundante y la línea independiente de marca. Los nombres duplicados conservan una distinción breve y comprensible: por ejemplo `Party Sparklers (4-pack)` frente a `Party Sparklers (Display of 20 packs)`. Las marcas sólo se incorporan al nombre cuando distinguen variantes homónimas. Permanecen los avisos accionables y las cantidades pagadas, bonificadas o pendientes de grupos promocionales.

No cambió la estructura persistida ni sus claves. El motor comercial y el PDF son idénticos a los del inicio de esta iteración. [baseline.json](baseline.json) y las pruebas comparan SHA-256 del catálogo maestro, promociones, motor My List, PDF, hero, plataforma aprobada y `.htaccess`.

`/playground` permite elegir uno o dos productos, reproducir, pausar, continuar, reiniciar, comparar simultáneamente o estudiar A/B por separado. También ofrece momentos estáticos, progreso, referencias, acceso a fichas y agregar a My List con su proveedor existente. Elegir una tarjeta no inicia reproducción ni sonido. Sólo aparecen los cuatro perfiles revisados.

La app incorpora una ruta Stack `/playground`, acceso desde More y desde esas cuatro fichas. Usa controles HTML accesibles dentro de un WebView local, selector y acciones nativas, con composición vertical en teléfonos y panel lateral en tablets suficientemente anchas. No exige girar el dispositivo; `orientation: default` permite ambas orientaciones.

## Productos y referencias inspeccionadas

Se inspeccionó el contenido real de los videos en Chrome, con pausas, avance por cuadros y capturas de sus efectos. No se usó sólo el título o la miniatura. Los videos se mantuvieron silenciados: el audio de la referencia no se analizó ni redistribuyó.

| Producto e ID | Clasificación / variante | Video y segmento | Alcance representado |
| --- | --- | --- | --- |
| Bump Bear · `bump-bear` | Winda, P5011, 200g, 16 shots | [Winda](https://www.youtube.com/watch?v=is8CCkWA4yI), ≈ 4,4–28,7 s | Cake, ≈ 24,3 s: 16 palmas alternando rojo, verde, dorado y plateado, con estelas de glitter. |
| Band of Brothers · `band-of-brothers` | Raccoon, RA53653, 500g, 12 shots | [Raccoon](https://www.youtube.com/watch?v=Ndro9los2fk), ≈ 3,5–37,3 s | Cake, ≈ 33,8 s: nueve explosiones espaciadas y tres finales cercanas. Peonías multicolor que decaen a puntos blancos. |
| Ghostacular · `ghostacular-24-pack` | Raccoon, RA32406, 5-inch, 24 shells | [Raccoon](https://www.youtube.com/watch?v=WYXidPFSUbQ), ≈ 3,2–6,8 s | Sólo la primera shell demostrada, ≈ 3,6 s. Anillo rojo exterior y grupo interior posterior. |
| Maelstrom · `maelstrom-24-pack` | Brothers, BP-A109, 6-inch, 24 shells | [Brothers](https://www.youtube.com/watch?v=stLkljKHBCc), ≈ 5,5–10,3 s | Sólo la primera shell demostrada, ≈ 4,8 s. Palma con puntas rojas, estelas doradas y glitter blanco. |

Las cantidades 24 shells son la presentación comercial; **3,6 y 4,8 segundos no son la duración de los paquetes**. No se identificó un número individual impreso de esas shells: la referencia reproducible es “first demonstrated shell”. Los otros efectos del paquete no están programados automáticamente.

Las intros, pausas y demostraciones ajenas al segmento se excluyeron. En las dos cakes no se observó un corte evidente o cambio evidente de velocidad durante el tramo elegido; esto no certifica que el archivo original jamás se editó. Las muestras de shell comprenden un único efecto continuo: no se infiere continuidad entre las demás demostraciones del video.

Registro estructurado: [perfiles](profiles.csv), [disparos y tiempos](events.csv), [fuente maestra](../../../src/data/playgroundProfiles.json). Los tiempos de disparo son aproximados (generalmente ±0,2–0,4 s; finale de Band revisado con muestras de 0,2 s). Lanzamientos tenues, persistencia y movimiento de partículas son estimaciones. Ghostacular no muestra su lanzamiento; no se dibuja una estela de ascenso inventada. El cue de lanzamiento sintetizado es ilustrativo.

Capturas para contrastar:

- [Bump Bear, primera parte](evidence/bear-dense-sheet.png) y [parte final](evidence/bear-final-sheet.png).
- [Band of Brothers, primera parte](evidence/band-first-sheet.png), [parte final](evidence/band-final-sheet.png) y [detalle de las tres explosiones finales](evidence/band-finale-detail.png).
- [Ghostacular](evidence/ghost-sheet.png) y [Maelstrom](evidence/mael-sheet.png).
- `evidence/*.json` conserva los instantes leídos del video y las capturas individuales. Son material local de investigación, no recursos del simulador.

Bamboozle se consideró durante la investigación, pero su demostración y secuencia más compleja no se incorporaron a esta primera selección. No se extrapolaron estos perfiles a otros productos.

## Fidelidad y sonido

Palmas, peonías y anillos tienen estructuras distintas, no sólo colores distintos. El muestreo determinista conserva tiempos, colores y disposición al repetir. La revisión detectó y corrigió puntas doradas incorrectas en Maelstrom: su perfil usa puntas rojas; el dorado queda en las estelas.

El encuadre es común entre los productos de cada comparación. No se ajusta cada explosión para llenar su mitad. No hay calibración de metros, altura, tamaño físico ni potencia: el tamaño dibujado sigue siendo ilustrativo. El skyline de Dallas es el recurso aprobado, con cielo y estrellas estáticas discretas. El hero y la plataforma de productos no se modificaron. No hay fireworks ambientales aleatorios en el playground.

El aviso accesible se ubica junto al escenario y se amplía en “About this simulation”. Explica variación de efectos, color, tiempos, tamaño y sonido, grabaciones, skyline decorativo y necesidad de seguir las instrucciones del producto.

El sonido es propio, sintetizado con ruido determinista filtrado y envolventes suaves; no contiene audio descargado. Arranca apagado, se habilita por gesto explícito y tiene volumen. Máximo cuatro voces, ganancia conservadora y compresor. Pausa y desmontaje detienen voces; el contexto se cierra al desmontar. Se probó habilitación, silencio y ajuste por teclado en Chrome y se probaron límites/limpieza mediante mocks. No se realizó una evaluación acústica con altavoces o auriculares físicos; tampoco una medición calibrada de loudness.

## Arquitectura y sincronización

- `src/data/playgroundProfiles.json`: identidades, evidencia, segmentos y eventos; fuente maestra web.
- `src/data/playgroundIndex.json`: disponibilidad pequeña para enlaces de ficha.
- `src/shared/playgroundTimeline.js`: reloj y eventos, independiente del render.
- `src/shared/playgroundRenderer.js`: Canvas 2D, posición absoluta en el tiempo y semillas estables.
- `src/shared/playgroundAudio.js`: síntesis y recursos de audio.
- `src/shared/playgroundRuntime.js`: controles HTML, ciclo de vida y mediciones.
- `src/shared/playgroundRuntimeSource.js`: **generado por sync en Node**. No se usa `Function.toString()` dentro de Hermes, que no garantiza recuperar el cuerpo de funciones compiladas.
- `src/shared/playgroundDocument.js`: documento local compartido, también utilizado por el WebView.
- `src/shared/listPresentation.js`: nombres compactos coherentes entre plataformas, sin alterar el PDF.

`catalog:sync` valida identidades y tiempos, regenera el runtime serializado, copia datos/código y genera `playgroundSkyline.ts` con el skyline de 800px embebido para uso offline. `catalog:check` compara los archivos reales de ambas plataformas. No hay importaciones hacia el repositorio hermano en runtime.

La única dependencia nueva es `react-native-webview@13.15.0`, versión correspondiente a [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/webview/). Permite reutilizar Canvas/Web Audio locales, sin motor 3D ni posiciones de partículas atravesando React Native. El bridge sólo recibe estado y métricas a baja frecuencia. No se carga contenido remoto en el WebView ni se permite navegar desde él a sitios externos; los videos usan la apertura externa existente.

El renderer limita a 1.000 partículas dibujadas en escritorio / 420 en modo compacto; DPR máximo 1,5 / 1,25 y objetivo 60 / 30 fps. La calidad automática reduce densidad si el dibujo excede su presupuesto, sin cambiar eventos ni duración. No hay actualizaciones de React por partícula. El reloj usa tiempo absoluto activo y evita audio acumulado tras un frame tardío. Una orden de background recibida tarde congela el último frame conocido, evitando contar tiempo suspendido.

## Dispositivos y accesibilidad

El ancho de pantalla no decide la disponibilidad web. Se consideran UA/UAData, plataforma, puntero fino, hover y señales de iPad en modo escritorio. Una laptop Windows táctil con mouse/trackpad sigue admitida. Teléfonos, Android identificado e iPad con UA de Mac muestran la alternativa estática. Navegadores desconocidos o sólo con puntero grueso reciben esa alternativa.

No se puede distinguir con certeza una tablet Windows con teclado de una laptop, ni un UA totalmente falsificado que oculte la plataforma real. Estas limitaciones quedan documentadas; no hay fingerprinting invasivo. Los tests cubren fixtures de laptop táctil, Mac, iPad desktop mode y Android.

En la alternativa pública no existe iframe/canvas ni se invoca el import dinámico del motor. Se conserva el catálogo y el enlace iOS exacto con `_blank` + `noopener noreferrer`; Android sigue “Coming soon”. El texto informa que el playground **no está todavía en la versión de App Store**.

Con movimiento reducido se inicia una vista estática, con “Still moment” y texto; la primera acción “Play animation” empieza la secuencia desde cero. No hay ambiente animado, autoplay ni flashes de pantalla completa. Los estados se anuncian sólo al cambiar; el reloj visual no es una región live que hable varias veces por segundo.

## Validación y límites reales

Ver [VALIDATION.md](VALIDATION.md) para resultados finales y [performance.json](performance.json) para mediciones. La interfaz compacta se revisó como documento HTML en Chrome; **no equivale a una prueba de la app nativa**.

Metro quedó bloqueado: `listen EPERM: operation not permitted 127.0.0.1:8087`. `expo start --offline --port 8087` terminó agotando su búsqueda de puertos (`ERR_SOCKET_BAD_PORT`). No se cambió la configuración de seguridad ni se solicitó una excepción. `simctl` enumera iOS 26.4 y dispositivos disponibles, sin un simulador arrancado. No se ejecutó esta actualización en simulador ni dispositivo físico.

Quedan pendientes: interacción táctil y VoiceOver/TalkBack nativos; sonido en WebView iOS/Android y mute/interrupciones del sistema; transición real a background y regreso; orientación y safe areas en la app ejecutada; GPU, batería y fluidez en teléfonos reales. El éxito de typecheck, tests y exportación no demuestra estas propiedades.

Las capturas responsive usan dimensiones de Chrome y, para la alternativa web, el parámetro **sólo de desarrollo** `previewDevice=phone|tablet`. No constituyen una comprobación con UA reales de teléfonos/tablets. La detección se prueba por datos y debe contrastarse además en dispositivos reales antes de publicar.

## Artefactos

- [Comparación de cakes](screenshots/playground-comparison.png), [muestras de shells](screenshots/shell-samples.png).
- [My List editable](screenshots/my-list-desktop.png), [mostrador](screenshots/my-list-counter.png), [teléfono](screenshots/my-list-phone.png), [tablet](screenshots/my-list-tablet.png).
- Alternativa web: [teléfono vertical](screenshots/phone-portrait.png), [horizontal](screenshots/phone-landscape.png), [tablet vertical](screenshots/tablet-portrait.png), [horizontal](screenshots/tablet-landscape.png).
- [Motor compacto, movimiento reducido, en navegador](screenshots/compact-engine-reduced-motion-browser.png) y [horizontal](screenshots/compact-engine-landscape-browser.png).
- PDF compactos: [con fotografías](../../../output/pdf/playground-2026-09/my-list-with-photos.pdf) y [sin fotografías](../../../output/pdf/playground-2026-09/my-list-without-photos.pdf). Generados con los cuatro productos, abiertos/renderizados e inspeccionados; no contienen SKU ni descripciones.

`npm run playground:fixtures` regenera los PDF de revisión y [el documento HTML local del motor compacto](native-engine-review.html). Este documento está en `docs/`, no se incorpora al build público, y no es la app nativa. No hay grabación audiovisual final; se entregan capturas y momentos comparables con los cuadros de referencia.

## Incorporar el siguiente producto

1. Elegir un ID real y una variante exacta, con demostración visible y suficiente; conservar la evidencia de nombre, marca, envase y código.
2. Ver el video real. Registrar introducciones, cortes, velocidad, unidades simultáneas y segmento útil. Si no se puede inspeccionar, no crear un perfil público.
3. Registrar en `playgroundProfiles.json` segmento, tipo cake/shell-sample, número observado, eventos `launch`/`burst` relativos al segmento, forma, paleta, persistencia estimada y limitaciones. Añadir capturas y tiempos a un informe de evidencia.
4. Si el efecto no cabe en las estructuras existentes, ampliar el renderer compartido; no colorear una animación genérica ni añadir efectos no vistos. Revisar el resultado al lado de la referencia.
5. Añadir la disponibilidad al índice, ejecutar sync/check y pruebas. La validación debe rechazar identidades o categorías divergentes, eventos fuera del tramo o paquetes de shells programados como cakes.
6. Revisar reproducción completa, comparación, momentos estáticos, sonido opcional y costos de dibujo. Probar en un teléfono real antes de considerar el perfil listo para lanzamiento nativo.
7. Actualizar informe y fixtures. La publicación y el texto de disponibilidad de App Store requieren una decisión posterior; esta iteración no publica nada.
