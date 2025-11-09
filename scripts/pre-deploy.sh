#!/bin/bash

# Script para verificar que todo está listo para el deploy
# Ejecutar con: npm run pre-deploy

echo "🔍 Verificando configuración para deploy..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# 1. Verificar archivos necesarios
echo "📁 Verificando archivos..."
files=("package.json" "next.config.js" "vercel.json" ".env.local.example" ".gitignore")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file existe"
    else
        echo -e "${RED}✗${NC} $file NO encontrado"
        errors=$((errors + 1))
    fi
done
echo ""

# 2. Verificar que .env.local NO esté en git
echo "🔐 Verificando seguridad..."
if git ls-files --error-unmatch .env.local 2>/dev/null; then
    echo -e "${RED}✗${NC} .env.local está en git (PELIGRO)"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✓${NC} .env.local NO está en git"
fi
echo ""

# 3. Verificar TypeScript
echo "📝 Verificando TypeScript..."
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Sin errores de TypeScript"
else
    echo -e "${YELLOW}⚠${NC} Hay errores de TypeScript"
    errors=$((errors + 1))
fi
echo ""

# 4. Verificar build
echo "🔨 Verificando build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build exitoso"
else
    echo -e "${RED}✗${NC} Build falló"
    errors=$((errors + 1))
fi
echo ""

# 5. Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✓ TODO LISTO PARA DEPLOY${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. git add ."
    echo "2. git commit -m 'Preparar para deploy'"
    echo "3. git push origin main"
    echo "4. Configurar variables en Vercel"
    echo "5. Deploy desde Vercel Dashboard"
else
    echo -e "${RED}✗ HAY $errors ERROR(ES)${NC}"
    echo ""
    echo "Revisa los errores antes de continuar"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
