# Playground: continuidad, bases reales y segundo lote — 2026-09-26

> Continuación vigente: [escenarios compatibles y ampliación](../playground-scenes-2026-09/README.md). Este informe conserva los resultados de la iteración anterior; Jumboshell ya tiene una referencia completa y existen 19 perfiles.

Continúa [evolution](../playground-evolution-2026-09/README.md). Este informe reemplaza su estado de siete perfiles, sus textos comerciales y la restricción histórica de no hacer commit/push. La autorización actual incluye versionar ambas iteraciones pendientes y esta revisión, sin despliegue ni publicación.

Vista local: <http://localhost:5173/playground?product=fairies-in-a-jar>. Catálogo: 302 productos. Playground: **13 perfiles**, seis cakes, cuatro muestras individuales de shells y tres fountains. Cuatro secuencias completas, cinco extractos y cuatro muestras de shells. Los primeros cuatro perfiles conservan exactamente sus datos y eventos aprobados.

## Causa y corrección

El renderer anterior calculaba `stage = profile.stages.find(...)` con el tiempo actual y aplicaba inmediatamente su altura, apertura, intensidad, paleta y ramificaciones a **todas** las partículas. Aunque el reloj no reiniciaba el emisor, una partícula viva cambiaba de trayectoria y color al cruzar el límite. Además, `time >= profile.duration` eliminaba todo el dibujo y el reloj concluía sin cola; el siseo se regeneraba en cues discretos de un segundo. El HTML histórico `../playground-evolution-2026-09/ground-review.html` conserva ese código para comparación.

`playgroundFountain.js` ahora asigna nacimiento e identidad estables a cada partícula. Altura, apertura, densidad e intensidad se interpolan al **emitir**, y esas propiedades permanecen inmutables durante su trayectoria. Se elige una paleta por nacimiento, con probabilidades ponderadas durante el solapamiento: no se recolorean partículas vivas, no se mezclan colores hacia gris y no se suman dos emisores completos. Cada transición tiene su propio `transitionSeconds`, incluidos cambios rápidos. Las salidas inclinadas de Super Fountain comparten el mismo presupuesto de emisión.

`ending.fadeStart`, `emissionEnd` y `tailSeconds` separan agotamiento, cese de emisión y últimas partículas. El reloj usa `playbackDuration`; la etiqueta comercial usa la duración de evidencia, sin incluir un cierre de simulación. El chorro pierde densidad, altura e intensidad; las partículas existentes conservan su vida. Luz local y siseo siguen la envolvente. Un único buffer de ruido y una voz en bucle por fountain reemplazan los cues repetidos. Las voces se liberan después de su envolvente, antes de la última cola visual. Pausa, reinicio, salida de pantalla, selección y destrucción limpian los recursos.

Muestreo acotado: 150 candidatos/s × 2,2 s de vida máxima; no hay acumulación por frame. Presupuesto compartido de 1.000 puntos dibujados en desktop / 420 en compacto; DPR 1,5 / 1,25. La trayectoria se reconstruye desde tiempo absoluto: pausa y continuación conservan identidades.

## Fotografía del producto

`src/data/playgroundBases.json` separa la presentación del perfil: tipo de recurso, fotografía aprobada, recorte alfa, proporción, escala y posición de cada salida. Se reutilizan tres WebP de 320 px, sin logos o envases inventados. Caja de dibujo estable, sombra de contacto y luz cálida discreta; se dibuja el envase detrás de las chispas. La imagen permanece cuando termina el efecto. Cambiar posteriormente a una representación con volumen sólo requiere extender la capa de presentación, no los perfiles.

Sync genera `playgroundBaseImages.ts` para la app con las mismas fotografías embebidas y funcionamiento offline. No se agregó motor 3D ni dependencia de gráficos.

## Lotes analizados

