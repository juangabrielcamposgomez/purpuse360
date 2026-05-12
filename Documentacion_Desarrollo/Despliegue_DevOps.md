# 🚀 Plan de Despliegue y DevOps: Purpose360 AI
**Estrategia de CI/CD y Operaciones**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Este documento describe el flujo de vida del software desde el desarrollo hasta la producción, asegurando despliegues consistentes y seguros.

---

## 1. Estrategia de Branching (Git)
Se recomienda el uso de **GitHub Flow**:
*   `main`: Rama de producción (siempre estable).
*   `develop`: Integración de nuevas características.
*   `feat/*`: Ramas de funcionalidad específicas.
*   `fix/*`: Ramas para corrección de errores.

---

## 2. Entornos de Despliegue

| Entorno | Plataforma | Propósito |
| :--- | :--- | :--- |
| **Local** | Docker / `npm run dev` | Desarrollo activo y depuración rápida. |
| **Preview** | Vercel Preview Deployments | Validación de Pull Requests por stakeholders. |
| **Producción** | Vercel (Frontend/BFF) + LangGraph Cloud (Agent) | Sistema en vivo para el usuario final. |

---

## 3. Pipeline de CI/CD (GitHub Actions)

1.  **Linter & Formatter:** Ejecución de `eslint` (JS/TS) y `ruff` (Python) para mantener la calidad del código.
2.  **Test Suite:** Ejecución de pruebas unitarias y de integración en cada commit.
3.  **Build Check:** Verificación de que el proyecto compila correctamente en Next.js.
4.  **Despliegue Automático:** Despliegue a producción solo si todas las pruebas pasan.

---

## 4. Gestión de Secretos
*   **Vercel Environment Variables:** Para claves del frontend y BFF (`COPILOTKIT_LICENSE_TOKEN`, `INTELLIGENCE_API_KEY`).
*   **GitHub Secrets:** Para claves de CI/CD.
*   **Vault Externo (Opcional):** Para claves críticas de LLMs (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`).

---

## 5. Infraestructura como Código (IaC)
El sistema utiliza un ecosistema gestionado:
*   **Database:** Postgres gestionado (ej: Neon o Supabase) para la persistencia de hilos en producción.
*   **Orquestador de IA:** LangGraph Cloud para el escalado automático de la lógica del agente.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
