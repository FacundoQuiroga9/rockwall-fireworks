# SPA y cakes — 28 de septiembre de 2026

Se corrigió la fuente de reglas Apache/LiteSpeed y se implementaron tres perfiles de cakes, sincronizados con la app. **La revisión de las demos originales está hecha; la reproducción visual de los tres perfiles nuevos en navegador local y la prueba HTTP de Apache siguen pendientes por restricciones del entorno.** No se desplegó la web ni se publicó la app. La revisión visual nativa continúa pospuesta por decisión del usuario.

## Navegación directa y publicación

La consulta pública del 28/09 a las 15:21 UTC devolvió `404` para `/playground` y `/products`, pero `200` para `/` y `/playground.html`. El servidor se identificó como **LiteSpeed / Hostinger / hPanel**. El cuerpo de error era la página del hosting; no era React. El HTML exitoso tenía Last-Modified `2026-09-28 15:06:48 GMT`; el cuerpo 404, `2025-04-22`. Son observaciones del sitio publicado antes de estos cambios, no una verificación del build nuevo.

El `.htaccess` anterior **sí existía localmente** en `public/` y `dist/`, con el mismo contenido. Por tanto, no está probado que Vite omitiera el archivo. La evidencia muestra que el fallback no se estaba aplicando en producción; sin acceso a hPanel no permite distinguir entre archivo oculto omitido al subir, document root equivocado, otro `.htaccess` o configuración de overrides/rewrite. El funcionamiento de Vite no demuestra nada sobre Apache.

La fuente definitiva es [`public/.htaccess`](../../../public/.htaccess):

- `Options -MultiViews` impide que `/playground` se resuelva por negociación a `playground.html`; `-Indexes` evita listar directorios.
- Los archivos existentes conservan su respuesta normal.
- Recursos ausentes bajo `assets`, `images`, `fonts`, `catalog-pages`, o con extensión incluso antes de una barra, devuelven 404. Nunca reciben el `index.html` de la SPA.
- Las rutas existentes de la app se reescriben internamente a `index.html`, conservando URL y query. Se evalúan antes del bypass de directorios para soportar carpetas remanentes de subidas anteriores.
- Los demás directorios reales quedan en manos de Apache. El fallback final cubre las rutas sin extensión. No se redirige a la home.
- `ErrorDocument 404 default` impide heredar un error que convierta un recurso ausente en la SPA.

`build-pages.mjs` genera 303 documentos en `catalog-pages/` y un archivo `playground.html`; **no genera directorios `/products` ni `/playground`**. Los documentos HTML siguen accesibles como archivos; las rutas canónicas de aplicación sirven `index.html`. Se corrigió la explicación anterior del README, que decía que esos documentos se servían en las rutas canónicas.

Después de cada build, `check-build.mjs` exige que `dist/.htaccess` sea idéntico a la fuente, verifica los entrypoints y elimina del output los archivos de revisión de `public/artifacts`. `hosting:package` incluye archivos ocultos y coloca `index.html` y `.htaccess` en la raíz del ZIP; verifica su integridad y escribe un manifiesto SHA-256.

### Qué revisar exactamente en Hostinger

1. En hPanel, seleccionar **el sitio rockwallfireworks.com**, abrir su File Manager y confirmar el **document root de ese dominio**. Habitualmente se llama `public_html`; no asumir que otro `public_html` de la cuenta corresponde al mismo dominio.
2. Activar la visualización de archivos ocultos. En la misma carpeta que `index.html`, comprobar que existe **`.htaccess`**, con ese nombre exacto y sin sufijo `.txt`. Reemplazar su contenido por el del build. Subir el contenido de `dist/`, no una carpeta `dist` dentro de `public_html`; un patrón `dist/*` puede omitir archivos ocultos. El ZIP preparado evita esa omisión.
3. Si sigue devolviendo el 404 del hosting, comprobar que LiteSpeed tiene habilitado rewrite y lee el `.htaccess` de ese document root. En Apache 2.4 deben estar cargados `mod_rewrite` y `mod_dir`, y `AllowOverride` debe permitir **FileInfo, Options e Indexes** (o `All`). Revisar las reglas de `.htaccess` de carpetas superiores y cualquier redirect/fallback configurado en hPanel.
4. Si aparece 500 después de subir, leer el error log del dominio: puede señalar una directiva `Options`/`DirectoryIndex` no permitida por el proveedor. No ocultar el error con `<IfModule>`; pedir al hosting que habilite esas directivas o aplique las reglas equivalentes en el vhost.
5. Tras una subida autorizada por separado, ejecutar `npm run hosting:check -- https://rockwallfireworks.com` y revisar todas las respuestas. Si hay caché LiteSpeed/CDN, invalidarla una vez confirmado el archivo correcto. Esta tarea no hizo ninguna subida ni cambió el hosting.

