# Cakes expansion · 2026-09-29

Se incorporaron cuatro IDs existentes, sin duplicar productos ni modificar los 56 perfiles anteriores. La app recibe los mismos productos, perfiles e índice mediante `catalog:sync`. No se modificó el diseño, el motor, las otras familias, promociones, gramajes, categorías, favoritos, My List ni PDF. La revisión visual nativa permanece pospuesta por decisión del usuario; no se abrió Simulator, Metro ni se exportó la app.

## Cobertura y alcance

[Conciliación completa por ID](coverage.md) · [Datos y pendientes individuales](cake-coverage.json).

117 cakes: **16 completas, 24 extractos, 77 sin perfil**. Las 77 se desglosan en 54 candidatas todavía sin análisis completo, 13 con referencia que requiere resolver evidencia, 1 bloqueada por identidad (`absolute-pyro`), 5 packs y 4 presentaciones especiales. Los packs y las presentaciones especiales siguen separados; no se simulan como una única cake convencional. Total del Playground: 60 perfiles de todas las familias.

| Incorporación | Código / presentación | Alcance publicado | Aperturas | Primer lanzamiento* | Último lanzamiento* | Última explosión | Fin visible | Duración publicada precisa |
|---|---|---|---:|---:|---:|---:|---:|---:|
| Alien Attack | Happy Family JL523019 · 500g · 25 shots | Completa | 25 | 1.140 | 18.110 | 18.910 | 21.250 | 20.110 |
| Avalanche | Winda P5138 · 200g · 16 shots | Extracto | 15 | 5.620 | 33.130 | 33.930 | 36.550 | 30.930 |
| Viva Mexico | Sky Bacon GM136 · 500g · 19 shots | Completa | 19 | 3.550 | 29.690 | 30.740 | 34.800 | 31.250 |
| Forever Loyal | Pyro Shine MEPS-238 · 500g · 25 shots | Extracto | 19 | 4.120 | 24.340 | 25.390 | 27.180 | 23.060 |

Todas las columnas temporales usan segundos del video original, salvo la última, que es la duración de la ventana publicada. *Los lanzamientos combinan indicios visibles y ascensos modelados: están separados de las explosiones y sus límites se detallan en `timing.launchEvidence`. Precisión aproximada de aperturas ±0.12 s y extinción ±0.4 s; los decimales preservan las mediciones, no implican calibración de fotogramas. El primer indicio de Alien Attack se modela, no se afirma visible. Sólo la presentación pública redondea.

No se completó ningún perfil aprobado en esta iteración. Daffodil se reprodujo íntegramente, pero persiste la discrepancia 15/16; se conserva sin cambios. Los nuevos extractos no equivalen a cakes completas: Avalanche muestra quince centros, incluso el cierre observado, sin conciliar el decimosexto rotulado; Forever Loyal excluye el final superpuesto que no pudo conciliarse.

## Referencias y decisiones

