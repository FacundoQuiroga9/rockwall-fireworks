# Validación — 24 septiembre 2026

## Verificaciones ejecutadas

| Proyecto | Comando | Resultado |
| --- | --- | --- |
| Web | `npm run lint` | PASS, sin advertencias |
| Web | `npm run test` | PASS, 53 pruebas |
| Web | `npm run build` | PASS; 51 rutas de catálogo/detalle con metadatos |
| Web + mobile | `npm run catalog:check` desde web | PASS; 50 productos, 50 identidades de imagen |
| Mobile | `npm run typecheck` | PASS |
| Mobile | `npm run lint` | PASS |
| Mobile | `npm run test` | PASS, 18 pruebas |
| Mobile | Expo export iOS + Android, offline | PASS; 109 assets, dos bundles Hermes de aproximadamente 3.07 MB |
| Mobile | Expo export web, offline | PASS; 13 rutas estáticas de Expo |
| Ambos | `git diff --check` | PASS |

Las exportaciones emitieron una advertencia del entorno sobre NO_COLOR/FORCE_COLOR; no errores de compilación. No se generó un build firmado ni se publicó la app.

Las nuevas pruebas comprueban comparación de campos por ID entre archivos reales, detección de variantes/imágenes/videos divergentes, IDs/slugs únicos, recursos locales, filtros combinados, favoritos persistidos y corruptos, videos opcionales, trazabilidad Square y metadatos/canonical/sitemap. Las pruebas existentes de temporadas, reloj, hero estático y limpieza de animaciones también pasaron.

## Navegador

Chrome en macOS 26.5.2 (arm64), Node 25.9.0, Vite 6.4.3 y Expo SDK 54. Viewports simulados. **No son pruebas en teléfonos/tablets físicos.**

| Viewport | Tarjetas revisadas | Dimensión de tarjeta | Overflow de página/tarjetas |
| --- | ---: | --- | --- |
| 1440 × 1000 | 50 | 306 × 464 px | Ninguno |
| 834 × 1112 | 50 | aprox. 234 × 464 px | Ninguno |
| 390 × 844 | 50 | 169 × 432 px | Ninguno |

Mediciones guardadas en [card-geometry.json](screenshots/card-geometry.json). Las 50 imágenes cargaron. Los marcos tienen dimensiones reservadas y las imágenes usan contain. No se hizo una prueba de red lenta ni una medición formal de CLS bajo throttling.

Se revisó visualmente catálogo y detalles en los tres tamaños, incluyendo imágenes pequeñas/grandes, nombres largos, logos y el nuevo modelo de filtros. El foco de teclado tiene contorno visible y activa el fondo naranja suave de la imagen; Enter abre el detalle. Las capturas son reales del navegador, no maquetas.

Casos funcionales comprobados:

- Winda + Parachutes + búsqueda Military: un producto; Black Cat + Parachutes: vacío y opción de limpiar.
- Categoría Missiles: USA Saturn Missile Battery. Limpieza y cambios rápidos consecutivos de filtros no recuperan un filtro anterior.
- Guardar desde tarjeta/detalle, recargar, encontrar en Saved favorites y quitar de favoritos. Se limpiaron solamente los favoritos creados para la prueba.
- Filtros sin coincidencias entre favoritos distinguen ese estado de una lista de favoritos todavía vacía.
- About y Contact desde catálogo/detalle llegan a la home y cierran el menú móvil. Borde superior medido: About 102.55 px / Contact 102.91 px frente a un header de 103 px.
- `/#catalog` redirige a `/products`; acceso directo y recarga de detalles funcionan en Vite.
- Diwali Dazzler no muestra bloque de video ni iframe.
- El iframe de YouTube no existe antes de Load video; después se crea con dominio nocookie, título y sin autoplay. El enlace externo está disponible como alternativa. Se inspeccionó el reproductor real; la identidad de los nuevos videos se contrastó con sus páginas/canales, corrigiendo el enlace de la variante compacta de America First.
- La revisión final de consola quedó sin warnings ni errores tras corregir una advertencia de React 18 por `fetchPriority`. Registro: [console-final.json](screenshots/console-final.json).

El movimiento reducido se comprobó en las reglas CSS y en las pruebas automáticas existentes del motor. La rotación sólo se habilita con `prefers-reduced-motion: no-preference`; las transiciones nuevas se desactivan con `reduce`. **No se ejecutó una prueba visual nueva cambiando la preferencia del sistema/DevTools**: el control nativo de Chrome fue rechazado por permisos. No se presenta como realizada.

## Producción y app: límites reales

- Se verificaron los documentos generados, canonical, sitemap y configuración de rewrite. El entorno impidió que Apache local escuchara un puerto (`Operation not permitted`). La configuración del servidor pasó `httpd -t`, pero eso no sustituye una solicitud HTTP a `.htaccess`. Recarga real en Hostinger/LiteSpeed queda pendiente; no se desplegó.
- La app pasó validación estática, pruebas y exportaciones. No estuvo disponible el control de Simulator/CoreSimulator. El intento de servir la exportación web en un puerto adicional también fue bloqueado por el entorno. No se validó una sesión nativa en simulador o dispositivo, ni VoiceOver/TalkBack o reinicio de una app instalada.
- La revisión automática rechazó las descargas de fotografías de Winda y el logo Firehawk por permisos. No hubo intentos de eludir esos bloqueos. Las referencias locales verificadas permitieron publicar los 15 productos nuevos; los casos sin recurso fiel siguen pendientes.
- Las dos ediciones Imagegen se descartaron porque cambiaban el envase. No se afirma que haya 15 fotografías nuevas generadas con iluminación de estudio: se entregan 15 fotos reales verificadas y optimizadas.
- Continúa pendiente la verificación individual completa de 438 candidatos y la resolución de los demás casos detallados en el registro. Una primera búsqueda sin evidencia no demuestra imposibilidad de identificación.

## Capturas y vista previa

- [Catálogo escritorio](screenshots/catalog-desktop.jpg)
- [Detalle escritorio](screenshots/detail-desktop.jpg)
- [Catálogo móvil](screenshots/catalog-mobile.jpg)
- [Detalle móvil](screenshots/detail-mobile.jpg)

Vista previa de desarrollo: http://127.0.0.1:5175/products. El debug del countdown permanece oculto. Para reiniciarla: `npm run dev -- --host 127.0.0.1 --port 5175 --strictPort` desde web. Los overrides temporales del navegador se retiraron al terminar la revisión.

Los hashes de las fuentes originales se comprobaron durante la sesión sin diferencias. En la última relectura, el volumen externo FACUNDO ya no estaba disponible; los originales de Square no pudieron releerse otra vez. El inventario conciliado, las referencias y todos los recursos publicados permanecen dentro de los proyectos. No se requiere ese volumen para ejecutar la web, la app ni el control de paridad. Ver `source-integrity.json`.
