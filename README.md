# Laboratorio de Programación INTI

**Plataforma educativa interactiva** para el aprendizaje de algoritmos y pensamiento computacional, diseñada para los estudiantes del Instituto Nacional Técnico Industrial (INTI), El Salvador.

---

## Autoría

**Autor:** Angel Sanchez  
**Institución:** Instituto Nacional Técnico Industrial (INTI)  
**Contacto:** angel.sanchez@inti.edu.sv  

© 2025 Angel Sanchez – Laboratorio de Programación INTI. Todos los derechos reservados.

---

## Requisitos previos

- Node.js 18+
- npm 9+

---

## Instalación y uso local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Crea el archivo `.env` en la raíz del proyecto basándote en `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configura tus variables de entorno en `.env` (ver sección de seguridad abajo).

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## Configuración de seguridad – Panel Admin

### Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `VITE_ADMIN_USER` | Nombre de usuario del administrador |
| `VITE_ADMIN_HASH` | Hash SHA-256 de la contraseña del administrador |
| `VITE_GEMINI_API_KEY` | API Key de Google Gemini para el tutor IA |

### Generar el hash de la contraseña

Ejecuta el siguiente script **una sola vez** para generar el hash SHA-256 de tu contraseña:

```bash
node scripts/generate-hash.js
```

Copia el hash generado y pégalo como valor de `VITE_ADMIN_HASH` en tu archivo `.env`.

> **Importante:** Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

---

## Despliegue en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com).
2. En **Settings > Environment Variables**, agrega:
   - `VITE_ADMIN_USER`
   - `VITE_ADMIN_HASH`
   - `VITE_GEMINI_API_KEY`
3. Despliega. Las variables estarán disponibles en tiempo de compilación.

---

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── context/        # Contexto global (estudiantes)
├── engine/         # Motor del simulador y parser
├── modules/        # Módulos de contenido educativo
├── pages/          # Páginas principales y panel admin
├── services/       # Servicios (auth, IA, almacenamiento)
├── simulator/      # Motor de simulación de pseudocódigo
├── types/          # Tipos TypeScript
└── utils/          # Utilidades
scripts/
└── generate-hash.js  # Generador de hash para contraseña admin
```
