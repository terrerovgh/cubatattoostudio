# Arquitectura del Sistema - Cuba Tattoo Studio

Este documento describe la arquitectura técnica del sistema para el sitio web y la plataforma de gestión de Cuba Tattoo Studio.

## Visión General

La arquitectura del sistema se divide en dos fases principales:

1. **Fase MVP**: Un sitio web estático alojado en GitHub Pages
2. **Fase Completa**: Una solución auto-alojada con Docker que incluye frontend, automatización con n8n y capacidades de IA

## Arquitectura MVP (Fase 1)

### Componentes

- **Frontend Estático**: HTML5, CSS3, JavaScript (ES6+)
- **Animaciones**: anime.js
- **Alojamiento**: GitHub Pages
- **Gestión de Código**: Repositorio GitHub

### Diagrama Simplificado

```
+-------------------+     +-------------------+
|                   |     |                   |
|   GitHub          |     |   GitHub Pages    |
|   Repository      +---->+   Hosting         |
|                   |     |                   |
+-------------------+     +-------------------+
         ^                          |
         |                          |
         |                          v
+-------------------+     +-------------------+
|                   |     |                   |
|   Desarrollo      |     |   Usuarios        |
|   Local           |     |   Finales         |
|                   |     |                   |
+-------------------+     +-------------------+
```

### Flujo de Trabajo

1. Desarrollo local de archivos HTML, CSS y JavaScript
2. Pruebas en entorno local
3. Commit y push al repositorio GitHub
4. Despliegue automático en GitHub Pages
5. Acceso de usuarios finales al sitio web estático

## Arquitectura Completa (Fase 2-3)

### Componentes

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), anime.js
- **Automatización**: n8n.io (auto-alojado)
- **IA**: Integración con Gemini AI y otros modelos
- **Contenedorización**: Docker
- **Persistencia**: Almacenamiento de archivos y/o base de datos ligera
- **Gestión de Código**: Repositorio GitHub

### Diagrama de Arquitectura

```
+-------------------+     +-------------------+
|                   |     |                   |
|   Frontend        |<--->+   Servidor Web    |
|   (HTML/CSS/JS)   |     |   (Nginx)         |
|                   |     |                   |
+-------------------+     +-------------------+
                                    |
                                    |
                                    v
+-------------------+     +-------------------+
|                   |     |                   |
|   n8n Workflow    |<--->+   Almacenamiento  |
|   Engine          |     |   (Archivos/DB)   |
|                   |     |                   |
+-------------------+     +-------------------+
         ^                          ^
         |                          |
         v                          v
+-------------------+     +-------------------+
|                   |     |                   |
|   Servicios IA    |     |   Servicios       |
|   (Gemini, etc.)  |     |   Email/SMS       |
|                   |     |                   |
+-------------------+     +-------------------+
```

### Contenedores Docker

- **Contenedor Frontend**: Nginx sirviendo archivos estáticos
- **Contenedor n8n**: Motor de flujos de trabajo para automatización
- **Contenedor de Almacenamiento**: Volumen para persistencia de datos

### Flujos de Trabajo Principales

1. **Solicitud de Reserva**:
   - Usuario completa formulario en el frontend
   - n8n procesa la solicitud
   - Se envían notificaciones por email
   - Se registra en el sistema de almacenamiento

2. **Consulta de Diseño**:
   - Usuario sube referencia o describe idea
   - n8n procesa y opcionalmente consulta IA
   - Se genera respuesta preliminar
   - Se notifica al artista para revisión

3. **Publicación en Redes Sociales**:
   - Se sube nuevo trabajo al sistema
   - n8n prepara publicaciones para redes sociales
   - Se programan o envían para aprobación

## Consideraciones de Seguridad

- Todas las comunicaciones vía HTTPS
- Datos sensibles almacenados de forma segura
- Backups regulares del sistema
- Acceso restringido a panel de administración
- No almacenamiento de información de pago (si se implementa)

## Escalabilidad

La arquitectura basada en Docker permite:

- Escalar horizontalmente añadiendo más instancias
- Migrar a infraestructura más potente según necesidad
- Añadir nuevos servicios como contenedores independientes
- Implementar balanceo de carga si el tráfico lo requiere

## Monitorización y Mantenimiento

- Logs centralizados de todos los contenedores
- Monitorización básica de estado del sistema
- Actualizaciones programadas de componentes
- Procedimientos de backup y restauración

---

Este documento de arquitectura evolucionará a medida que el proyecto avance y se tomen decisiones técnicas más detalladas.