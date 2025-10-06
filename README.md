# Proyecto Aromia

Contiene el backend (NestJS), frontend web (Angular) y aplicación móvil (Ionic Angular) del proyecto Aromia.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (última versión LTS): [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **Angular CLI**: Instalar globalmente con `npm install -g @angular/cli`
- **MySQL**: [Descargar aquí](https://www.mysql.com/downloads/)
- **Git**: [Descargar aquí](https://git-scm.com/)

### Para desarrollo móvil (Aromia_app):
- **Android Studio**: [Descargar aquí](https://developer.android.com/studio)
- **Xcode** (solo para macOS/iOS): [Descargar desde App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **Ionic CLI**: Instalar globalmente con `npm install -g @ionic/cli`

---

## Estructura del Proyecto

```
Aromia/
├── Aromia_backend/    # Backend NestJS
├── Aromia_web/        # Frontend Angular
└── Aromia_app/        # Aplicación móvil Ionic
```

---

## Instalación

### 1. Clonar el Repositorio

```bash
git clone [https://github.com/tonyx94/Aromia.git]
cd Aromia
```

---

## Backend (Aromia_backend)

### Instalación del Backend

1. Navegar a la carpeta del backend:
```bash
cd Aromia_backend
```

2. Instalar dependencias:
```bash
npm install
```

### Ejecutar el Backend

Modo desarrollo:
```bash
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

---

## Frontend Web (Aromia_web)

### Instalación del Frontend

1. Navegar a la carpeta del frontend:
```bash
cd Aromia_web
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la URL del API en el archivo de configuración (si es necesario ajustar la URL del backend).

### Ejecutar el Frontend

```bash
npm start
```

O también:
```bash
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

---

## App Móvil (Aromia_app)

### Instalación de la App

1. Navegar a la carpeta de la app:
```bash
cd Aromia_app
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la URL del API para conectarse al backend.

### Ejecutar la App en Desarrollo

Para ejecutar en el navegador:
```bash
ionic serve
```

La app estará disponible en: `http://localhost:8100`

### Ejecutar en Android

1. Agregar la plataforma Android (solo la primera vez):
```bash
ionic capacitor add android
```

2. Sincronizar cambios:
```bash
ionic capacitor sync android
```

3. Abrir en Android Studio:
```bash
ionic capacitor open android
```

4. Desde Android Studio, ejecutar la app en un emulador o dispositivo físico.

### Ejecutar en iOS (solo macOS)

1. Agregar la plataforma iOS (solo la primera vez):
```bash
ionic capacitor add ios
```

2. Sincronizar cambios:
```bash
ionic capacitor sync ios
```

3. Abrir en Xcode:
```bash
ionic capacitor open ios
```

4. Desde Xcode, ejecutar la app en un simulador o dispositivo físico.

---

## Workflow de Desarrollo Completo

Para desarrollar con todos los proyectos corriendo simultáneamente:

1. **Terminal 1** - Backend:
```bash
cd Aromia_backend
npm run start:dev
```

2. **Terminal 2** - Frontend Web:
```bash
cd Aromia_web
npm start
```

3. **Terminal 3** - App Móvil:
```bash
cd Aromia_app
ionic serve
```

---

## Notas Importantes

- Asegúrate de que MySQL esté corriendo antes de iniciar el backend
- El backend debe estar corriendo para que el frontend y la app funcionen correctamente
- Verifica que los puertos 3000, 4200 y 8100 estén disponibles
- Si cambias código nativo en la app móvil, recuerda ejecutar `ionic capacitor sync` antes de abrir en Android Studio o Xcode

---


## Tecnologías Utilizadas

- **Backend**: NestJS + MySQL
- **Frontend Web**: Angular 19
- **App Móvil**: Ionic 8 + Angular
- **Gestor de Paquetes**: npm