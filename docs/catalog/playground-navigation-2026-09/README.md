# Playground: escenario primero y tanda aérea — 2026-09-27

Continuación de [la tanda aérea anterior](../playground-aerial-batch-2026-09/README.md). 302 productos canónicos; 35 perfiles publicados. No despliegue web ni publicación de la app. La revisión visual nativa está **pospuesta por decisión del usuario**: no Simulator, Metro, dispositivos ni exportaciones adicionales.

## Navegación y compatibilidad

| Escenario público | ID estable | Catálogo publicado | Filtros |
| --- | --- | --- | --- |
| Dallas Sky | aerial | 15 cakes, 11 artillery shells | All (26), Cakes (15), Artillery Shells (11) |
| Open Field | close | Ladybugs, 10 Ball Roman Candle, Skybolt | All (3), Spinners (1), Roman Candles (1), Rockets (1) |
| Close-up | ground | 6 fountains | Sin filtro redundante; búsqueda local |

Un único selector precede filtros/búsqueda, selección y reproducción. El resumen y contador sólo muestran la selección activa. Cada escena conserva hasta cuatro IDs en memoria de sesión; cambiar de escena restablece filtro/búsqueda a All/vacío. Los filtros no alteran selecciones. Clear active selection sólo limpia la escena visible. No toca almacenamiento de favoritos ni My List.

`playgroundCatalog` deriva pertenencia de `profile.scene` y familias de `profile.kind`, nunca del nombre. `toggle` rechaza entradas de otra escena incluso si vienen fuera de los botones. `select`, reservado para accesos desde fichas, abre la escena correcta y agrega sin duplicar ni reemplazar un quinto. Restauración elimina IDs inexistentes, repetidos e incompatibles. El timeline y documento rechazan mezclas y más de cuatro. Pruebas verifican que la unión de los tres catálogos contiene exactamente los 35 perfiles.

Ladybugs tiene giro inicial y ascenso; la Roman candle conserva un chorro de cometas individuales sin explosión esférica. Ambos ya utilizaban el campo abierto. Skybolt se mueve de Dallas a ese campo: su única muestra es un burst distante, con espacio suficiente por encima del horizonte y sin inventar un ascenso ausente. Sólo cambian `scene`, revisión y nota de procedencia; eventos/colores/tiempos permanecen idénticos. No se añaden rockets ni spinners. Fountains mantienen producto real, terreno y composición cercana.

Cambiar escenario destruye el documento anterior, partículas, RAF y audio; el nuevo comienza a cero, detenido, con calidad/volumen/silencio conservados. La misma lógica se copia a la app. El catálogo desplazable evita colocar 26 tarjetas antes del escenario sin límite de altura. La app conserva su composición lateral en pantallas amplias y coloca selección antes del escenario en vertical.

## Tanda nueva

