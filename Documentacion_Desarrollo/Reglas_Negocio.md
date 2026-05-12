# ⚖️ Reglas de Negocio: Purpose360 AI
**Lógica Operativa y Restricciones del Sistema**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Este documento define las reglas lógicas que gobiernan el comportamiento del sistema, asegurando que la IA actúe de acuerdo con los estándares profesionales de salud y los procesos de negocio definidos.

---

## 1. Reglas de Gestión de Leads (Pipeline)

*   **RN01 - Estado Inicial:** Todo nuevo lead ingresado al sistema debe iniciar con el estado `Not started`.
*   **RN02 - Progresión de Pipeline:** Un lead solo puede marcarse como `Closed` si previamente ha pasado por el estado `Contacted` o `Meeting Scheduled`.
*   **RN03 - Campos Obligatorios:** Ningún registro puede persistirse en Notion o la DB local si carece de `Name` y `Email` (o `Phone`).
*   **RN04 - Auto-Segmentación:** Si el mensaje de un lead contiene palabras clave relacionadas con "sueño", "insomnio" o "apnea", el Agente debe etiquetarlo automáticamente en la categoría `Sleep Medicine`.

---

## 2. Reglas de Interacción del Agente (IA)

*   **RN05 - Tono y Voz:** El Agente debe utilizar siempre un tono profesional, empático y servicial. Queda prohibido el uso de lenguaje informal o sarcástico.
*   **RN06 - Límite de Diagnóstico:** El Agente tiene estrictamente prohibido emitir diagnósticos médicos definitivos o prescribir medicamentos. Su rol es puramente administrativo y de apoyo informativo.
*   **RN07 - Confirmación de Acción (HITL):** Cualquier acción que implique una comunicación externa (enviar email) o una eliminación de datos requiere una confirmación explícita del usuario humano.
*   **RN08 - Transparencia:** Si el Agente no tiene acceso a una información específica o la herramienta falla, debe comunicarlo honestamente en lugar de alucinar una respuesta.

---

## 3. Reglas de Integración y Datos

*   **RN09 - Sincronización Única:** El sistema debe evitar la creación de duplicados en Notion. Antes de insertar, el Agente debe verificar si el `Email` ya existe en la base de datos.
*   **RN10 - Aislamiento de Organización:** Un profesional solo puede visualizar y editar datos pertenecientes a su `organization_id`. El acceso cruzado entre diferentes clínicas está bloqueado por arquitectura.
*   **RN11 - Prioridad de Fuente:** En caso de conflicto de datos entre el caché del Frontend y la base de datos de Notion, la información de **Notion** siempre tendrá la prioridad como fuente de verdad.

---

## 4. Reglas de Seguimiento (SLA)

*   **RN12 - Alerta de Seguimiento:** El sistema debe resaltar visualmente en el Canvas cualquier lead que lleve más de 48 horas en estado `Not started`.
*   **RN13 - Resumen de Pre-Consulta:** Antes de que el profesional inicie una llamada (marcada en el sistema), el Agente debe generar un resumen automático de los últimos 3 puntos clave del historial del paciente.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
