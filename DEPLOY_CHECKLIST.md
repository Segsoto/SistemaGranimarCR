# ✅ Checklist Pre-Deploy

Usa esta lista antes de desplegar a producción:

## 📦 Código y Configuración

- [ ] ✅ Todos los cambios están commiteados
- [ ] ✅ No hay errores de TypeScript (`npm run type-check`)
- [ ] ✅ No hay errores de ESLint (`npm run lint`)
- [ ] ✅ El build local funciona (`npm run build`)
- [ ] ✅ `.env.local` NO está en el repositorio
- [ ] ✅ `.gitignore` incluye archivos sensibles
- [ ] ✅ `package.json` tiene todas las dependencias correctas

## 🗄️ Base de Datos

- [ ] ✅ Migraciones ejecutadas en Supabase:
  - [ ] `009_update_retiros_sobros.sql`
  - [ ] `010_add_imagen_to_materiales.sql`
  - [ ] `011_insert_initial_materials.sql` (opcional)
- [ ] ✅ Bucket `materiales` creado y público
- [ ] ✅ Políticas de storage configuradas
- [ ] ✅ RLS (Row Level Security) configurado

## 🔐 Variables de Entorno

- [ ] ✅ `NEXT_PUBLIC_SUPABASE_URL` configurada en Vercel
- [ ] ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada en Vercel
- [ ] ✅ `NEXT_PUBLIC_SUPABASE_STORAGE_URL` configurada en Vercel
- [ ] ✅ `RESEND_API_KEY` configurada en Vercel
- [ ] ✅ Todas las variables están en los 3 ambientes (Production, Preview, Development)

## 🌐 Vercel

- [ ] ✅ Proyecto conectado a GitHub
- [ ] ✅ Framework detectado como Next.js
- [ ] ✅ Build command: `npm run build`
- [ ] ✅ Output directory: `.next`
- [ ] ✅ Node version: 18.x o superior

## 🖼️ Assets y Storage

- [ ] ✅ Imágenes optimizadas (< 5MB)
- [ ] ✅ Formatos soportados: JPG, PNG, WEBP
- [ ] ✅ URLs de Supabase Storage configuradas en `next.config.js`

## 📧 Email

- [ ] ✅ API Key de Resend válida
- [ ] ✅ Email de destino configurado en `src/lib/stockAlerts.ts`
- [ ] ✅ Dominio de Resend verificado (si aplica)

## 🔍 Testing

- [ ] ✅ Dashboard carga correctamente
- [ ] ✅ CRUD de materiales funciona
- [ ] ✅ Subida de imágenes funciona
- [ ] ✅ Retiros (láminas/metros) funcionan
- [ ] ✅ Sobrantes se crean y usan correctamente
- [ ] ✅ Entrada/Salida de materiales funciona
- [ ] ✅ Alertas de stock se envían

## 🚀 Deploy

- [ ] ✅ Código en GitHub actualizado
- [ ] ✅ Deploy a Vercel iniciado
- [ ] ✅ Build exitoso (sin errores)
- [ ] ✅ Deployment funcionando en preview
- [ ] ✅ Todas las rutas accesibles

## ✅ Post-Deploy

- [ ] ✅ URL de producción verificada
- [ ] ✅ Datos se muestran correctamente
- [ ] ✅ Imágenes cargan desde Supabase
- [ ] ✅ Funcionalidad completa testeada
- [ ] ✅ No hay errores en consola del navegador
- [ ] ✅ Performance aceptable (< 3s carga inicial)

---

## 🐛 Si algo falla:

1. **Revisa los logs** en Vercel → Deployments → Build Logs
2. **Verifica variables** en Settings → Environment Variables
3. **Comprueba Supabase** URL y políticas de acceso
4. **Revisa console** del navegador para errores client-side
5. **Consulta** el archivo `DEPLOYMENT.md` para más ayuda

---

**Fecha del último deploy:** _______________

**Notas:**
- 
- 
- 
