# 📖 Historias de Usuario: Purpose360 AI
**Requerimientos Ágiles y Criterios de Aceptación**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Este documento define las necesidades del usuario final en formato de Historias de Usuario (User Stories), asegurando que el desarrollo técnico cumpla con los objetivos de negocio y usabilidad.

---

### HU01: Gestión de Leads mediante Lenguaje Natural
**Como** Profesional de Salud,  
**Quiero** poder buscar, filtrar y actualizar el estado de mis leads a través del chat,  
**Para** reducir el tiempo dedicado a tareas administrativas manuales.

*   **Criterios de Aceptación:**
    *   El sistema debe reconocer comandos como "Muestra leads activos" o "Cambia el estado de Juan a Contactado".
    *   Los cambios realizados mediante el chat deben reflejarse inmediatamente en el Canvas visual.
    *   El Agente debe confirmar la acción realizada con un mensaje de texto claro.

---

### HU02: Visualización de Fichas de Pacientes (GenUI)
**Como** Profesional de Salud,  
**Quiero** que el agente me muestre tarjetas visuales con el resumen de cada paciente,  
**Para** tener una visión rápida y estética de la información clave sin leer párrafos largos.

*   **Criterios de Aceptación:**
    *   El agente debe activar el componente `LeadMiniCard` cuando se mencione a un paciente específico.
    *   La tarjeta debe incluir: nombre, rol, estado actual y nivel de interés.
    *   La tarjeta debe ser interactiva (ej: enlace a Notion o botón de acción).

---

### HU03: Sincronización Bidireccional con Notion
**Como** Profesional de Salud,  
**Quiero** que todas las actualizaciones se sincronicen automáticamente con mi base de datos de Notion,  
**Para** mantener mi CRM actualizado y accesible desde cualquier dispositivo.

*   **Criterios de Aceptación:**
    *   Cada vez que el Agente use una herramienta de actualización, debe llamar exitosamente a la API de Notion vía MCP.
    *   Si la conexión con Notion falla, el sistema debe informar al usuario y mantener la integridad de los datos locales.
    *   El sistema debe mostrar un indicador de "Sincronizado" en la interfaz.

---

### HU04: Supervisión de Comunicaciones (Human-in-the-Loop)
**Como** Profesional de Salud,  
**Quiero** revisar y editar los borradores de mensajes generados por la IA antes de que se envíen,  
**Para** asegurar que el tono y la información sean correctos y profesionales.

*   **Criterios de Aceptación:**
    *   El Agente no debe enviar correos de forma autónoma sin una aprobación previa.
    *   El sistema debe presentar una interfaz de edición (EmailDraftCard) dentro del chat.
    *   El usuario debe poder cancelar o modificar el borrador antes de la ejecución final.

---

### HU05: Persistencia de Flujos de Trabajo (Durable Threads)
**Como** Profesional de Salud,  
**Quiero** que el sistema recuerde el contexto de mi conversación al cerrar y abrir el navegador,  
**Para** poder continuar flujos de trabajo complejos que requieren varios días de gestión.

*   **Criterios de Aceptación:**
    *   Al recargar la página, el historial de chat debe cargarse íntegramente desde la base de datos (Postgres).
    *   El Agente debe "recordar" las tareas pendientes mencionadas en sesiones anteriores.
    *   El estado del Canvas debe sincronizarse con el hilo de conversación actual.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
