# Tarea 2 - Desarrollo Web

## Descripción
Esta tarea incluye la implementación de la página HTML de la Tarea 1 con el framework Flask, pudiendo hacer la aplicación de manera dinámica.

## Desiciones Tomadas
''Reformulé'' el proyecto, en el sentido de que el foco ya no es la adopción de mascotas, sino que la administración de datos de estudiantes de una federación de taekwondo. En escencia es lo mismo solicitado, solo que los parámetros del input van cambiando según las necesidades del cliente. En el la primera parte y la parte del listado, decidí no incorporar fotografías, ya que al momentpo de hacerlo de verdad, estas no serían útiles; no obstante si fue utilizada en EL modelo de "datos.html", el cual sería a futuro un template de los datos del usuario. ___(README de T1)___

Para la T2, se hicieron cambios en el layout y en el diseño en general. Ahora la página genera todo de manera dinámica desde la base de datos ''bekho'', la cual tiene tres tablas de contenido. Se añadió un modo oscuro para la comodidad del usuario, además de cambiar la distribución de botones. Se entregará la tarea con 6 estudiantes en las diversas tablas si es que lo corresponde, no obstante, queda a disposición del usuario agregar más a la base de datos, con tal de por ejemplo que en efecto se agregue o los diversos validadores.

__IMPORTANTE:__ Hay un pequeño bug con el recuadro de confirmación, no se cambia de color el fondo después de haber aplicado el modo oscuro. Al ser una pequeñez, prefiero corregirlo para la siguiente entrega, por lo que de momento quedará así.