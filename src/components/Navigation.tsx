'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingCart,
  DollarSign,
  Users,
  FileText,
  Menu,
  X,
  ChevronRight,
  Receipt,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Inventario',
    href: '/inventario',
    icon: Package,
    children: [
      { label: 'Materiales', href: '/inventario', icon: Package },
      { label: 'Herramientas', href: '/inventario/herramientas/discos', icon: Wrench },
      { label: 'Retiros Materiales', href: '/inventario/retiros', icon: ShoppingCart },
      { label: 'Retiros Herramientas', href: '/inventario/herramientas/discos/retiros', icon: Wrench },
    ],
  },
  {
    label: 'Producción',
    href: '/produccion',
    icon: Wrench,
    children: [
      { label: 'Costeo', href: '/costeo', icon: DollarSign },
      { label: 'Insumos', href: '/insumos', icon: Package },
    ],
  },
  {
    label: 'Facturación',
    href: '/facturacion',
    icon: Receipt,
  },
  {
    label: 'Gastos',
    href: '/gastos',
    icon: DollarSign,
  },
  {
    label: 'Proveedores',
    href: '/proveedores',
    icon: Users,
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: FileText,
  },
  {
    label: 'Configuración',
    href: '/configuracion',
    icon: Wrench,
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Inventario'])
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const NavLink = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.label)

    return (
      <div>
        <Link
          href={hasChildren ? '#' : item.href}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault()
              toggleExpanded(item.label)
            } else {
              setIsOpen(false)
            }
          }}
          className={`
            flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200
            ${depth > 0 ? 'pl-12' : ''}
            ${
              active
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/10'
                : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          {hasChildren && (
            <ChevronRight
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </Link>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavLink key={child.href} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/status')
        if (!mounted) return
        if (res.ok) {
          const data = await res.json()
          setAuthenticated(!!data.authenticated)
        } else {
          setAuthenticated(false)
        }
      } catch (err) {
        setAuthenticated(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-primary shadow-lg shadow-teal-900/20"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-40 shadow-xl shadow-slate-900/5
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-900/15">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Granimar CR</h1>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Sistema de Gestión</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                © 2025 Granimar CR
                <br />
                v1.0.1
              </div>
              <div>
                {authenticated === null ? null : authenticated ? (
                  <form
                    action="/api/logout"
                    method="post"
                    onSubmit={(e) => {
                      e.preventDefault()
                      fetch('/api/logout', { method: 'POST' }).then(() => {
                        window.location.href = '/login'
                      })
                    }}
                  >
                    <button className="btn btn-ghost btn-sm">Cerrar sesión</button>
                  </form>
                ) : (
                  <a href="/login" className="btn btn-ghost btn-sm">
                    Iniciar sesión
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
