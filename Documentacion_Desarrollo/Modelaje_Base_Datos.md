# 🗄️ Modelaje de Base de Datos: Purpose360 AI
**Estructura de Persistencia y Esquema de Datos**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

El sistema utiliza una arquitectura de datos híbrida que separa el **Estado de la Inteligencia** de la **Lógica de Negocio (Leads)**.

---

## 1. Arquitectura de Almacenamiento

El sistema opera con tres capas de persistencia distintas:

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Persistencia de Chat** | Postgres (SQL) | Almacena hilos de conversación, mensajes y metadatos de usuario (Intelligence Stack). |
| **Memoria de Corto Plazo** | Redis | Gestión de sesiones en tiempo real y bloqueo de hilos (locks) para el orquestador. |
| **Datos de Negocio** | Notion (u Offline JSON) | Almacenamiento de Leads, pacientes y flujos de trabajo profesionales. |

---

## 2. Esquema de Inteligencia (Postgres)

Gestionado automáticamente por el motor de **CopilotKit Intelligence**. Se organiza bajo el esquema `cpki`:

*   **`cpki.users`**: Identificación de los profesionales que usan la plataforma.
*   **`cpki.threads`**: Persistencia de las conversaciones "Durable Threads". Permite que la IA mantenga el contexto entre sesiones.
*   **`cpki.messages`**: Historial de mensajes (User, AI, Tool, System).
*   **`cpki.runs`**: Registro de ejecuciones del agente para control de concurrencia y locks.

---

## 3. Modelo de Datos de Negocio (Leads/Pacientes)

Este es el esquema que el agente manipula a través de herramientas (tools). Representa el "Core" del valor para el profesional.

### Entidad: Lead / Paciente
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID / String | Identificador único del registro. |
| `name` | String | Nombre completo del contacto. |
| `email` | String | Correo electrónico de contacto. |
| `phone` | String | Teléfono de contacto. |
| `status` | Enum | Estado en el pipeline (ej: "Not started", "Contacted", "Closed"). |
| `role` | String | Rol profesional del lead (ej: "Médico", "Terapeuta"). |
| `source` | String | Origen del lead (ej: "Formulario Web", "Referido"). |
| `technical_level` | String | Nivel de conocimiento técnico/IA (para segmentación). |
| `interested_in` | Array[String] | Intereses específicos (ej: "Sleep Medicine", "Strategy"). |
| `submitted_at` | ISO Timestamp | Fecha y hora de creación del registro. |
| `message` | Text | Mensaje original o notas adicionales. |

---

## 4. Adaptadores de Datos (Lead Store)

El sistema implementa un patrón **Adapter** para conmutar la fuente de datos sin cambiar la lógica del agente:

1.  **NotionStore:** Utiliza el **Model Context Protocol (MCP)** para realizar operaciones CRUD directamente en una base de datos de Notion.
2.  **LocalJsonStore:** En entornos de desarrollo sin Notion configurado, el sistema materializa un archivo `leads.local.json` que actúa como base de datos persistente local.

---

## 5. Integridad y Seguridad
*   **Atomicidad:** Las escrituras locales usan un sistema de "staging" (archivo temporal + rename) para evitar corrupción de datos en caso de fallo.
*   **Locks:** Se implementa un bloqueo de archivos (`threading.Lock` en Python) para evitar colisiones entre múltiples llamadas concurrentes del agente.
*   **Aislamiento:** Los datos de conversación (Postgres) están aislados por `organization_id`, permitiendo arquitecturas multi-tenant seguras.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
