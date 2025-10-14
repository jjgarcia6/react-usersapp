# 6-users-app

Aplicación de ejemplo en React (Vite) para gestionar usuarios. Este README contiene pasos rápidos para instalar, ejecutar y desarrollar dentro del subproyecto.

Requisitos

- Node.js (recomendado 18+)
- npm

Instalación

```bash
cd 6-users-app
npm install
```

Scripts disponibles (en `package.json`)

- `npm run dev` — inicia el servidor de desarrollo (Vite)
- `npm run build` — construye la versión de producción
- `npm run preview` — sirve la build localmente para previsualizar
- `npm run lint` — ejecuta ESLint sobre el proyecto

Quick start

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar desarrollo:

   ```bash
   npm run dev
   ```

3. Abrir la app en el navegador (por defecto http://localhost:5173)

Construir y previsualizar

```bash
npm run build
npm run preview
```

Estructura de carpetas (resumen)

- `index.html` - HTML de entrada
- `src/` - código fuente
  - `main.jsx` - punto de arranque
  - `UsersApp.jsx` - componente raíz
  - `components/`, `context/`, `pages/`, `services/`, etc.

Notas de desarrollo

- Usamos Vite + React. Si instalas paquetes nuevos, vuelve a ejecutar `npm install`.
- Hay configuración de ESLint: ejecuta `npm run lint` antes de hacer commits si quieres comprobar estilo.
- Vite usa [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) con Fast Refresh.

## Variables de entorno

Si tu aplicación necesita variables de entorno, crea un archivo `.env` en la raíz de `6-users-app`:

```bash
# .env
VITE_API_URL=http://localhost:8080/api
VITE_APP_TITLE=Users App
```

Accede a ellas en el código con `import.meta.env.VITE_NOMBRE_VARIABLE`.

**Nota:** Solo las variables que empiezan con `VITE_` están expuestas al cliente.

## Despliegue

### Netlify / Vercel

1. Construye el proyecto:

   ```bash
   npm run build
   ```

2. La carpeta `dist/` contiene los archivos estáticos listos para desplegar.

3. En Netlify o Vercel, configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Docker (opcional)

Si quieres usar Docker, crea un `Dockerfile` en la raíz de `6-users-app`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Construye y ejecuta:

```bash
docker build -t users-app .
docker run -p 8080:80 users-app
```

## Más recursos

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)
- [React Router](https://reactrouter.com/)

Si necesitas ayuda o quieres añadir tests, CI/CD, o más configuraciones, avísame.
