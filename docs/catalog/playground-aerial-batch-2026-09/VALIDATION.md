# Validación — tanda aérea, 27 de septiembre de 2026

## Comprobaciones automáticas

Web: `npm run catalog:sync`, `npm run catalog:check`, `npm run lint`, `npm run test` (**151/151**) y `npm run build`: **PASS**. Build genera metadatos de 303 rutas. Permanece la advertencia previa del chunk de miniaturas PDF mayor de 500 kB; no se modifica esa función ni se incluye `dist` en Git.

App: `npm run typecheck`, `npm run lint` y `npm run test` (**66/66**): **PASS**. `catalog:check` compara los archivos reales, perfiles, motor, runtime serializado, fuentes de catálogo y recursos entre proyectos. Permanece la advertencia de Node `MODULE_TYPELESS_PACKAGE_JSON` al ejecutar módulos compartidos; no impide las pruebas y no se cambia el tipo de módulo de Expo por esta tanda.

Las cinco pruebas web nuevas y tres de app verifican bancos de 6 y 12 efectos, límite minorista de 6/24, ciclo sólo de efectos documentados, primer disparo único, pulsaciones rápidas, pausa, continuación, reinicio y contadores separados. Tres cakes conservan sus 43 aperturas mientras se disparan shells antes y después del final. Se comprueban limpieza, una señal de lanzamiento/break por muestra de pantalla dividida, límite global, perlas de las flores en distintas calidades, validación de colas de lanzamiento y paridad. Los 27 perfiles anteriores mantienen sus hashes; todos los campos comerciales ajenos a demostraciones mantienen el hash anterior.

## Revisión web de escritorio

Chrome **153.0.0.0**, macOS **26.5.2**, arquitectura **arm64**, 8 procesadores lógicos expuestos por el navegador, DPR 2. El sistema no permitió consultar marca exacta de CPU/RAM mediante `sysctl`; no se infieren. Servidor Vite local, sin desplegar.

- Hot Dog: secuencia completa y últimas partículas; parejas y final de cuatro centros. Tras comparar con la referencia se alargaron sus trazos, manteniendo sus tiempos.
- Battle Cry: los ocho eventos del extracto y la cola completa; perlas rojas, verdes y blanco frío, sin noveno disparo añadido. Se amplió la distribución de perlas al compararla con los fotogramas.
- Break the Rules: los seis efectos mediante los controles reales, total 6/6, sin eventos dobles, final sin partículas/voces activas. La cola luminosa aparece al emerger por encima de la silueta. La cuarta muestra conserva perlas y flores dentro de un break.
- Chameleon: doce lanzamientos consecutivos, colores y estructuras diferentes; estado 12/24 y siguiente botón 13/24 con la primera muestra revisada. No se representa la pantalla dividida como doble break.
- Comparación de cuatro productos con tres cakes y Break the Rules: pausa/continuación, varias pulsaciones manuales y último lanzamiento cuando las cakes ya terminaron. El progreso automático queda en 35,6 s; el último shell termina a 39,75 s de tiempo activo. Sin reiniciar las cakes ni recontar el primero. [Grabación](evidence/three-cakes-manual-shell.webm), [métricas por observación](evidence/mixed-runtime.json).
- Búsqueda de Hot Dog/Battle Cry y filtro Artillery Shells conservaron las selecciones; cuatro nuevos productos seleccionados, contador 4/4, quinto deshabilitado, filtro Cakes muestra 12 disponibles sin borrar shells.
- Recorrido real `Watch the reference` de Chameleon a `/products/chameleon-shells-24-pack#product-video`: foco en `video-title`, región a 114 px del borde superior, sin iframe hasta pulsar Load video. Después, un iframe `youtube-nocookie.com/embed/3M1DRGY7mYI?rel=0`, sin autoplay, con alternativa externa visible. [Captura](evidence/reference-anchor.png).
- Ciudad, cielo y controles de producción reutilizados. Los lanzamientos y colas permanecen detrás de los edificios; los huecos continúan abiertos. No se cambia el encuadre terrestre, las estrellas ni la presentación alternativa de teléfonos/tablets. My List permaneció en las tres unidades previas; no se tocaron favoritos.

La revisión utiliza `aerial-batch-review.html`, que monta el mismo documento, timeline, audio y renderer de producción. Los botones de escenario de la herramienta sólo facilitan elegir perfiles; no generan una segunda animación. También se verificaron filtros, enlaces, límite y etiquetas en `/playground` y en la ficha real.

## Rendimiento medido y límites

Harness de producción `controls-review.html?aerial-batch`: tres pasadas acotadas de 40 s. Escenario de 1280×640 CSS; backing observado 2564×1284 (incluye el borde del canvas), DPR 2. No se alteran tiempos ni densidad de los perfiles para esta prueba. En bancos manuales el harness lanza el siguiente sólo cuando el control estaría disponible.