### Verificación Apache reproducible

```sh
npm run build
node scripts/apache-preview.mjs --syntax
npm run hosting:serve
# En otra terminal:
npm run hosting:check -- http://127.0.0.1:4180 --fixtures
```

El preview usa `/usr/sbin/httpd` y módulos de macOS; no modifica `/etc/apache2`, no inicia el servicio del sistema y sólo escucha en loopback. Copia el build a `artifacts/apache-preview/site`, activa MultiViews a nivel padre y crea directorios antiguos `playground/` y `products/` para comprobar que el `.htaccess` local prevalece. Incluye un archivo real de control en otro directorio.

El checker solicita las rutas estáticas, los **302 slugs**, barras finales, queries, HEAD, assets reales, metadatos y recursos inexistentes. Rechaza redirecciones, HTML devuelto como recurso y respuestas distintas del index en rutas SPA. Es una prueba HTTP, no un intérprete de reglas ni una prueba de Vite.

**Resultado disponible:** Apache 2.4.66 acepta la sintaxis del `.htaccess`, incluido explícitamente dentro de `Directory`. **Resultado pendiente:** el sandbox rechazó abrir el socket local con `Operation not permitted`. Se solicitó al usuario ejecutar `npm run hosting:serve`. El navegador también rechazó `file://` por política; no se eludió ese bloqueo. No se presenta la validación de sintaxis como prueba de rutas.

## Incorporaciones y fuentes

