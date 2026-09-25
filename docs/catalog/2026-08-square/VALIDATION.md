# Validación del catálogo

Entorno: macOS ARM64, Node 25.9.0, npm 11.12.1; Chrome instalado, Vite 6.4.3 y Expo SDK 54. Verificaciones realizadas localmente el 24 de septiembre de 2026.

| Verificación | Resultado |
| --- | --- |
| Web `npm run lint` | Pasó |
| Web `npm run test` | 46/46 |
| Web `npm run build` | Pasó |
| Conciliación `python3 -B -m unittest discover -s scripts/catalog -p 'test_*.py' -v` | 3/3 |
| App `npm run typecheck` | Pasó |
| App `npm run lint` | Pasó |
| App `npm run test` | 17/17 |
| `EXPO_OFFLINE=1 EXPO_NO_TELEMETRY=1 npx expo export --platform all --output-dir dist/catalog-validation --max-workers 2` | iOS, Android y web exportados |
| `npx expo install --check` con `EXPO_OFFLINE=1` | Indicó dependencias actualizadas; su advertencia aclara que la verificación offline no es concluyente |
| `git diff --check` web y app | Sin errores |

## Datos y recursos

- Los 1.060 Token, SKU, GTIN, nombres originales y variantes coinciden literalmente con el CSV original, incluidos los **34 SKU que empiezan con cero**. La prueba de lectura XLSX/CSV incluye comillas, acentos, celdas vacías y códigos con ceros iniciales.
- Una fila maestra por Token; todos los registros no resueltos aparecen en pendientes. No se fusionaron las cuatro variantes de Festival Balls.
- IDs de los 35 productos únicos, 25 incorporaciones con autorización/evidencia manual, 10 destacados originales. No se publican candidatos probables o en conflicto.
- Paridad entre los datos web reales y la instantánea de la app; los tests de la app comparan sus 35 productos con esa instantánea, incluidos videos, marca, categoría, presentación y orden.
- Fotos locales resolubles, dimensiones y hashes comprobados. `srcset` usa tamaños reales incluso para fuentes menores de 480 px. La inspección visual cubrió los envases importados y la ausencia de marcas de agua de Dynamite.
- URLs de los 24 videos nuevos iguales a las de sus productos de origen, con esquema HTTPS y dominio de YouTube. **No se verificó reproducción ni disponibilidad remota de todos los videos.** No se realizó investigación externa.
- Hashes originales de imágenes web/hero y PNG de los diez productos de la app preservados. Comparación con la instantánea inicial: ningún archivo existente fuera de los módulos del catálogo/tests correspondientes fue cambiado por esta tarea, salvo README de la app.
- Dynamite conserva su estado Git limpio y los hashes de todos sus archivos de recursos/código revisados. Los hashes de ambos originales Square también coinciden; no se escribieron cambios en esas fuentes.

## Navegador web

Pruebas responsive en Chrome, **simulaciones de viewport, no teléfonos físicos**:

- Escritorio 1440×1000: 35 tarjetas comprobadas; altura uniforme de 464 px, sin desbordes de tarjeta ni de detalles.
- Tablet 768×1024: 35 tarjetas, tres columnas, misma altura de 464 px, sin overflow.
- Móvil 390×844: 35 tarjetas, dos columnas, altura uniforme de 432 px, sin overflow.
- Móvil pequeño 320×740: todos los filtros y las 35 tarjetas sin overflow horizontal ni texto desbordado.
- Resultados de filtros: Artillery Shells 8, Assortments 3, Cakes 18, Fountains 2, Reloadables 1, Rockets 3; All 35.
- Carga progresiva 8 → 16 → 24 → 32 → 35, búsqueda combinada `Black Cat 24`, búsqueda sin apóstrofo `Lets Celebrate`, estado vacío y limpieza de filtros verificados.
- Navegación por teclado desde la búsqueda al selector, foco visible y acceso al catálogo mediante `Browse all 35 products` comprobados. Los controles direccionales del carrusel y los diez destacados permanecen separados del catálogo completo.
- Imágenes visibles cargadas; no hubo mensajes de error ni advertencias de consola en las revisiones. La vista final vuelve a ocho productos, filtros limpios y debug oculto.
- Las pruebas existentes de cielo estático, limpieza del motor, movimiento reducido, temporadas y exclusión del debug en producción continúan pasando. Esta tarea no modificó esos motores ni sus configuraciones.

Capturas locales (recortes de la sección, sin alterar el contenido):

- [Escritorio: nuevos productos Winda](../../../artifacts/catalog-expansion/catalog-desktop.png)
- [Tablet: nuevos rockets](../../../artifacts/catalog-expansion/catalog-tablet.png)
- [Móvil web: Bad Cactus y Neon Fish](../../../artifacts/catalog-expansion/catalog-mobile.png)
- [Resultados de filtros a 320 px](../../../artifacts/catalog-expansion/browser-filter-checks.json)

## Limitaciones reales y entrega

La app cuenta con validación de tipos, lint, tests de almacenamiento/búsqueda/integridad y bundles nativos generados. **No se ejecutó en un dispositivo ni en iOS Simulator**: CoreSimulator rechazó la conexión desde el entorno y Computer Use no tiene autorización para controlar Simulator. No se atribuye esa validación estática a una prueba nativa; quedan pendientes layout e interacción real, apertura de videos por el sistema y persistencia de favoritos después de reiniciar una app instalada.

Los tests de favoritos usan el mismo núcleo de almacenamiento y el validador de IDs real con un adaptador en memoria. Cubren los diez IDs anteriores más los nuevos; no reemplazan la prueba de AsyncStorage en un dispositivo. No se generó un build firmado ni se publicó la app.

La vista previa web de desarrollo permanece disponible en **http://127.0.0.1:5175/#catalog**, con una pestaña abierta. Se reutilizó el servidor local existente; el entorno no permite abrir nuevos puertos. Los overrides de viewport del navegador fueron retirados al finalizar.

Cambios locales en ambos repositorios, respetando el trabajo previo. Sin commit, push, despliegue o publicación. Para la siguiente iteración, revisar primero los 73 candidatos probables y 15 conflictos de variantes; los otros 940 registros no tienen una coincidencia específica suficiente en Dynamite. La lista separada de identidades confirmadas sin recurso indispensable está vacía.
