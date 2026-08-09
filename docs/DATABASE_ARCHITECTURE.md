# CORTEXA
## Database Architecture
### Authentication & Licensing System
Version: 1.0

---

# Objetivo

Este documento define la arquitectura de autenticación y licenciamiento de CORTEXA.

Su finalidad es establecer una única fuente de verdad para la identidad del usuario y el estado de la licencia, permitiendo al mismo tiempo el funcionamiento completamente offline durante un período controlado.

Este documento constituye la especificación oficial del sistema de autenticación.

---

# Principios de diseño

La arquitectura se basa en los siguientes principios:

- Mantener completamente desacoplada la lógica clínica.
- Mantener la experiencia offline como prioridad.
- Minimizar la dependencia de Internet.
- Centralizar el control de licencias.
- Mantener una arquitectura escalable.
- Mantener un modelo reproducible entre Development y Production.

---

# Componentes

El sistema se divide en cinco componentes independientes.

## 1. Supabase Authentication

Responsable únicamente de:

- autenticación mediante correo y contraseña;
- recuperación de contraseña;
- gestión de usuarios.

Supabase NO conoce la lógica clínica.

---

## 2. License Service

Responsable de determinar:

- estado de la licencia;
- plan contratado;
- fecha de vencimiento;
- días permitidos offline;
- número máximo de dispositivos.

---

## 3. Device Registry

Responsable de registrar los dispositivos autorizados para una licencia.

Cada instalación de CORTEXA posee un identificador único generado localmente.

---

## 4. Local Offline Session

Responsable de permitir el funcionamiento sin conexión.

Nunca almacena información clínica.

Solo almacena:

- identificador del usuario;
- identificador de la licencia;
- fecha de validación;
- fecha de expiración offline;
- versión de licencia;
- identificador del dispositivo.

---

## 5. Therapeutic Platform

Incluye:

- RECONECTA
- RENACE
- Therapeutic Engine

Estos módulos nunca consultan directamente Supabase.

Toda comunicación ocurre mediante la capa Auth.

---

# Modelo de datos

## auth.users

Administrado completamente por Supabase.

Campos relevantes:

- id (UUID)
- email

No se almacenará una tabla propia de usuarios.

---

## licenses

Representa la licencia asignada a un usuario.

Cada usuario posee exactamente una licencia.

Campos:

- id
- user_id
- status
- plan
- offline_days
- max_devices
- license_version
- expires_at
- created_at
- updated_at

---

## licensed_devices

Representa los dispositivos autorizados.

Cada licencia puede tener múltiples dispositivos.

Campos:

- id
- license_id
- device_id
- device_name
- last_seen_at
- created_at

---

# Relaciones

auth.users

↓

licenses

↓

licensed_devices

---

# Estados de licencia

ACTIVE

Licencia vigente.

Permite autenticación y renovación offline.

---

SUSPENDED

Licencia suspendida por administración.

No permite renovar.

---

EXPIRED

Licencia vencida.

No permite ingresar.

---

# Planes

DEMO

PROFESSIONAL

CLINIC

Los planes determinan:

- días offline;
- cantidad máxima de dispositivos.

---

# Dispositivos

Cada instalación genera un UUID aleatorio.

Ese UUID identifica permanentemente el dispositivo.

No depende del hardware.

No recopila información personal.

No cambia durante el uso normal de la aplicación.

---

# Funcionamiento Offline

Después de una autenticación exitosa:

Supabase valida:

- usuario
- contraseña
- licencia

↓

CORTEXA genera un permiso local.

↓

El permiso contiene:

- userId
- licenseId
- deviceId
- validatedAt
- offlineExpiresAt
- licenseVersion

↓

La aplicación funciona completamente offline.

---

# Renovación

Cuando offlineExpiresAt ha expirado:

↓

Solicitar conexión a Internet.

↓

Autenticar nuevamente.

↓

Consultar licencia.

↓

Actualizar permiso local.

↓

Renovar período offline.

---

# Seguridad

Nunca utilizar el correo electrónico como identificador interno.

Toda relación utiliza UUID.

Nunca almacenar contraseñas.

Nunca almacenar información clínica en Supabase.

Nunca depender del JWT para funcionamiento offline.

La fuente de verdad siempre es:

Supabase.

El funcionamiento offline depende únicamente del permiso emitido después de una validación exitosa.

---

# Row Level Security

Todas las tablas utilizarán RLS.

Cada usuario únicamente podrá consultar su propia licencia.

Cada usuario únicamente podrá consultar sus dispositivos.

---

# Escalabilidad futura

La arquitectura permite incorporar posteriormente:

- múltiples dispositivos por usuario;
- múltiples tipos de licencia;
- licencias institucionales;
- revocación remota de dispositivos;
- auditoría de accesos;
- sincronización entre dispositivos;
- licencias temporales;
- licencias académicas.

Sin modificar la arquitectura principal.

---

# Versionado

Toda modificación del esquema deberá realizarse mediante migraciones SQL.

Ejemplo:

001_initial_schema.sql

002_add_license_logs.sql

003_add_device_revocation.sql

Nunca modificar manualmente Production.

Toda migración deberá probarse primero en Development.

---

Fin del documento.