# Gestor de Tareas Personales

## Descripción

El **Gestor de Tareas Personales** es una aplicación **FullStack** tipo *To-Do List* que permite a los usuarios **registrarse, iniciar sesión y administrar sus tareas personales** de manera eficiente.  
Está diseñada para ofrecer una experiencia intuitiva, moderna y segura, ideal para organizar las actividades del día a día.

---

## Características principales

- **Autenticación con JWT (JSON Web Token)**  
  Sistema de login y registro seguro, manteniendo sesiones autenticadas en el cliente.

- **Gestión completa de tareas (CRUD)**  
  Permite **crear, leer, actualizar y eliminar tareas**, con los siguientes campos:
  - **Título:** nombre de la tarea.  
  - **Descripción:** detalles adicionales.  
  - **Prioridad:** define la importancia de la tarea.  
  - **Estado:** indica el progreso (*pendiente*, *en progreso*, *completada*).

- **Interfaz amigable e intuitiva**  
  Formularios accesibles para autenticación y administración de tareas, con navegación fluida y diseño responsivo.

- **Filtros dinámicos**  
  Clasificación de tareas por estado y prioridad para una gestión más organizada.

- **Validaciones en frontend y backend**  
  Garantizan la consistencia, corrección y seguridad de los datos ingresados.

---

##  Tecnologías utilizadas

### **Frontend**
- React + TypeScript  
- Vite  
- TailwindCSS  
- Axios  
- React Router  
- Jest + React Testing Library (pruebas unitarias opcionales)

### **Backend**
- Node.js + Express  
- TypeScript  
- PostgreSQL  
- JSON Web Token (JWT)  
- bcrypt (encriptación de contraseñas)  
- dotenv (manejo de variables de entorno)

---

## ¿Cómo ejecutarlo?

### 1. Clona el repositorio:

```bash
git clone [hhttps://github.com/pulidxxx/my-inventory-app.git](https://github.com/Edwar421/Gestion_de_Tareas)
```

### 2. Accede al directorio del proyecto:

```bash
cd Gestion_de_Tareas
```

### 3. Configura las variables de entorno:

Crea un archivo `.env` en la carpeta de frontend y otro en la de backend y define las variables necesarias. Puedes usar el archivo `.env.example` como referencia.

### 4. Configura la base de datos:

Asegúrate de crear una base de datos en postgres con el mismo nombre especificado en las variables de entorno. No es necesario realizar configuraciones adicionales, ya que la aplicación se conectará automáticamente utilizando las credenciales proporcionadas.

### 5. Inicia la aplicación:

#### Iniciar el Backend:

```bash
cd backend
npm install
npm run dev
```

#### Iniciar el Frontend:

```bash
cd frontend
npm install
npm run dev
```

### 6. Ejecuta las pruebas (opcional):

En cada carpeta (frontend o backend), puedes correr las pruebas con:

```bash
npm test
```

### 7. Accede a la aplicación:

Abre tu navegador y ve a `http://localhost:5173`.