- [Alien Attack — Happy Family](https://www.youtube.com/watch?v=wTSWjZvHc_M): 23.001 s completos, 1x y 0.5x. Cinco salvas de cinco centros, cada una medida independientemente. Naranja/violeta, azul/limón, violeta/verde, rojo/azul y azul/limón/violeta, con blanco secundario. Pausas originales preservadas. [Identidad JL523019](https://americanwholesalefireworks.com/alien-attack/); el envase aprobado también coincide.
- [Avalanche — Winda](https://www.youtube.com/watch?v=xKwSoKkHIo4): 38.581 s completos, 1x/0.5x y repetición del final. Envase y código P5138 coinciden. Fuente oficial de 2012, conservada como versión concreta de demostración. Doce aperturas individuales y tres centros finales; falta conciliar 16/16. La fuente anterior de 2017 corta la caída. [Actualización de video con identidad y URL anterior](video-updates.json) mantiene el acceso incrustado a la fuente utilizada. No se fusionan los tiempos de dos demostraciones.
- [Viva Mexico — Sky Bacon / Spirit of 76](https://www.youtube.com/watch?v=4DyNqNq3Rtk): 38.661 s completos, 1x/0.5x. 3 + 5 + 3 + 5 + 3 centros. Las salvas son desiguales; la intermedia empieza 18.34 s y suma dos centros cerca de 19.04/19.08 s. Brazos dorados que desarrollan puntas rojas/verdes; cierre dorado/crackle a 30.30/30.53/30.74 s. Las transiciones no cuentan como disparos adicionales.
- [Forever Loyal — WINCO](https://www.youtube.com/watch?v=meX3dU3eNm4): 33.741 s completos, 1x y revisiones a 0.5x. Diecinueve aperturas rojas/blancas distinguibles; final denso 28.28–28.69 s excluido. El segmento termina tras la caída seleccionada, antes de la próxima salva. Los pequeños puntos azules bajos no tienen geometría conciliada y no se inventan como disparos independientes.

[Marcas de tiempo por evento y límites](observations.json) · [Índice de capturas de fuentes](source-frame-index.json) · [Siete investigaciones adicionales y siguientes pasos](reference-review.json). Colorful Skies, America First, Galactic Empire, Monkey Business, Fallout y Eagle Pride se reprodujeron completos, pero sus centros superpuestos o componentes bajos siguen sin conciliar. No se publicaron perfiles genéricos para reemplazarlos. Daffodil quedó sin modificación. La prioridad siguiente es resolver esos conteos/colas y los extractos, manteniendo abierta la revisión de las 54 candidatas restantes; esta entrega no declara agotado el inventario.

Se revisaron introducciones, cierres, posibles cortes/cambios de velocidad y zonas de disparo. No se observaron ediciones internas evidentes ni un segundo origen en las cuatro referencias incorporadas; en Alien Attack y Avalanche el origen está fuera del encuadre, por lo que la unidad única es una inferencia apoyada por la demostración identificada. No hay calibración física. Las trayectorias discretas de las tomas oscuras no afirman estelas comerciales verificadas.

Los resúmenes públicos están en inglés natural en [el enriquecimiento canónico](catalog-enrichment.json), sin metodología de investigación. `catalog:sync` los reaplica; las fuentes y la incertidumbre permanecen en los perfiles internos. Se conservaron intervalos, solapamientos y colas, sin estirar ni duplicar secciones. Los componentes secundarios no incrementan el conteo de eventos.

## Revisión web y rendimiento

Se reprodujeron íntegramente los cuatro perfiles publicados en Chrome 153/macOS, Vite local, viewport de revisión 1310 px de ancho. El DPR reportado varió entre 1 y 2 y queda registrado por ejecución. Las capturas periódicas añaden carga: estas cifras son mediciones del renderizador durante la revisión, no un benchmark de dispositivo nativo.

| Ejecución | Calidad solicitada / efectiva | FPS dibujados | Media / máximo dibujo (ms) | Partículas al terminar |
|---|---|---:|---:|---:|
| Alien Attack completa | Auto / High | 58.8 | 1.86 / 31.4 | 0 |
| Avalanche extracto | Auto / High | 60.0 | 0.43 / 2.0 | 0 |
| Viva Mexico completa | High / High | 59.9 | 1.10 / 5.7 | 0 |
| Forever Loyal extracto, sonido 0.20 | Auto / High | 59.7 | 0.28 / 0.8 | 0 |
| Cuatro nuevas | Auto / High | 59.6 | 2.13 / 17.0 | 0 |
| Cuatro, pausa y continuación | High / High | 59.8 | 2.35 / 15.0 | 0 |

[Resultados medidos](browser-validation.json). No fue necesario que Auto bajara calidad en estas tomas; las pruebas automáticas verifican la adaptación bajo carga sostenida. El volumen se fijó mediante el control real y el estado de audio quedó activo sin errores y con cero voces al concluir.

Comparación visual realizada durante toda la ventana: cinco salvas y parejas de color de Alien Attack; alternancia palma/brillo/crackle y cierre observado de Avalanche; palmas con transición de Viva Mexico y su caída larga; continuidad de rojo/blanco y fin anterior al cierre excluido de Forever Loyal. Las formas son una aproximación gráfica, no una reproducción fotográfica de humo o distribución exacta de estrellas.

También se comprobó: cuatro simultáneas, límite de cuatro en UI, búsqueda/filtro Cakes 40, desplazamiento horizontal, selección conservada al cambiar de escenario, incompatibilidad de otras escenas, pausa congelada en 0.3325 s y continuación, reinicio durante ascenso, momentos estáticos con movimiento reducido, oclusión de ascensos por Dallas, último efecto antes de terminar, dos shells manuales durante la secuencia y un tercero después de finalizar las cakes. La memoria existente es durante la sesión del componente; recargar la página reinicia las selecciones, comportamiento previo que no se cambió. My List permaneció en cero.

[Vista pública](evidence/public-playground-four.png) · [Cuatro cakes](evidence/four-cakes-playground.png) · [Grabación WebM](evidence/four-cakes-browser.webm) · [GIF alternativo](evidence/four-cakes-browser.gif). La grabación conserva ~32 s de tiempo real, con ~2 capturas por segundo; no contiene audio ni representa 60 FPS de video. Capturas completas y relojes de revisión permanecen localmente en `artifacts/cakes-2026-09-29/` (ignorado).

La revisión en navegador de Ghost Rings, Hot as Hell y Pirate Captain que dejó pendiente el informe del 28/09 no se marca resuelta por estas pruebas. Sus perfiles no cambiaron.

## Validación y entrega

- Web: `catalog:sync`, `catalog:check`, lint, 181 pruebas y build de producción.
- App: TypeScript, lint y 73 pruebas; paridad de datos/código compartido comprobada automáticamente.
- Los hashes de los 56 perfiles anteriores permanecen iguales; se normaliza únicamente la actualización documentada de la URL de Avalanche en las pruebas históricas comerciales.
- `dist/` se genera para publicación manual y se mantiene ignorado. No se desplegó la web ni se publicó la app.
- Vista previa: http://127.0.0.1:5173/playground. Revisión reproducible: `node scripts/playground/cake-expansion-review.mjs`, luego `/artifacts/cake-expansion-review.html`.
- El CSV preexistente `docs/catalog/2026-08-square/duplicate-skus.csv` y los tres PDF personales quedan fuera de esta entrega.

Resultados de comandos: [validación final](validation.json). Las referencias de fuentes no se confunden con aprobación de toda la categoría.
