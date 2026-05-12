# Integración Social y Agente Community Manager AI

Este documento detalla la arquitectura y el flujo de trabajo para la conexión de redes sociales y la automatización de campañas de posicionamiento dentro de **Purpose360 AI**.

## 1. Flujo de Conexión (OAuth 2.0)

El profesional no introduce credenciales directamente. La conexión se realiza mediante flujos OAuth seguros que garantizan la privacidad y el control.

### Interfaz de Usuario
- **Hub de Conexiones**: Un panel centralizado en "Ajustes de Ecosistema" permite conectar plataformas (Instagram, LinkedIn, Google Business).
- **Tool**: `renderSocialConnectHub` muestra el estado de cada conexión (Conectado/Desconectado) y los permisos otorgados.

### Persistencia y Seguridad (Supabase Vault)
- Los **Tokens de Acceso** y **Refresh Tokens** NO se guardan como texto plano.
- Se utiliza **Supabase Vault** (`vault.secrets`) para almacenar los tokens de forma encriptada a nivel de base de datos.
- La tabla `social_connections` solo almacena el `secret_id`, manteniendo los datos sensibles aislados.

## 2. El Agente como Community Manager AI

Una vez que el profesional otorga permisos, el agente pasa de ser un consultor a un ejecutor activo del ecosistema.

### Capacidades de Ejecución
1. **Análisis de Audiencia**:
   - El agente utiliza las APIs para extraer métricas de engagement y demografía.
   - Cruza estos datos con el pilar de **Visibilidad** para detectar brechas.

2. **Generación de Contenido Estratégico**:
   - Basado en los pilares de **Identidad** y **Humanización**, el agente genera:
     - Guiones para Reels.
     - Artículos técnicos para LinkedIn.
     - Publicaciones educativas para Google Business.

3. **Gestión de Campañas (Posicionamiento)**:
   - El agente propone campañas específicas: *"He detectado una oportunidad de posicionamiento en el área de [Especialidad] para padres de familia. ¿Lanzamos esta campaña?"*.
   - El usuario solo debe dar clic en **"Aprobar"** para que el agente ejecute el posteo o la pauta publicitaria.

## 3. Estructura de Datos (Esquema SQL)

### Tabla: `social_connections`
Almacena el enlace entre el profesional y sus cuentas sociales.
- `expert_id`: Relación con el perfil del médico.
- `platform`: 'instagram', 'linkedin', etc.
- `access_token_secret_id`: Referencia segura al token en el Vault.
- `is_active`: Estado de la conexión.

### Tabla: `marketing_campaigns`
Rastrea la ejecución del posicionamiento.
- `content_plan`: JSONB con el copy, assets y segmentación.
- `performance_metrics`: Clicks, impresiones y leads generados.
- `status`: 'draft', 'active', 'completed'.

## 4. Ciclo de Posicionamiento Continuo

1. **Escucha**: El agente monitorea tendencias de la especialidad en redes.
2. **Propuesta**: Renderiza un `ContentStrategyCard` interactivo.
3. **Aprobación**: El profesional ajusta o aprueba el contenido.
4. **Ejecución**: El agente publica automáticamente mediante los SDKs integrados.
5. **Medición**: El `StatusDashboard` se actualiza con el impacto real en el posicionamiento.

---
**Purpose360 AI**: Transformando la práctica médica en un ecosistema digital inteligente y escalable.