| Carga | Calidad solicitada / efectiva | FPS dibujados | Media / p95 / máximo de dibujo | p95 de intervalo | Intervalos >50 ms | Pico partículas activas / puntos dibujados |
| --- | --- | ---: | --- | --- | ---: | --- |
| 3 cakes + Break the Rules, primera pasada de ajuste | Auto / High | 47,90 | 1,967 / 4,4 / 82,5 ms | 33,4 ms | 4 | 444 / 1931 |
| Misma selección, pasada de ajuste | High / High | 49,45 | 1,142 / 2,4 / 4,2 ms | 33,4 ms | 0 | 444 / 1948 |
| 4 bancos manuales, pasada de ajuste | High / High | 50,85 | 0,890 / 2,3 / 4,0 ms | 33,4 ms | 0 | 766 / 1574 |
| 3 cakes + Break the Rules, repetición aislada de ajuste | Auto / High | 59,42 | 0,779 / 1,6 / 2,9 ms | 17,3 ms | 1 | 444 / 1931 |
| 3 cakes + Break the Rules, versión final | Auto / High | 48,35 | 1,636 / 3,1 / 5,0 ms | 33,4 ms | 0 | 444 / 1931 |
| Misma selección, versión final | High / High | 52,70 | 1,130 / 2,3 / 4,6 ms | 33,3 ms | 0 | 444 / 1931 |

Las dos últimas filas corresponden al código final, después del ajuste de distribución interna de flores. Ambas duran 40 s, sin reducción de calidad; heap máximo ≈29,9 y 26,8 MiB. La pasada manual adicional del último ensayo se detuvo antes de 40 s y **no se incluye como resultado completo**. El banco Chameleon final sí se revisó de principio a fin mediante doce lanzamientos reales de interfaz; [registro](evidence/chameleon-final-review.json).

La primera pasada coincidió con comprobaciones/build en otros procesos. Su pico de 82,5 ms se conserva en el informe, sin atribuirlo automáticamente al motor. Se repitió Auto sin compilaciones paralelas: el costo máximo de dibujo fue 2,9 ms; aún hubo un intervalo de planificación superior a 50 ms. No se garantiza 60 fps ni el mismo rendimiento en todos los equipos.

Límite global High **3200 puntos dibujados**, con presupuestos compartidos por producto. Partículas activas y puntos de estela son métricas distintas. No hubo reducción sostenida de calidad en estas pasadas; las pruebas existentes verifican histéresis, reducción y recuperación. Los límites de resolución/calidad no se aumentaron. Heap JS máximo por pasada ≈44,9 / 44,3 / 37,6 MiB; repetición aislada ≈23,9 MiB. Es memoria del contexto web medida por Chrome, no memoria total del proceso/GPU ni una medición nativa.

Datos originales: [versión final](evidence/performance-final.json), [tres pasadas de ajuste](evidence/performance.json), [Auto aislado](evidence/auto-isolated.json). Las métricas de la grabación llevan la sobrecarga de captura y no sustituyen estas mediciones.

## Audio y alcance de las pruebas

Activación explícita a volumen 0,35 en la herramienta de revisión: contexto `running`, señales de lanzamiento y explosión, RMS máximo observado **0,1518**, pico **0,3137**, hasta dos voces en los lanzamientos individuales. Pausa interrumpe audio; al finalizar no quedan voces ni señal. El recorrido con cuatro productos registra también su estado de audio en el JSON. Se preservó la preferencia pública previa de sonido silenciado.

Esto comprueba generación/salida digital, **no confirma escucha física por altavoces o auriculares**. No se redistribuye audio de YouTube. La grabación de pantalla es silenciosa, tiene 175 capturas (~4,2 fps) y preserva sus tiempos originales durante 41,856 s; no es una captura a 60 fps ni una medición de fluidez por sí sola; la activación y pausa del control son visibles.

**App: revisión visual nativa pospuesta por decisión del usuario.** No se abrió Simulator, no se inició Metro, no se usaron dispositivos, no se generaron exportaciones Expo ni se consideró el navegador equivalente a una prueba nativa. Sólo se afirman código, tests y paridad de datos/runtime.

## Pendientes reales

- Battle Cry: resolver 8 aperturas visibles frente a 9 del rack antes de declararlo completo.
- Chameleon: revisión individual de las otras 12 muestras posibles, en particular la izquierda de la cuarta pareja; correspondencia con números oficiales de shells no confirmada.
- Wild Horses: separar aperturas de transiciones de color y resolver el grupo final antes de publicar su secuencia de 25.
- Ghost Rings: resolver 8/9 y representar el color que recorre segmentos del anillo.
- Pendientes anteriores conservados en [CSV](pending.csv), incluyendo referencias completas de fountains. No se amplían otras familias en esta tanda.
- Salida audible física y revisión visual nativa quedan para una etapa posterior. No se efectuó despliegue web ni publicación de app.

## Conectividad Git

Ambos repositorios trabajan en `main`, remoto `origin` por SSH a GitHub. La comprobación previa `git fetch origin` falló en los dos: `Could not resolve hostname github.com: -65563`. Es un impedimento de resolución/conectividad del entorno, no una confirmación de fallo de permisos de la cuenta. El resultado de commit y de los intentos de push se informa con sus hashes en la entrega. No se usa force push ni se reescribe historial.
