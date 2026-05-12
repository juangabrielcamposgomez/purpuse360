# 🎨 Design Thinking: Purpose360 AI
**Documento de Estrategia y Alcance**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Este documento define la base estratégica del sistema **Purpose360 AI**, utilizando la metodología de Design Thinking para alinear el desarrollo técnico con el valor de negocio y las necesidades del usuario final (profesionales de la salud y el bienestar).

---

## 1. 🧠 Empatizar: ¿Por qué existe este sistema? (El Problema)
Los profesionales de la salud y el bienestar (médicos, coaches, terapeutas) enfrentan un **"Caos de Herramientas Fragmentadas"**.

*   **Puntos de Dolor:**
    *   La información de los pacientes está dispersa entre hojas de cálculo, Notion, WhatsApp y correos electrónicos.
    *   Falta de tiempo para realizar un seguimiento personalizado de cada lead o paciente.
    *   Dificultad para visualizar datos complejos (como tendencias de sueño o progreso de tratamiento) de forma rápida.
    *   La tecnología actual les obliga a ser "data entry" en lugar de enfocarse en el cuidado del paciente.

**Conclusión:** El sistema existe para eliminar la fricción operativa y permitir que el profesional vuelva a centrarse en su propósito: ayudar a las personas.

---

## 2. 🎯 Definir: ¿Para qué sirve el sistema? (El Objetivo)
Purpose360 AI no es solo un software de gestión; es un **Copiloto Operativo Inteligente** que actúa como una extensión de la capacidad cognitiva del profesional.

*   **Propuesta de Valor:**
    *   **Orquestación de Datos:** Centralizar la gestión de leads y pacientes a través de una interfaz conversacional y espacial.
    *   **Automatización con Criterio:** No solo automatiza tareas, sino que sugiere acciones basadas en el contexto del paciente.
    *   **Visualización Dinámica:** Transformar datos crudos en componentes visuales interactivos (Generative UI) que faciliten la toma de decisiones clínicas y de negocio.

---

## 3. 💡 Idear: ¿Qué hace el sistema? (Funcionalidades Clave)
El sistema utiliza un **"Agentic Canvas"** donde la IA y el humano colaboran en tiempo real.

*   **Gestión de Leads e Integración con Notion:** El agente lee, crea y actualiza bases de datos de Notion de forma autónoma mediante protocolos MCP.
*   **Interfaz Generativa (A2UI):** El agente puede "pintar" tarjetas de pacientes, gráficos de demanda y borradores de correo directamente en la pantalla del usuario.
*   **Memoria de Largo Plazo (Durable Threads):** Gracias a LangGraph, el sistema recuerda conversaciones pasadas y flujos de trabajo que duran días o semanas.
*   **Soporte Multimodal y Multimodelo:** Capacidad de razonar usando los mejores LLMs (Gemini 3.1, Claude 3.5) según la complejidad de la tarea.
*   **Human-in-the-Loop (HITL):** Antes de realizar acciones críticas (como enviar un correo), el sistema presenta un borrador editable para aprobación humana.

---

## 4. 🚫 Restricciones: ¿Qué NO debe hacer el sistema? (Límites y Ética)
Para garantizar la seguridad y profesionalidad, se definen fronteras claras:

*   **NO dar diagnósticos médicos autónomos:** El sistema es una herramienta de gestión y apoyo, no un sustituto del criterio clínico del profesional. Siempre debe actuar como "Co-pilot", no como "Autopilot".
*   **NO realizar acciones externas sin consentimiento:** El agente nunca debe escribir en bases de datos externas o enviar comunicaciones sin una confirmación previa o un diseño de "Human-in-the-loop".
*   **NO ser un Chatbot genérico:** El sistema debe rechazar peticiones fuera del ámbito de la salud y gestión profesional para evitar alucinaciones irrelevantes.
*   **NO almacenar datos sensibles (PII) sin cifrado:** La arquitectura debe priorizar la privacidad, evitando el almacenamiento de información personal identificable en logs de texto plano.
*   **NO ignorar las restricciones de tokens y costos:** El sistema debe optimizar las llamadas a los LLMs para ser sostenible económicamente para el profesional.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