| ID / identidad | Alcance implementado | Ventana original | Duración | Fuente |
|---|---|---|---|---|
| `ghost-rings` — Winda P5498, 500g, rack de 9 | Completa, 9 aperturas | 4,40–43,50 s | 39,10 s | [Demo Winda](https://www.youtube.com/watch?v=bmPKTKRDG4c), [ficha oficial](https://www.getwinda.com/product-page/ghost-rings-9-s) |
| `hot-as-hell` — Raccoon RA57216, 500g, rack de 9 | Completa, 9 aperturas | 10,00–48,85 s | 38,85 s | [Demo del catálogo](https://www.youtube.com/watch?v=yFp0xaHG-qY), [identidad minorista](https://americanwholesalefireworks.com/hot-as-hell/) |
| `pirate-captain` — Raccoon RA22518, 200g, 21 shots | **Extracto**, 16 centros resueltos; salva final excluida | 2,89–25,90 s | 23,01 s | [Demo oficial Raccoon](https://www.youtube.com/watch?v=SRH8mSodlK8) |

Las tres presentaciones fueron cotejadas con el producto por ID, código, UPC del inventario, foto aprobada e introducción del video. No se modificaron imágenes comerciales. Se reprodujeron los videos completos a velocidad normal y se revisaron solapamientos con capturas temporizadas y reproducción lenta. El reloj registrado es el del medio; la captura tiene latencia y no se declara precisión de fotograma. Onsets aproximadamente ±0,15 s; umbral de extinción ±0,4 s. Los ascensos tenues o fuera de encuadre se identifican como estimaciones.

**Ghost Rings:** siete anillos separados y dos finales a 39,40 y 39,78 s. Se conservan las pausas de 3,6–5,5 s de esta toma, aunque la ficha comercial indique 20 s. Brocade dorado, puntas violetas/rojas/ámbar/verdes que desaparecen por sectores y planos variables. Los rayos cálidos sobreviven a las puntas; no se agrega un segundo anillo genérico. Las luces fijas del fondo no se cuentan como partículas finales.

**Hot as Hell:** siete aperturas individuales y dos a 44,52/44,72 s. Anillos de color con plum clusters retardados rojos o dorados; las estrellas secundarias no aumentan el conteo de disparos. La segunda apertura está parcialmente cortada por el encuadre, por lo que la geometría es ilustrativa. Se excluyen introducción y publicidad final; la cola significativa termina antes del outro.

**Pirate Captain:** seis bouquets dorados/azules, pareja de estrellas nadadoras azules/plateadas, seis aperturas rojas que pasan a plateado y otra pareja nadadora. El final de venta, alrededor de 26,9–27,3 s, sigue sin conciliar por centros. Se excluyó entero del perfil. El extracto termina después de las colas de la fase anterior, no en una falsa finalización del producto.

No se detectó un corte interno, cambio de velocidad o segundo punto de disparo en las ventanas representadas. Es una observación de las tomas, no prueba de ausencia de edición. Los intervalos originales se mantienen; no se multiplicó un fragmento ni se escaló su duración para aparentar una cake completa. Audio, tamaños y trayectorias son ilustrativos.

El renderer compartido agrega sólo componentes opcionales de anillo: plano elíptico para las puntas de Hot as Hell y apagado por sectores con rayos persistentes para Ghost Rings. Los 53 perfiles anteriores conservan sus hashes. No se amplió ninguna otra familia.

### Evidencia y cobertura

- [Observaciones por lanzamiento, apertura, intervalo y cola](observations.json); tiempos de eventos en reloj original.
- [Ghost Rings](evidence/ghost-rings-reference.jpg), [Hot as Hell](evidence/hot-as-hell-reference.jpg), [Pirate Captain](evidence/pirate-captain-reference.jpg): capturas de las demos originales, brillo sin alterar. **No son capturas del Playground nuevo.** La última celda de Pirate Captain muestra el final excluido.
- [Manifiesto de fotogramas](evidence/manifest.json) y registros de reloj acompañan las hojas.
- [Conciliación completa por los 117 IDs](cake-coverage.json): **36 con perfil = 14 completas + 22 extractos; 81 sin perfil**. Total de todas las familias: **56 perfiles**, catálogo de 302 productos.
- [Hashes anteriores](baseline-profile-hashes.json) y [nuevos IDs](new-profile-ids.json) permiten auditar las únicas incorporaciones.

## Validación y pendientes

Pasaron `catalog:sync`, `catalog:check`, lint web, **178 pruebas web**, build web, lint app, TypeScript y **73 pruebas app**. El catálogo, perfiles, índice, renderer y runtime serializado coinciden entre repositorios. Se probaron los intervalos, pares próximos, cues sin duplicados, determinismo al volver al mismo instante y extinción suave hasta cero. El build mantiene el aviso previo de tamaño del chunk de thumbnails PDF; no es un error ni corresponde a estas incorporaciones.

Pendientes concretos:

1. Iniciar el Apache local para completar el checker HTTP y reproducir de principio a fin **cada perfil nuevo**, capturando finales, pausa/reinicio y combinación con shells manuales. La revisión visual de la simulación no se sustituye por capturas de las demos ni por pruebas de canvas.
2. Revisar el `.htaccess` y las opciones indicadas en el document root real de Hostinger. No hay acceso al panel en esta sesión; el diagnóstico de publicación queda acotado a la evidencia HTTP.
3. Pirate Captain: resolver los centros restantes de la salva final y conciliar los 21 disparos antes de promover a completa.
4. [Avalanche P5138](https://www.youtube.com/watch?v=rwmnn5bXmIk): toma de 25,681 s revisada; termina con partículas del final aún visibles. Obtener una toma con extinción completa.
5. [Neon Boom RA53040](https://www.youtube.com/watch?v=CR1TTvKxTCo): toma de 26,361 s revisada; separar aperturas sobreexpuestas y minas, conciliar los 25 shots y modelar el componente bajo antes de incorporar.
6. [Joker RA22517](https://www.youtube.com/watch?v=5gunJrX6dQc): identidad y presentación de 20 shots verificadas; falta auditoría completa y componente de spinners bajos. Los demás IDs conservan su pendiente específico en la matriz.
7. Revisión visual nativa: **pospuesta por decisión del usuario**. No se generó una publicación de la app.


## Seguimiento 2026-09-29

La [ampliación de cakes del 29/09](../cake-expansion-2026-09-29/README.md) añade Alien Attack y Viva Mexico completas, Avalanche y Forever Loyal como extractos. Cobertura vigente: 16 completas, 24 extractos, 77 sin perfil (incluidos packs, presentaciones especiales y bloqueos). Daffodil se reexaminó sin resolver 15/16 y conserva su perfil. La matriz nueva concilia los 117 IDs y mantiene los pendientes individuales. La revisión visual nativa sigue pospuesta.
