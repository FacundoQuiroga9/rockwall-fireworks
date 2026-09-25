# Spotlight estable y debug del countdown

Cambios locales, sin commit, push ni despliegue. Se revisaron README, instrucciones del repositorio (no se encontraron AGENTS.md aplicables) y Git antes de editar. Se conservaron los cambios preexistentes.

## Spotlight

Se reserva una altura uniforme de 27 rem (432 px con tamaño base normal) en escritorio/tablet y 31 rem (496 px) en móvil. El ancho conserva las proporciones responsivas del diseño. El carrusel reserva también su propia altura y el espacio del scrollbar, incluso con una sola categoría/producto.

Las imágenes se centran en un área definida con `object-fit: contain`, sin aportar tamaño intrínseco al contenedor. Los detalles reservan filas para el encabezado, el nombre más largo, la categoría y los controles. Los controles quedan a la misma altura, incluidos los productos sin vídeo. No se alteraron imágenes, nombres, datos, enlaces ni animaciones existentes.

Se usó una página de prueba aislada que importa el componente real `ProductCard` y sus mismos estilos para poner cada uno de los diez productos en spotlight. Se forzó una petición nueva de cada imagen y se midió antes del evento de carga y después:

| Viewport | Productos | Ancho / alto de spotlight | Cambios al cargar | Controles / contenido inferior |
| --- | --- | --- | --- | --- |
| 1440 × 1000 | 10 | 553.84 × 432 px | 0 | Misma posición en los 10 |
| 834 × 1112 | 10 | 460.41 × 432 px | 0 | Misma posición en los 10 |
| 390 × 844 | 10 | 283.72 × 496 px | 0 | Misma posición en los 10 |
| 320 × 740 | 10 | 226.31 × 496 px | 0 | Misma posición en los 10 |

Los 40 casos muestran los nombres completos sin superposición con las categorías; las imágenes completas usan contain. También se comprobaron los cinco filtros en el sitio real: no cambian tamaño de tarjeta, altura del carrusel ni posición del contenido inferior. Sin overflow horizontal de la página.

## Reloj y panel

`countdownClock.js` centraliza la lectura de tiempo, la simulación en memoria, notificaciones y planificación de actualizaciones. El hook `useSeasonalCountdown` entrega un único snapshot a la sección y al panel. La selección y los textos siguen pasando por `getSeasonalCountdown` y `getSeasonPresentation`; no hay lógica comercial duplicada. Congelar elimina los timers; volver al reloj real obtiene el tiempo actual inmediatamente. El desmontaje cancela timer, suscripción y listener de visibilidad.

El panel se abre encima del countdown, con un disclosure nativo accesible por teclado. Es parte del flujo de la página, no una superposición. Permite fecha/hora personalizada, año para los accesos rápidos, congelación, vuelta al reloj real, indicador visible aun plegado y resumen del mismo estado calculado.

El parser usa Intl y America/Chicago explícitos. Marzo: una hora inexistente se rechaza sin cambiar la simulación previa. Noviembre: se ofrecen las dos ocurrencias, con CDT/CST visibles. Las fechas comerciales permanecen intactas.

Sólo se carga mediante `import.meta.env.DEV`. El build normal elimina interfaz, parser de debug y CSS. El reloj de producción tiene `allowSimulation: false`; no usa URL ni storage para obtener su fecha.

## Validación

- `npm run lint`: aprobado sin advertencias. `npm run test`: 41/41 aprobadas. `npm run build`: aprobado; JS principal 222.93 kB / 71.47 kB gzip. `git diff --check`: aprobado.
- Pruebas nuevas: Chicago frente a hosts Tokio/Los Ángeles (sólo TZ del proceso de prueba), horario estándar/verano, fecha bisiesta, hora inexistente/repetida, todos los presets, configuración modificada, mismo snapshot congelado, retorno a tiempo real, límites inclusivos, cambio de año, timers y limpieza.
- Prueba de build en memoria: incluso con un modo llamado `development`, una compilación de producción excluye marcadores del panel, parser y CSS.
- Navegador Chrome: se ejecutaron los 26 accesos rápidos. En todos los casos coinciden encabezado, contador, atención, CTA y marcador; la lista inferior sigue sin controles.
- Fecha personalizada `2026-06-25 12:00 Chicago` produjo `2026-06-25T17:00:00Z`. Segunda ocurrencia de `2026-11-01 01:30` produjo `07:30Z`; la primera corresponde a `06:30Z`. `2026-03-08 02:30` muestra el error esperado y conserva el momento anterior.
- Cambio del año de presets a 2027: el acceso al 1 de enero seleccionó correctamente `2028-01-01T06:00:00Z` y Año Nuevo activo.
- Plegado/apertura con Enter; indicador congelado persistente. Congelación mantenida durante la revisión. Botón de tiempo real y checkbox devolvieron la temporada cronológica real.
- Producción: cero paneles con parámetros de debug en URL y valores de simulación en localStorage. Conservó Diwali como próxima temporada real. Se retiraron los valores de prueba.
- Viewports de escritorio/tablet/móvil, no dispositivos físicos. Sin errores ni advertencias de la aplicación en consola. Los fixtures temporales se eliminan con el build final.

## Vista de desarrollo y limitación del entorno

El intento de iniciar Vite recibió `listen EPERM`; este entorno no permite abrir el puerto. El puerto 5173 pertenece a Bondi Code y se conservó intacto. Se solicitó iniciar Rockwall en el puerto 5175; al cerrar la revisión aún no había listener en ese puerto.

Para completar las pruebas del panel sin modificar otros servidores se compiló temporalmente el código real con el flag DEV habilitado en un fixture local servido por la vista previa existente (4173). Esto comprueba el panel y su comportamiento, pero no equivale a dejar Vite/HMR ejecutándose. El fixture no se conserva en `dist` tras el build final.

La vista de producción sigue disponible en `http://127.0.0.1:4173/#featured-products`. Para usar el panel en desarrollo:

```bash
cd '/Users/facundoquiroga/code/FacundoQuiroga9/ROCKWALL FIREWORKS/rockwall-fireworks'
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
```

Después abrir `http://127.0.0.1:5175/#seasons` y desplegar **Countdown debug**. Éste es el único pendiente operativo de la entrega.

## Evidencia local

`artifacts/spotlight-countdown-debug/` contiene capturas, medidas completas de los 40 casos, resultados de los 26 presets y backup/hashes iniciales. La comparación confirma que los recursos de `public`, la configuración comercial y el resto de las secciones no se alteraron. `rockwall-fireworks-mobile` mantiene su estado inicial (`?? app-store-assets/` preexistente).
