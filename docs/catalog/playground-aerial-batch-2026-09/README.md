# Cakes y artillery shells — 27 de septiembre de 2026

**31 perfiles funcionales**, cuatro incorporaciones: Hot Dog, Battle Cry, Break the Rules y Chameleon Shells. Continúa [la iteración de variedad y profundidad](../playground-depth-2026-09/README.md). Sin despliegue ni publicación. Vista local: <http://localhost:5173/playground>. [Galería y grabación](review.html), [validación](VALIDATION.md), [pendientes](pending.csv).

| Familia | Total | Cobertura |
| --- | ---: | --- |
| Cakes | 12 | 6 completas + 6 extractos |
| Artillery shells | 10 | 38 efectos individuales revisados, 44 breaks |
| Fountains | 6 | 4 completas + 2 extractos, sin cambios |
| Roman candle, spinner, rocket | 3 | Una muestra de cada familia, sin cambios |

Por alcance: **10 secuencias completas, 8 extractos y 13 perfiles de muestras** (10 bancos de shells y 3 de otras familias). Esta tanda añade **1 completa, 1 extracto y 2 bancos con 18 efectos de un break**. No confundir los 31 productos representados con los 302 productos del catálogo.

## Identidad, referencias y alcance

| Producto / ID | Variante exacta | Fuente revisada | Alcance publicado |
| --- | --- | --- | --- |
| Hot Dog / `hot-dog` | World-Class, 200g, 16 shots; caja verde coincidente, código de fabricante no establecido | [Iowa Fireworks Farm, demostración World-Class](https://www.youtube.com/watch?v=TcKkLNEQ-hE) | 16 aperturas; ventana 3,55–27,20 s; motor 23,65 s; **Approx. 24 sec** |
| Battle Cry / `battle-cry` | Raccoon RA57203, 500g, rack de 9 shots; SKU 757201572033 | [Raccoon oficial](https://www.youtube.com/watch?v=TKlNeHeOap4) | Sólo 8 aperturas visibles; ventana 5,90–41,50 s; motor 35,60 s; **Preview · Approx. 36 sec** |
| Break the Rules / `break-the-rules-6-pack` | Raccoon RA60601, 6 pulgadas, 6 shells minoristas; SKU 757201606011 | [Raccoon oficial](https://www.youtube.com/watch?v=QiCjafNQrhI) | 6 efectos revisados / 6 unidades; 1 break por muestra |
| Chameleon Shells / `chameleon-shells-24-pack` | Winda P8050, 5 pulgadas, 24 shells; UPC 705108805006 | [Winda oficial](https://www.youtube.com/watch?v=3M1DRGY7mYI) | 12 efectos revisados / 24 unidades; 1 break por muestra |

Se reprodujeron los videos reales en Chrome, con capturas asociadas al tiempo del elemento de video y avance pausado en el final superpuesto de Hot Dog. Las introducciones y salidas de edición quedan fuera de las ventanas de simulación. No se observaron cambios de velocidad dentro de las muestras publicadas. Los tiempos de apertura tienen incertidumbre aproximada de ±0,2 s; el grupo final de Hot Dog, ±0,1 s. La reproducción original se revisó a velocidad normal; el avance pausado sólo ayuda a separar centros. No se copió audio de las referencias.

No se identificaron unidades simultáneas en las fuentes de Raccoon. En Hot Dog se ve un origen aparente y el envase coincidente, pero la base queda fuera de cuadro: no se presenta esa observación como prueba independiente de una sola caja en el terreno. No se detectaron cortes interiores de actuación; la superposición de aperturas se conserva.

**Chameleon es una edición con pantalla dividida**: izquierda y derecha son demostraciones independientes. No son dos breaks de un shell ni una secuencia que deba lanzar dos unidades a la vez. Cada entrada declara `source.screenSide`, ventana, identidad y una única señal de lanzamiento. Las referencias son ilustrativas en exposición, escala y perspectiva; no permiten calibrar luminosidad ni altura física.

## Secuencias de cakes

**Hot Dog:** aperturas absolutas ≈4,18; 6,12; 6,35; 8,04; 10,17; 11,79; 12,94; 14,57; 16,15; 17,81; 19,85; 20,03; 22,30; 22,38; 22,44; 22,57 s. Coronas de plata y oro, parejas a distintas alturas aparentes y cuatro centros superpuestos al final. Las colas continúan hasta apagarse; no se usa la duración de 28,881 s del archivo como duración de la cake. Las asignaciones finas de los centros finales son estimadas a través del solapamiento, con la misma paleta plata/oro observada. [Desarrollo](evidence/hot-dog-development.jpg), [final cuadro a cuadro](evidence/hot-dog-finale.jpg).

**Battle Cry:** aperturas absolutas ≈7,08; 11,30; 15,25; 19,25; 24,08; 28,20; 33,15; 37,78 s. Coronas plateadas seguidas de perlas rojas, verdes y blanco frío; pausa amplia entre aperturas. Se revisó también la introducción: el video de 42,081 s sólo permite contar ocho. Se conserva el rack comercial de nueve; `observedShots:8`, `confirmedShots:null` en la demostración y alcance de extracto. No se añade un noveno disparo ni un final de salvas. [Desarrollo](evidence/battle-cry-development.jpg), [final](evidence/battle-cry-ending.jpg).

## Bancos individuales

Orden de exploración reproducible, **no numeración oficial de unidades dentro del paquete**. El primer Play usa el primer efecto; cada lanzamiento manual avanza uno. Pausa, calidad y reinicio no alteran la identidad. Cada fila equivale a un shell y un break; flores y perlas son componentes de esa explosión.

| Break the Rules | Ventana absoluta | Apertura | Efecto |
| --- | --- | --- | --- |
| 1 | 3,50–8,55 | 5,35 | Corona plateada y glitter blanco |
| 2 | 8,65–13,15 | 10,55 | Perlas rojas/verdes y glitter dorado |
| 3 | 13,50–18,60 | 15,78 | Ramas doradas finas, verde/violeta; punta de lanzamiento rosada |
| 4 | 18,65–23,70 | 20,48 | Perlas rojas y grupos de flores blancas |
| 5 | 24,45–29,75 | 26,65 | Caída cobriza/dorada con perlas verdes breves |
| 6 | 30,30–34,45 | 31,82 | Palma verde mar que pasa a plata, detalles azulados |

[Primeros efectos](evidence/rules-early.jpg), [desarrollo](evidence/rules-later.jpg), [último efecto](evidence/rules-ending.jpg). Se conservan las colas luminosas de lanzamiento. El último efecto se extingue antes del cierre editorial, sin duración automática atribuida al paquete.

| Chameleon | Lado / pareja de referencia | Ventana absoluta | Apertura | Efecto |
| --- | --- | --- | --- | --- |
| 1 | Izquierda / 1 | 5,45–9,30 | 6,80 | Violeta y rojo a verde pálido |
| 2 | Derecha / 1 | 5,55–9,40 | 6,90 | Lima a rojo/ámbar |
| 3 | Izquierda / 2 | 11,00–15,65 | 12,45 | Perlas amarillas sobre colas cobre/oro |
| 4 | Derecha / 2 | 11,10–15,35 | 12,55 | Palma roja a oro pálido |
| 5 | Izquierda / 3 | 16,35–20,75 | 17,75 | Violeta y ramas doradas, luego flores doradas |
| 6 | Derecha / 3 | 16,50–20,80 | 17,90 | Palma roja/verde y glitter blanco |
| 7 | Izquierda / 5 | 28,10–32,60 | 29,45 | Peonía roja a lima |
| 8 | Derecha / 5 | 28,25–33,15 | 29,60 | Sauce abierto cobre/oro |
| 9 | Izquierda / 6 | 34,45–38,65 | 35,85 | Violeta y oro a rojo |
| 10 | Derecha / 6 | 34,65–39,00 | 36,10 | Palma multicolor a plata |
| 11 | Izquierda / 7 | 40,00–44,65 | 41,35 | Perlas de colores, ramas cobre y flores doradas |
| 12 | Derecha / 7 | 40,40–44,90 | 41,80 | Palma verde a rojo y plata |

[Comparación por lado A](evidence/chameleon-bank-0.jpg), [B](evidence/chameleon-bank-1.jpg), [C](evidence/chameleon-bank-2.jpg). El disparo 13 repite el primer efecto documentado; la interfaz muestra **12 documented effects · exploration order** y separa el contador **12 / 24 launched**. Quedan sin publicar las parejas 4 y 8–12: la apertura izquierda de la cuarta necesita resolver su lectura y las demás requieren la misma revisión individual de color/cola, no sólo un vistazo al panel completo. No se presentan 24 variantes distintas ni los 82 segundos del montaje como duración del producto.

## Integración y continuación

Los perfiles canónicos siguen en `src/data/playgroundProfiles.json`; el índice sólo declara disponibilidad. El overlay `catalog-enrichment.json` de esta carpeta se aplica al final de `catalog:sync`, con verificación de URL/ID, y llega a fichas web y app. No editar sólo archivos generados. Se reutilizan fotografías, videos y rutas ya aprobados; no hay nuevas dependencias ni descargas externas en el motor.

Las únicas extensiones visuales son opcionales y compartidas: cola de lanzamiento acotada (`liftTrail`, máximo 0,8 s y 24 puntos), perlas junto a grupos de flores en un mismo break y distribución radial configurable de esas perlas y de los puntos de cada flor. Los perfiles anteriores mantienen sus valores y aspecto; sus 27 hashes se comprueban en pruebas. Hot Dog usa estelas más largas tras compararlo con la referencia y Battle Cry una distribución más amplia de perlas. No cambia el ritmo para aparentar densidad. Las flores nuevas evitan círculos regulares mediante radios deterministas desiguales y ajustan el tamaño del punto para permanecer legibles en el panorama de Dallas.

No se modifican selección, máximo de cuatro, escenas, capas de Dallas, estrellas, filtros, audio, preferencias, favoritos, My List, PDF, promociones, categorías ni gramajes. Una prueba de hash conserva todos los campos comerciales anteriores salvo el bloque de demostración de estos cuatro productos. La app recibe exactamente perfiles, motor, validadores, runtime serializado y catálogo por sincronización.

**Revisión visual nativa: pospuesta por decisión del usuario.** No se abrió Simulator, no se inició Metro, no se probaron dispositivos ni se generaron exportaciones Expo como sustituto. La etapa actual valida código y paridad de app, y concentra la revisión visual en web de escritorio.