| Producto / identidad | Alcance funcional | Referencia y tramo | Diferencia representada |
| --- | --- | --- | --- |
| Jaws · Brothers BP2377 · 200g, 16 shots | Secuencia completa, 47 s | [Video](https://www.youtube.com/watch?v=OgutQQqqgfY), 6–53 s | Trece lanzamientos espaciados con cometa rojo y grupos dorados secundarios; tres aperturas próximas al final. |
| American Anthem · Raccoon RA57218 · 500g, 9 shots confirmados en presentación | Extracto, 29 s | [Video](https://www.youtube.com/watch?v=XlKS1F6et98), 8–37 s | Ocho aperturas resueltas con puntos rojos, blancos y azules por sectores. La novena no se inventa. |
| Flawless · Raccoon RA32409 · 5-inch, 24-pack | Una shell, 3,8 s | [Video](https://www.youtube.com/watch?v=YEuMKW3NufM), 3,7–7,5 s | Radios dorados finos, puntas ámbar y persistencia descendente. No se atribuye este efecto a todo el paquete. |
| Ruckus · Brothers BP2690 · 12 ball shells | Una shell, 2,4 s | [Video](https://www.youtube.com/watch?v=ELEFbRe_f-I), 5,25–7,65 s | Apertura de radios dorados y puntos blancos, cola breve; se excluyen las otras shells. |
| Jumboshell Fountain · Brothers BP4247 | Extracto, 125,5 s | [Video](https://www.youtube.com/watch?v=hOgReJdyXEs), 6–131,5 s | Chorro verde/dorado, fase dorada más alta, blanco y grupos ramificados. Foto del envase esférico. |
| Super Fountain · Brothers BP4252 | Extracto, 99 s | [Video](https://www.youtube.com/watch?v=T8JH5_0zwBc), 8–107 s | Comienzo por una salida lateral, abanico de tres chorros, grupos de color y fase central final del extracto. |
| Fairies in a Jar · Brothers BP4315 | **Actualización a secuencia completa**, 74,4 s | [Spirit of ’76](https://www.youtube.com/watch?v=btb6yA59VGU), 2,6–77 s | Blanco/dorado con rojo, grupos azules/blancos, regreso rojo/dorado y agotamiento visible hasta brasas aisladas. |

Las URL exactas, notas de identidad, límites y tiempos están en `src/data/playgroundProfiles.json`. La tabla se valida contra ese archivo; no usar el título de un video como único criterio de identidad.

Se vio el video real silenciado y se conservaron fotogramas decodificados y tiempos en `evidence/`. Jaws se muestreó cada segundo y su final cada ~0,267 s; el resto de cakes tiene muestreo de un segundo, fountains cada cinco segundos más límites y shells con cuadros cercanos al primer burst. Los tiempos de explosión son estimaciones visuales, no medición de laboratorio. Fountains: límites aproximadamente ±2–2,5 s; los cuadros densos de Jaws permiten distinguir los tres últimos lanzamientos. No se observó un segundo producto simultáneo ni un corte dentro de los tramos utilizados. No se verifica audio original, altura física, potencia o dispersión segura.

La referencia anterior de Fairies terminaba durante la actividad. Se conserva en `fairies-excerpt-before.json`; `video-updates.json` aplica la sustitución de URL con controles de identidad durante sync. La toma más larga muestra el debilitamiento alrededor de 65–70 s, brasas aisladas a 75–76 s y el efecto apagado a 77 s. Jumboshell y Super terminan sus videos con actividad: ambos llevan `ending.kind = simulation`; su cierre **no** aparece en el texto comercial y la duración se etiqueta Preview.

Comparación visual: `review/*-render.png` y `review/three-fountains-public.png` frente a `evidence/*-sheet-*.jpg` y cuadros individuales. Las formas, densidades y trayectorias siguen siendo ilustrativas. Los grupos secundarios de Jaws tienen desarrollo propio; Flawless usa radios persistentes, Ruckus cola corta con puntos blancos y Anthem sectores de color. No son duplicados con otro nombre.

## Copia comercial, duración y referencia

La corrección persistente está en `../playground-evolution-2026-09/catalog-enrichment.json`. Las trece descripciones son redacción comercial; fuentes, notas, conteos observados y límites se conservan internamente. Sólo `confirmedShots` se publica como cantidad; una muestra de shell se identifica como tal. Se mantienen las especificaciones confirmadas previas.

Ejemplos:

- Bump Bear: “Sixteen colorful palms rise in a steady rhythm, trailing glittering silver sparks.” — **Approx. 24 sec · 16 shots**.
- Band of Brothers: “Multicolor bursts settle into white glitter, building to three closely spaced bursts.” — **Approx. 34 sec · 12 shots**.
- Jumboshell: **Preview · Approx. 2 min 6 sec**; el perfil conserva 125,5 s y su cierre de simulación separado.
- Fairies: **Approx. 1 min 14 sec**; 74,4 s precisos en datos y reloj.

`playgroundPresentation.js` redondea únicamente etiquetas, con acarreo correcto de minutos. Ningún evento, sincronización o perfil consume el resultado redondeado. El aviso ilustrativo general permanece al lado del escenario.

Web: `productVideoPath(product)` usa `/products/:slug#product-video`. Desde Playground abre la ficha correcta; desde la ficha hace scroll a su único reproductor. `ScrollToTop` espera el montaje de rutas, compensa el header con `scroll-margin-top`, mueve foco al título y respeta movimiento reducido. Click repetido también funciona. Cero iframes YouTube antes de “Load video”, uno después; sin autoplay. Se muestra una explicación y alternativa externa si la inserción no está disponible. No se detecta el error interno cross-origin del reproductor; el mensaje de ayuda permanece visible. App conserva apertura externa.

## Continuar incorporando productos

1. Revisar código/variante/envase aprobado y video real; separar unidades simultáneas y cortes. Si sólo se conoce una shell, mantener `shell-sample`.
2. Guardar evidencia y tiempos **realmente decodificados**. No etiquetar como evidencia un screenshot tomado antes de finalizar el seek.
3. Crear eventos o etapas específicos. En fountains definir cierre `observed` o `simulation`, cese de emisión, cola y duración de reproducción. No repetir extractos para simular una secuencia completa.
4. Añadir presentación de base separada, foto aprobada y puntos de emisión; nunca incrustar datos de packaging en las etapas.
5. Añadir índice y copia persistente, y una actualización de video con identidad cuando cambie la referencia. Mantener conteo confirmado separado del resuelto en video.
6. Ejecutar sync/check, revisar visualmente junto a la referencia, probar continuidad/final/ciclo de vida y actualizar los informes de ambas plataformas.

Pendientes concretos: Full Speed BP-A113 muestra varias aperturas por shell; el primer levantamiento y aperturas a distintas alturas no están resueltos con suficiente detalle para representar todas las cargas. Daffodil conserva 15 de 16 explosiones resueltas; Ghost Dragon 8 de 9; American Anthem 8 de 9. Jumboshell y Super necesitan una toma con final real visible. Los otros 289 productos del catálogo no tienen perfil revisado; su existencia en catálogo o la disponibilidad de URL no acredita secuencia analizada.

## Validación y entrega

Ver [VALIDATION.md](VALIDATION.md), [grabación](review/fountain-transition-and-exhaustion.webm), [bases reales](review/three-fountains-public.png) y [video incrustado](review/embedded-reference.png). Las restricciones nativas y mediciones de navegador se reportan por separado. Los HTML históricos de revisiones anteriores son evidencia de esas revisiones, no fixtures del motor actual. El fixture actual es `scripts/playground/continuity-review.html`, sólo desarrollo; no aparece en el build público.
