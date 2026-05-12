# 🛡️ Matriz de Riesgos y Mitigación: Purpose360 AI
**Gestión de Vulnerabilidades y Estabilidad en IA**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Dada la naturaleza del sistema (gestión de salud y bienestar), es fundamental identificar y mitigar los riesgos técnicos y operativos.

---

## 1. Matriz de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| :--- | :--- | :--- | :--- |
| **Alucinaciones en Datos** | Media | Alto | Implementar validación de salida del LLM y usar "Groundedness" (basarse solo en la DB de Notion). |
| **Inyección de Prompts** | Baja | Muy Alto | Sanitización de inputs y uso de esquemas JSON estrictos para el retorno de herramientas. |
| **Latencia Excesiva** | Alta | Medio | Implementar streaming (SSE) y usar modelos ligeros como Gemini Flash-Lite para tareas simples. |
| **Caída de API Externa** | Media | Alto | Implementar reintentos (retries) y modo offline/solo lectura en el frontend. |
| **Privacidad de Datos (PII)** | Baja | Crítico | Encriptación en tránsito (TLS) y at rest. Cumplimiento de normativas de privacidad locales. |

---

## 2. Estrategia de Contención

### A. Control de Alucinaciones
El sistema utiliza **LangGraph Checkpoints**. Si el agente genera una respuesta incoherente, el usuario puede "retroceder" o corregir la intención, asegurando que los datos de negocio (Notion) no se corrompan.

### B. Límites de Consumo (Rate Limiting)
Para evitar costos inesperados, el BFF implementa límites de peticiones por usuario/hilo, previniendo abusos de la API de Gemini.

### C. Supervisión Humana (HITL)
Acciones críticas como el envío de correos o la eliminación de registros **requieren aprobación manual** mediante componentes interactivos, eliminando el riesgo de automatizaciones erróneas.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
