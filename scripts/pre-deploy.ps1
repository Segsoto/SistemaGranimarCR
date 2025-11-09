# 🚀 Script de Pre-Deploy para Windows PowerShell
# Este script verifica que el proyecto esté listo para deployment

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   VERIFICACION PRE-DEPLOY" -ForegroundColor Cyan
Write-Host "   Sistema Granimar CR" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0

# 1. Verificar Node.js
Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js NO encontrado" -ForegroundColor Red
    $ErrorCount++
}

# 2. Verificar archivos requeridos
Write-Host "`n2. Verificando archivos requeridos..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "next.config.js",
    "tsconfig.json",
    ".env.local.example",
    ".env.production.example",
    "DEPLOYMENT.md",
    "DEPLOY_CHECKLIST.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file NO encontrado" -ForegroundColor Red
        $ErrorCount++
    }
}

# 3. Verificar .env.local
Write-Host "`n3. Verificando variables de entorno..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    $requiredVars = @(
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "NEXT_PUBLIC_SUPABASE_STORAGE_URL",
        "RESEND_API_KEY"
    )
    
    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Write-Host "   ✓ $var" -ForegroundColor Green
        } else {
            Write-Host "   ✗ $var NO encontrado" -ForegroundColor Red
            $ErrorCount++
        }
    }
} else {
    Write-Host "   ✗ .env.local NO encontrado" -ForegroundColor Red
    Write-Host "   Copia .env.local.example a .env.local" -ForegroundColor Yellow
    $ErrorCount++
}

# 4. Verificar migraciones
Write-Host "`n4. Verificando migraciones SQL..." -ForegroundColor Yellow
$migrations = @(
    "migrations/009_update_retiros_sobros.sql",
    "migrations/010_add_imagen_to_materiales.sql",
    "migrations/011_insert_initial_materials.sql"
)

foreach ($migration in $migrations) {
    if (Test-Path $migration) {
        Write-Host "   ✓ $migration" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $migration NO encontrado" -ForegroundColor Red
        $ErrorCount++
    }
}

# 5. Instalar dependencias
Write-Host "`n5. Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "   ⚠ node_modules NO existe, instalando..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Dependencias instaladas" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Error instalando dependencias" -ForegroundColor Red
        $ErrorCount++
    }
}

# 6. Type Check
Write-Host "`n6. Ejecutando type-check..." -ForegroundColor Yellow
npm run type-check 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ TypeScript OK" -ForegroundColor Green
} else {
    Write-Host "   ✗ Errores de TypeScript encontrados" -ForegroundColor Red
    Write-Host "   Ejecuta: npm run type-check" -ForegroundColor Yellow
    $ErrorCount++
}

# 7. Lint
Write-Host "`n7. Ejecutando lint..." -ForegroundColor Yellow
npm run lint 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ ESLint OK" -ForegroundColor Green
} else {
    Write-Host "   ✗ Errores de ESLint encontrados" -ForegroundColor Red
    Write-Host "   Ejecuta: npm run lint" -ForegroundColor Yellow
    $ErrorCount++
}

# 8. Build Test
Write-Host "`n8. Probando build de producción..." -ForegroundColor Yellow
Write-Host "   (esto puede tomar un momento...)" -ForegroundColor Gray
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Build exitoso" -ForegroundColor Green
} else {
    Write-Host "   ✗ Build falló" -ForegroundColor Red
    Write-Host "   Ejecuta: npm run build para ver detalles" -ForegroundColor Yellow
    $ErrorCount++
}

# 9. Git Status
Write-Host "`n9. Verificando Git..." -ForegroundColor Yellow
try {
    $gitStatus = git status --short
    if ($gitStatus) {
        Write-Host "   ⚠ Hay cambios sin commitear" -ForegroundColor Yellow
        Write-Host "   Archivos modificados:" -ForegroundColor Gray
        git status --short | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
    } else {
        Write-Host "   ✓ Todo commiteado" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ Git no disponible o no es un repositorio" -ForegroundColor Yellow
}

# Resumen Final
Write-Host "`n=====================================" -ForegroundColor Cyan
if ($ErrorCount -eq 0) {
    Write-Host "   ✅ LISTO PARA DEPLOY" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "`nPróximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Commit y push los cambios a GitHub" -ForegroundColor White
    Write-Host "2. Lee DEPLOYMENT.md para instrucciones detalladas" -ForegroundColor White
    Write-Host "3. Importa el proyecto en Vercel" -ForegroundColor White
    Write-Host "4. Configura las variables de entorno" -ForegroundColor White
    Write-Host "5. Deploy! 🚀" -ForegroundColor White
} else {
    Write-Host "   ❌ $ErrorCount ERRORES ENCONTRADOS" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "`nPor favor corrige los errores antes de continuar." -ForegroundColor Yellow
}

Write-Host ""
