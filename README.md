# nodepop Práctica node-js

## Información de la aplicación para DevOps

- Para acceder al servidor y hacer peticiones a la API de nodepop usar la siguiente url: http://nodepop.alejandrofuster.es

- Para acceder a la web del ejercicio 2 usar la url http://23.22.50.24

## Para poner en marcha la aplicación nodepop seguir los siguientes pasos:

1. Ejecutar `startDB.sh` para crear el directorio donde se almacenarán los datos e iniciar el servidor MongoDB.

2. Instalar los módulos que necesita la aplicación con `npm install`.

3. Ejecutar `npm run installDB` para iniciar la base de datos. Este script crea anuncios y un usuario. El usuario tiene el email
blas@gmail.com y la clave 'blas'.

4. Ejecutar `npm run start` para iniciar la aplicación, o `npm run startdeb` para iniciar la aplicación en modo depuración.

## Documentación del API

### Registro de usuarios
- POST http://localhost:3000/api/v1/usuarios/

	Parámetros del body:

	`nombre` Nombre del usuario (opcional).

	`email` Dirección de correo electrónico. **Parámetro obligatorio**.

	`clave` Contraseña del usuario. **Parámetro obligatorio**.

	`lang` Código ISO del idioma de los mensajes de error.

- Retorno:

	`{ success: true, saved: datos del usuario }`

	`{ success: false, error: mensaje de error }`

### Autenticación de usuarios
- POST http://localhost:3000/api/v1/usuarios/authenticate

	Parámetros del body:

	`email` Dirección de correo electrónico del usuario a autenticar. **Parámetro obligatorio**.

	`clave` Contraseña del usuario. **Parámetro obligatorio**.

	`lang` Código ISO del idioma de los mensajes de error.

- Retorno:

	`{ success: true, token: token para hacer peticiones de anuncios }`

	`{ success: false, error: mensaje de error }`

### Listado de anuncios
- GET  http://localhost:3000/api/v1/anuncios

	Parámetros pasados en la query:

	`start` Número de registro a partir del cual mostrar el listado.

	`limit` Número de registros a listar.

	`nombre` Texto por el que comienza el nombre de los artículos a mostrar.

	`venta` Indica si es un artículo que se quiere vender(venta=true) o si se quiere comprar(venta=false).

	`precio` Precio exacto de los artículos a mostrar o rango de precios de la forma [precio_minimo]-[precio_maximo].

	`tags` Muestra los anuncios que contengan la etiqueta o etiquetas indicadas.

	`token` Token obtenido en el registro del usuario. **Parámetro obligatorio**.

	`lang` Código ISO del idioma de los mensajes de error.

### Push token

Guarda en la colección pushtokens el token de push para notificaciones a dispositivos Android e IOS.

- GET http://localhost:3000/api/v1/pushtoken

	Parámetros pasados en la query:

	`plataforma` Nombre de la plataforma que recibirá notifiaciones. Valores posibles: android, ios

	`token` Token de la plataforma para enviar notifiaciones.

	`usuario` Parámetro opcional para indicar a qué usuario pertenece el token de push.

	`lang` Código ISO del idioma de los mensajes de error.

