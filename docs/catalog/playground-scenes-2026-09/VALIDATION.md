# Validación — escenarios compatibles, 2026-09-26

[Informe y fuentes](README.md). Vista local: <http://localhost:5173/playground>. No despliegue, build firmado ni publicación.

## Comprobaciones ejecutadas

| Proyecto | Comando | Resultado |
| --- | --- | --- |
| Web | `npm run catalog:sync` | Aprobado; 302 identidades, 19 perfiles y cuatro fotografías de bases sincronizados |
| Web | `npm run catalog:check` | Aprobado; paridad de datos, perfiles, módulos compartidos y recursos con app |
| Web | `npm run lint` | Aprobado |
| Web | `npm run test` | **130/130** aprobadas |
| Web | `npm run build` | Aprobado; 303 rutas de catálogo; advertencia de tamaño del chunk existente de PDF, 1.489,30 kB |
| App | `npm run typecheck` | Aprobado |
| App | `npm run lint` | Aprobado |
| App | `npm run test` | **48/48** aprobadas |
| App | `CI=1 EXPO_OFFLINE=1 npx expo export --platform all --max-workers 1 --output-dir dist-playground-scenes` | iOS, Android y web exportados correctamente |

Las salidas de build, exportaciones, logs y cuadros temporales permanecen ignorados. Se conservan como evidencia sólo los recursos de documentación. No se modificaron los dos PDF del usuario presentes en la raíz de web.

Las nuevas pruebas cubren cambios cake → fountain y viceversa, recuperación sin desmarcar un producto recordado, cuatro por familia sin duplicados/reemplazos, filtros independientes, limpieza activa, deselección del último, normalización de restauraciones, perfiles inválidos o incompatibles rechazados en timeline y documento, preferencias y desmontaje durante reproducción. El ensayo del runtime utiliza el renderer real con Canvas simulado y un doble de audio: verifica cancelación del RAF, liberación de audio/listeners, lienzo limpio y contexto nuevo detenido en cero. No equivale a escuchar audio en hardware. Continúan las pruebas de continuidad, cola, reinicio, pausa, redondeo exclusivamente visual, ancla correcta, My List/PDF/promociones y sincronización. Las correcciones del propietario se prueban después de las capas históricas y de sync, con guardas de identidad; una lista anterior conserva cantidades y exige revisión sin beneficios nuevos.

## Recorrido visual y movimiento

Chrome local, UI pública:

- Selección y reproducción de Bump Bear, selección de Fairies desde filtro Fountains: cambio automático al terreno, reproducción detenida, un activo y el aéreo recordado. Regreso seleccionando Band of Brothers: restaura Bump Bear y añade Band. Seleccionar Fairies recordado recupera la fountain sin desmarcarla.
- Cuatro aéreos (Bump Bear, Band of Brothers, Ghostacular y Maelstrom), filtro Fountains: conserva los cuatro y el cielo. Cambio a terreno y selección de Movie Time; volver mediante Golden Peacock con destino lleno recupera los cuatro, informa el límite y deja Golden sin seleccionar. [Aviso y contadores](review/destination-full-scene.png).
- Volumen 1 / calidad Low conservados al cambiar; documento nuevo Ready/0, sonido desactivado y sin autoplay. La captura no acredita reproducción audible. My List conservó su contador independiente.
- [Grabación continua de cambios](review/automatic-scene-switch.webm): 137 capturas reales de la pestaña durante 21,98 s, ≈6,2 capturas/s, codificadas VP9 a sus tiempos originales. Reproducida y verificado el cuadro final decodificado (terreno, uno activo, dos aéreos guardados). No es una medición de FPS del renderer. El texto singular del contador se corrigió después de esa captura. [Metadatos](review/recording-capture.json).
- Se compararon los seis perfiles nuevos con sus fotogramas de referencia. Movie Time: reproducción continua de la interrupción real y el reinicio de emisión, conservando base y cola; `review/movie-time-motion.json` y capturas asociadas. Jumboshell: reproducción del agotamiento hasta Replay/2:30 y oscuridad con envase estable; `review/jumboshell-ending-motion.json` y capturas asociadas. El motor de fountains mantiene partículas con parámetros fijados al nacer y presupuestos acotados.
- [Base real de Movie Time](review/movie-time-base.png), reutilizada de la fotografía aprobada y empaquetada offline para app. Sin imagen generada ni cambios de posición durante etapas.
- Watch the reference de Jumboshell abre `/products/jumboshell-fountain#product-video`. Foco en `video-title`; borde del video a 114,04 px y header a 114,08 px (diferencia subpíxel). Cero iframes antes de Load video; uno después, URL `youtube-nocookie.com/embed/5KN5suDvKhg?rel=0`, diferido y sin autoplay. [Registro](review/jumboshell-video-route.json) y [captura](review/jumboshell-embedded-reference.png). Se conservan controles de movimiento reducido y alternativa externa cuando falla la inserción.

