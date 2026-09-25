# Tarjetas uniformes y modalidades de atención

Validado el 24 de septiembre de 2026. Cambios locales, sin commit, push ni despliegue.
Esta actualización reemplaza el tratamiento spotlight y la activación automática
del debug descritos en los informes anteriores.

## Cambios

- Debug oculto por defecto, incluso en desarrollo. La misma opción centralizada
  controla la importación del panel y el permiso para simular el reloj. Sin ella
  no hay interfaz, indicadores ni espacio reservado y se usa la hora real.
- Eliminados `lead`, la selección del primer producto como spotlight, su etiqueta
  y todos sus estilos exclusivos. Cuatro tarjetas por vista en escritorio, tres
  hasta 1100 px y carrusel con una tarjeta y parte de la siguiente hasta 700 px.
  Cada tarjeta reserva 27 rem de alto y un área de imagen de 250 px (245 en móvil).
  Se conservan catálogo, filtros, imágenes completas, enlaces y controles.
- Cada temporada muestra nombre, modalidad y fechas. La modalidad y el CTA
  principal provienen de `getSeasonAttendance`, usando el `serviceType` existente.
  Julio y New Year's Eve son públicos; las otras cuatro temporadas son por cita.
  Los indicadores «Up next» / «In progress» siguen separados. La lista no contiene
  acciones. No cambiaron fechas, horarios, zona horaria ni selección cronológica.
- Corregido un aviso previo de React 18: el atributo nativo `fetchpriority` de
  Dallas se transmite en minúsculas y conserva su valor `high`.

## Activar el debug explícitamente

Detener la instancia de desarrollo y reiniciarla con:

```bash
VITE_COUNTDOWN_DEBUG=true npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
```

Abrir `http://127.0.0.1:5175/#seasons` y desplegar **Countdown debug**. Para volver
al modo normal, reiniciar sin esa variable. También quitarla de cualquier archivo
`.env*.local` si se hubiera guardado allí. El build de producción excluye el panel
incluso con la opción `true`; no se leen fechas de la URL ni de storage.

La vista previa entregada sigue en `http://127.0.0.1:5175/`, con debug oculto.
La opción temporal utilizada para revisar los casos fue eliminada.

## Validaciones

- `npm run lint`: aprobado.
- `npm run test`: 43 pruebas aprobadas. Incluyen el gate compilado de Vite para
  desarrollo por defecto/activado y producción, exclusión del panel/CSS/parser
  con la opción forzada a `true`, modalidades, límites Chicago, DST y Año Nuevo.
- `npm run build`: aprobado. `git diff --check`: aprobado.
- Chrome de escritorio, viewports 1440×1000, 820×1180 y 390×844: los cinco filtros
  conservan tamaño de tarjetas y alineación de controles. Todas las tarjetas
  miden 432 px de alto; anchos respectivos de 307, 229.99 y 283.72 px.
- Prueba aislada que importa el `ProductCard` real: diez productos × cuatro
  anchos (1440, 820, 390 y 320), con imágenes pendientes al medir inicialmente.
  Los 40 casos mantienen exactamente tarjeta, imagen, controles, carrusel y
  contenido inferior antes y después de la carga. No se modificaron imágenes.
- Navegación del carrusel y activación por teclado comprobadas. Sin overflow
  horizontal de página; calendario revisado también a 320 px.
- Activación explícita del debug comprobada en el servidor de desarrollo:
  Texas Independence Day e Independence Day futuros y activos, New Year's Eve
  activa y el paso a enero. CTA telefónico o `#contact` y estado del calendario
  correctos. Retorno al reloj real y desactivación de la opción comprobados.
- Sin debug ni espacio residual en el modo normal: el inicio del contenido
  coincide exactamente con el padding intencional de la sección.
- Lista con seis descripciones, en orden nombre/modalidad/fechas y cero elementos
  interactivos. Dos «Open to the public» y cuatro «By appointment».
- Build revisado en el preview local 4173 con parámetros de URL de debug y fecha
  simulada: panel ausente y próxima temporada real (Diwali). Consola final de
  desarrollo y producción sin avisos ni errores.
- Todos los recursos de `public/` mantienen sus hashes previos; los datos de
  productos, temporadas y contacto permanecen intactos. No se modificó mobile;
  su carpeta no versionada `app-store-assets/` ya existía.

## Evidencias y alcance

Capturas desktop, tablet y móvil, mediciones por filtro, 40 comprobaciones de carga
y estados del countdown en `artifacts/uniform-products-calendar/` (ignorado por Git).
También se guardó un respaldo de los archivos iniciales para respetar el trabajo
local preexistente. Los dispositivos pequeños se simularon mediante viewport en
Chrome; no se probaron teléfonos o tablets físicos.