| Producto / identidad | Referencia | Alcance publicado | Tiempo interno / público |
| --- | --- | --- | --- |
| Vertical Limit · Cutting Edge · 200g / 16 shots · SKU inventario 8145270145913 | [Fabricante](https://www.youtube.com/watch?v=vbqaM8cz2ZE) | 16 aperturas, extracto; fundido editorial con brasas presentes | 6,80–38,35 s / Preview · Approx. 32 sec |
| One Bad Mother-In-Law · World-Class · 500g / 16 shots · SKU 8052531503712 | [OCFireworks](https://www.youtube.com/watch?v=RCZOKivGERU) | 16 aperturas, extracto; últimas brasas alcanzan límite del video | 0,80–34,20 s / Preview · Approx. 33 sec |
| Strobing Willow · Raccoon RA22004 · 200g / 25 shots | [Fabricante](https://www.youtube.com/watch?v=prG4cr0TASo) | Primeras cinco aperturas resueltas; extracto | 6,65–15,65 s / Preview · Approx. 9 sec |
| G-Force · Winda P8031 · 4-inch / 24-shell kit · UPC 705108803101 | [Fabricante](https://www.youtube.com/watch?v=7pGhF7fvvN0), [modelo actual](https://www.getwinda.com/product-page/g-force) | 12 muestras individuales, 1 break por shell; orden de exploración | Ventanas individuales 3,35–4,65 s; primera muestra ≈4 s |

**Altas: 3 extractos de cakes y 1 banco de muestras de shells; ninguna secuencia completa nueva.** Total: 35 perfiles = **10 secuencias completas + 11 extractos + 14 muestras**. Por familia: 15 cakes (6 completas, 9 extractos), 11 artillery shell banks, 6 fountains (4 completas, 2 extractos), 1 Roman candle, 1 spinner y 1 rocket. Los 11 bancos de shells contienen 50 efectos revisados y 56 breaks; el número de muestras no equivale a unidades comerciales.

La revisión final del reproductor completo de Vertical Limit mostró brasas durante el fundido editorial (≈38,35–38,60). Por eso se conserva como extracto aunque sus dieciséis aperturas estén contadas. No se usa la duración del archivo ni una cola simulada como especificación comercial. Los tiempos del perfil no se redondean.

### Observaciones de cakes

- Vertical Limit: aperturas absolutas 7,65; 10,06; 12,09; 14,51; 16,08; 17,63; 19,40; 20,55; 22,84; 24,84; 26,77; 28,44; 30,84; 32,70; 34,44; 35,75 s. Ramas cálidas cobre/oro, pequeñas flores crepitantes diferidas, ascensos plateados visibles en la parte posterior. Una zona aparente de lanzamiento; sin corte ni cambio de velocidad observado en la ventana. Primeros tres ascensos no resueltos: no se dibujan. Cámara cercana/exposición impiden inferir altura o luminosidad física.
- One Bad Mother-In-Law: 1,87; 3,91; 6,89; 9,13; 11,93; 13,88; 16,04; 18,49; 20,45; 22,89; 26,14; 28,17; 30,80; 30,87; 30,90; 30,97 s. Doce aperturas separadas y cuatro centros superpuestos en el final (estimación individual ±0,1 s). Perlas rojas/verdes, ramas doradas y flores plata densas; una unidad aparente, sin edición de velocidad observada. El encuadre no permite resolver todos los ascensos. No se añade una cola comercial verificada.
- Strobing Willow: 6,87; 7,88; 9,73; 11,46; 13,41 s. Perlas azul, verde, rojo; después dos aperturas con glitter pálido y ramas cálidas. La secuencia posterior se acelera y superpone: queda pendiente separar centros antes de ampliar a 25. Una zona aparente de lanzamiento, sin corte dentro del extracto. No se repite el fragmento para rellenar el total.

Los perfiles nuevos recibieron revisión en el renderer real. Se corrigió la altura de las aperturas de las dos primeras cakes: `event.y` es un desplazamiento relativo a la altura base, no una coordenada absoluta. Se conservan las diferencias relativas observadas en un encuadre ilustrativo. Los 30 perfiles anteriores restantes no cambian; Skybolt sólo recibe la modificación de escena descrita arriba. Los hashes anteriores y comparación estructural lo comprueban.

### G-Force: banco manual

| Efecto de exploración | Ventana absoluta | Apertura | Lectura visual |
| --- | --- | --- | --- |
| 1 | 4,75–8,65 | 5,68 | Perlas rojas, glitter cálido |
| 2 | 8,75–12,50 | 9,65 | Flores doradas crepitantes |
| 3 | 13,05–16,55 | 14,15 | Estrellas rojas y glitter plateado |
| 4 | 17,65–21,00 | 18,85 | Perlas verdes, glitter dorado |
| 5 | 21,70–26,00 | 23,20 | Palma pálida con caída dorada |
| 6 | 27,00–31,65 | 28,65 | Palma dorada y glitter pálido |
| 7 | 32,30–36,05 | 33,72 | Perlas verdes con ramas cobre |
| 8 | 36,20–40,00 | 37,50 | Palma dorada de puntas rojas |
| 9 | 40,05–44,00 | 41,65 | Palma dorada de puntas verdes |
| 10 | 43,65–47,80 | 45,18 | Palma naranja que cae a oro |
| 11 | 48,15–52,00 | 49,82 | Perlas multicolor y glitter plateado |
| 12 | 52,00–56,85 | 53,32 | Ramas doradas prolongadas |

El video oficial antiguo muestra P8031 y su caja amarilla. La presentación minorista es 24; 96 corresponde a caja mayorista y no al contador. Correspondencia de lote no verificada; el listado actual de 24 efectos no autoriza inventar doce variantes no vistas. Se revisaron las doce muestras sin pantalla dividida, sin unidades simultáneas observadas ni cambio de velocidad aparente. Introducción/fundido inicial excluidos. Algunas puntas exceden el encuadre de referencia; extensión radial ilustrativa.

Play consume una vez el primer efecto. Las siguientes pulsaciones avanzan el banco, y el disparo 13 repite el primero con la etiqueta de 12 efectos documentados visible. Un shell produce un break; glitter y flores son componentes, no explosiones independientes. Pausa/calidad no consumen otro shell; reinicio reproduce el mismo orden. Las cakes siguen su reloj y los controles manuales continúan tras su final. La repetición no se presenta como una secuencia oficial de 24 efectos distintos.

## Sistema de lanzamiento

[Correcciones persistentes](launch-system-corrections.json) fija identidad, marca, fotografía, presentación, fuentes y alcance. [Auditoría de los 38 registros](launch-system-audit.json) separa 16 confirmados y 22 pendientes. `launchSystem` es un atributo opcional; sólo se representa en el detalle web/app. No se deduce desde la categoría ni el nombre. Unknown no muestra “non-reloadable”. No hay instrucciones operativas.

Confirmados como **Reloadable shell kit**:

- Black Cat: Diablo, Neon Diablo, The Patriot. Fabricante identifica kits/modelos dentro de Reloadables; no se sustituye Diablo por Diablo Select.
- Winda: Double Dragon, Chameleon Shells, G-Force. Código/modelo y presentación contrastados con fabricante y distribuidores que indican kits recargables.
- Brothers: Ruckus, Maelstrom, Full Speed, Quest. Fichas oficiales de Artillery Shell Kits, modelo y presentación exactos.
- Raccoon: Arms Depot, Break the Rules, Flawless, Sniper Fire, Nishiki Blast, Peacock Spider. Modelos originales y packs exactos; sin mezclar reemplazos compactos, Holy Nishiki o cajas mayoristas.

Fuentes por producto en el JSON; ejemplos: [Black Cat](https://blackcatfireworks.com/fireworks/reloadables/neon-diablo-24/), [Brothers Ruckus](https://www.brotherspyrotechnics.com/ProductDetails/829), [G-Force P8031](https://americanwholesalefireworks.com/g-force/), [Arms Depot RA11601](https://usa-fireworks.com/products/artillery-shells/arms-depot/). Promociones, BOGO, categoría comercial, gramajes, cantidades guardadas e imágenes permanecen intactos. No se confirma ningún tubo precargado de un solo uso por descarte.

## Continuar sin perder paridad

1. Revisar esta auditoría y los pendientes anteriores. Mantener los IDs; no reutilizar perfiles con una paleta diferente como evidencia de otro producto.
2. Revisar video real con el reproductor completamente visible; separar aperturas, colas y fundidos editoriales. Registrar ventanas absolutas y tiempos relativos. Fotografías/modelo confirman identidad, no altura física.
3. Crear perfil en `src/data/playgroundProfiles.json` y entrada en el índice; declarar `scene` válido y alcance. Documentar cada muestra del banco por separado.
4. Enriquecer textos mediante `catalog-enrichment.json`. El sistema de lanzamiento se modifica mediante el overlay con identidad protegida. `catalog:sync` aplica ambos después de los overlays históricos y genera app; no editar sólo las copias.
5. Ejecutar sync/check, pruebas y revisión web de la ventana completa; medir cuatro productos con el motor real. No modificar el ritmo para aparentar más calidad.
6. Mantener revisión visual nativa pospuesta hasta que el usuario autorice esa etapa. TypeScript/lint/tests no equivalen a validación en dispositivo.

Pendientes concretos: cola sin edición para Vertical Limit y One Bad Mother-In-Law; últimas veinte aperturas de Strobing Willow; doce efectos adicionales de G-Force y correspondencia de lote; Colorful Skies RA22003 (25 centros superpuestos aún no resueltos en [referencia](https://www.youtube.com/watch?v=7gcAO4M6p8s)); candidatos Wild Horses, Ghost Rings y Neon Boom del lote anterior sin análisis suficiente. Las 22 fichas con sistema desconocido requieren documentación de la presentación exacta, según su motivo individual en la auditoría.

## Validación y evidencia

- Web: `catalog:sync`, `catalog:check`, lint, 156 pruebas y build aprobados. El build conserva la advertencia existente de chunk grande de miniaturas PDF; no se cambia ese generador.
- App: TypeScript, lint y 68 pruebas aprobados; paridad exacta de perfiles, índice y módulos compartidos. Revisión visual nativa pospuesta por decisión del usuario.
- Navegador: filtros y conteos de las tres escenas, búsqueda local sin cruce, limpieza/reset de filtros al cambiar, recuperación de selecciones, límite de cuatro sin reemplazo, entrada Citrus desde ficha y activación con Enter. My List mantuvo tres unidades; no se modificaron favoritos. Cambiar durante reproducción dejó el nuevo escenario detenido, sin partículas anteriores. Tests ejercitan además destrucción de audio/RAF y restauración inválida.
- Se reprodujeron las tres nuevas ventanas de cakes y las doce variantes de G-Force en el documento real; se verificó pausa/continuación, continuación manual después de las cakes, contadores y ausencia de errores de consola. El skyline conserva oclusión y el cielo estable. No hay cambios al renderer, fountains, calidad ni sonidos de la iteración anterior.
- [Capturas de los tres escenarios](evidence/three-scenes.jpg), [Dallas](evidence/dallas.jpg), [Open Field](evidence/open-field.jpg), [Close-up](evidence/close-up.jpg). Son composiciones de dos posiciones de desplazamiento de la misma interfaz: menú y escenario visible, necesarias porque Chrome omite el iframe fuera del viewport en una captura de página completa. No se recrean efectos.
- Referencias: [Vertical Limit y su fundido](evidence/vertical-reference.jpg), [Strobing Willow](evidence/strobing-reference.jpg), [muestras de G-Force](evidence/force-reference.jpg). Recortes de fotogramas para análisis interno, con tiempos absolutos; no se distribuye el video o audio de YouTube como recurso de la simulación.
- [Grabación de la interfaz](evidence/new-demonstrations.webm): tres cakes y G-Force, pausa/continuación y disparos manuales después del final automático. Captura temporal real de 41 segundos, ≈3,5 imágenes/s codificadas sin acelerar; video silencioso. No es una medida de FPS del motor ni un montaje de momentos elegidos.

### Medición acotada

[Datos completos](evidence/performance.json). Chrome 153 en macOS, DPR 2, ocho procesadores lógicos expuestos; Canvas CSS 1280×640, buffer 2564×1284. Modelo físico no identificado. Tres pasadas de 40 segundos con el renderer/timeline/controlador de calidad de producción, pestaña en primer plano, sin grabación simultánea. CPU de Canvas y heap JS observados; no GPU, batería ni nativo.

| Carga | Calidad solicitada / efectiva | FPS dibujados | Dibujo medio / p95 | Pico partículas activas / puntos dibujados | Heap pico |
| --- | --- | --- | --- | --- | --- |
| Vertical Limit + Mother-In-Law + Strobing Willow + G-Force repetido | Auto / High | 59,62 | 0,277 / 0,5 ms | 878 / 903 | 25,1 MB |
| Mismos cuatro | High / High | 60,02 | 0,259 / 0,5 ms | 878 / 903 | 25,7 MB |
| G-Force + Chameleon + Nishiki Blast + Double Dragon, manual repetido | High / High | 60,00 | 0,466 / 0,9 ms | 767 / 1.588 | 26,8 MB |

p95 entre cuadros ≈16,8 ms, ningún intervalo >50 ms y ningún ajuste de calidad durante estas pasadas. Límite global 3.200 puntos sin cambiar estructura, colores ni tiempos. Auto eligió High en este entorno; estas cifras no garantizan el mismo resultado en otro dispositivo.

[Audio digital](evidence/audio-metrics.json): contexto running tras interacción, volumen 0,35, pico 0,304, RMS máximo 0,148, ocho voces como máximo y RMS final cero. Señal sintetizada/comprimida comprobada, **salida física audible no verificada**. No se redistribuye audio de referencias.

Vista local: `http://localhost:5173/playground`. El intento de abrir un segundo servidor preview en `127.0.0.1:4173` fue rechazado con `listen EPERM`; se conserva el Vite existente. El build se generó correctamente. Nada fue desplegado.