La revisión automática rechazó acceder al control nativo de Google Chrome para completar el selector de captura de pantalla: “Computer Use was not approved to use Google Chrome”. Se canceló ese intento y se capturó continuamente la pestaña mediante el navegador autorizado, sin ampliar permisos.

## Rendimiento

Chrome 153, macOS 26.5.2, ocho procesadores lógicos informados por el navegador; Canvas de 1280 × 640 CSS px, DPR del entorno 2, limitado por el renderer a 1,5 en escritorio y 1,25 en compacto. Sonido apagado. No se estableció el modelo de CPU/GPU. Fixture local `scripts/playground/continuity-review.html`, renderer de producción. Datos completos en `review/performance-*.json`.

| Carga | Calidad / límite | Ventana | FPS | Dibujo medio / p95 | Máximo de partículas |
| --- | --- | --- | --- | --- | --- |
| Cuatro fountains reales | High / 1.000 | 10 s | 60,1 | 1,563 / 2,100 ms | 752 |
| Cuatro fountains reales, compacto | Balanced / 420, 30 FPS | 10 s | 30,0 | 1,542 / 2,100 ms | 415 |
| Cuatro aéreos reales: Band, Ghost Killer, U.S. Power, Golden Peacock | High / 1.000 | 42 s | 60,0 | 0,365 / 0,600 ms | 336 |
| Estrés sintético: cuatro copias densas con aperturas a 1 s | High / 1.000 | 10,02 s | 60,1 | 0,457 / 1,700 ms | 1.000 |

Máximo de dibujo: 9,5 ms en fountains High, 2,3 ms compacto, 0,8 ms aéreos y 5,1 ms estrés. El promedio de estrés incluye tiempo vacío posterior a sus aperturas: no representa carga máxima sostenida. La medición contabiliza trabajo CPU de Canvas, no tiempo GPU, consumo, temperatura o batería. No extrapolar a teléfonos ni confundir modo compacto de Chrome con app nativa.

## Límites reales

El intento actual `xcrun simctl list devices booted` falló: CoreSimulatorService perdió la conexión; `simdiskimaged` código 53 y conexión rechazada 61; acceso al log no permitido. **No se ejecutó la app en dispositivo ni simulador.** Exportaciones y pruebas compartidas no sustituyen navegación táctil, audio físico, GPU, VoiceOver/TalkBack y pausa/reanudación en iOS/Android. El modo compacto y el comportamiento accesible heredados se mantienen cubiertos por sus pruebas; su revisión física queda pendiente.

Old Ironsides sigue sin gramaje confirmado. Extractos y candidatos pendientes se enumeran en [pending.csv](pending.csv); en particular faltan finales reales de Movie Time y Super Fountain y disparos inequívocos de los cakes incompletos. No se fabricaron secuencias completas para aumentar el total.
