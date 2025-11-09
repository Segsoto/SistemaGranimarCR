# 🚀 Guía de Despliegue en Vercel - Sistema Granimar CR

## 📋 Pre-requisitos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Repositorio en GitHub con el código
- ✅ Proyecto Supabase configurado
- ✅ API Key de Resend

---

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Verificar archivos importantes

Asegúrate de tener estos archivos en tu repositorio:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `vercel.json`
- ✅ `.gitignore`
- ✅ `.env.local.example`

### 1.2 Commit y Push al repositorio

```bash
git add .
git commit -m "Preparar para deploy en Vercel"
git push origin main
```

---

## 🌐 Paso 2: Configurar Vercel

### 2.1 Importar Proyecto

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio de GitHub
4. Haz clic en **"Import"**

### 2.2 Configurar el Proyecto

En la pantalla de configuración:

- **Framework Preset**: Next.js (detectado automáticamente)
- **Root Directory**: `./` (dejar por defecto)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)

### 2.3 Configurar Variables de Entorno

⚠️ **IMPORTANTE**: Agrega estas variables en **Environment Variables**:

#### Variables de Supabase (obligatorias)

```
NEXT_PUBLIC_SUPABASE_URL=https://vavlehrkorioncfloedn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://vavlehrkorioncfloedn.supabase.co/storage/v1/object/public
```

#### Variable de Resend (obligatoria)

```
RESEND_API_KEY=re_AQACuL14_4nZfDqoZGQfzvRQjMJAQziDE
```

**Cómo agregar las variables:**
1. En la sección "Environment Variables"
2. Agrega cada variable:
   - **Name**: Nombre de la variable (ej: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Valor correspondiente
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**
3. Haz clic en "Add" para cada variable

### 2.4 Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que termine el build (2-5 minutos)
3. ¡Tu aplicación está desplegada! 🎉

---

## 🗄️ Paso 3: Configurar Supabase

### 3.1 Agregar dominio de Vercel a Supabase

1. Ve a tu proyecto en Supabase
2. Ve a **Settings** → **API**
3. En **URL Configuration**, agrega tu dominio de Vercel:
   ```
   https://tu-proyecto.vercel.app
   ```

### 3.2 Ejecutar Migraciones de Base de Datos

Ejecuta estos archivos SQL en orden en el **SQL Editor** de Supabase:

```sql
-- 1. Tabla retiros y sobros
migrations/009_update_retiros_sobros.sql

-- 2. Campo imagen en materiales
migrations/010_add_imagen_to_materiales.sql

-- 3. Materiales iniciales (opcional)
migrations/011_insert_initial_materials.sql
```

### 3.3 Configurar Storage Bucket

1. Ve a **Storage** en Supabase
2. Crea un bucket llamado `materiales`
3. Marca como **Public bucket** ✅
4. Configura las políticas de acceso (ya incluidas en la migración 010)

---

## ✅ Paso 4: Verificar el Despliegue

### 4.1 Probar la aplicación

1. Abre tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Verifica que carga correctamente
3. Prueba las funcionalidades principales:
   - ✅ Dashboard muestra datos reales
   - ✅ Inventario carga materiales
   - ✅ Puedes crear/editar materiales
   - ✅ Las imágenes se suben correctamente
   - ✅ Los retiros funcionan

### 4.2 Verificar Variables de Entorno

Si algo falla, verifica en Vercel:
1. **Settings** → **Environment Variables**
2. Asegúrate de que todas las variables estén configuradas
3. Si editaste alguna, haz un **Redeploy**

---

## 🔄 Actualizaciones Futuras

### Deploy Automático

Cada vez que hagas `git push` a tu rama principal, Vercel desplegará automáticamente:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Vercel detectará el push y desplegará automáticamente.

### Deploy Manual

Si necesitas redesplegar sin cambios:
1. Ve a tu proyecto en Vercel
2. Pestaña **Deployments**
3. Haz clic en los 3 puntos del último deployment
4. Selecciona **Redeploy**

---

## 🐛 Solución de Problemas

### Error: "Missing environment variables"

**Solución**: Verifica que todas las variables estén en Vercel Settings → Environment Variables

### Error: "Failed to fetch"

**Solución**: Verifica que el dominio de Vercel esté agregado en Supabase API Settings

### Imágenes no cargan

**Solución**: 
1. Verifica que el bucket `materiales` esté marcado como público
2. Verifica que `NEXT_PUBLIC_SUPABASE_STORAGE_URL` esté correcta

### Errores de Build

**Solución**: Revisa los logs en Vercel:
1. Ve a **Deployments**
2. Haz clic en el deployment fallido
3. Revisa el **Build Log**

---

## 📧 Configuración Adicional

### Dominio Personalizado (Opcional)

1. En Vercel, ve a **Settings** → **Domains**
2. Haz clic en **Add Domain**
3. Sigue las instrucciones para configurar tu dominio

### Alertas de Email

Las alertas de stock están configuradas para enviarse a:
```
granimarcr@gmail.com
```

Para cambiar el email:
1. Edita `src/lib/stockAlerts.ts`
2. Cambia `ALERT_EMAIL`
3. Haz commit y push

---

## 📊 Monitoreo

### Analytics (Opcional)

Vercel incluye analytics automáticos:
1. Ve a **Analytics** en tu proyecto
2. Visualiza visitas, performance, etc.

### Logs

Ver logs en tiempo real:
1. Ve a **Deployments** → Selecciona el actual
2. Haz clic en **Runtime Logs**

---

## 🆘 Soporte

Si tienes problemas:
1. 📖 Revisa la [documentación de Vercel](https://vercel.com/docs)
2. 📖 Revisa la [documentación de Supabase](https://supabase.com/docs)
3. 🔍 Busca el error en los logs de Vercel

---

## ✨ ¡Listo!

Tu Sistema Granimar CR está desplegado y funcionando en producción. 🎉

**URL de tu app**: `https://tu-proyecto.vercel.app`
