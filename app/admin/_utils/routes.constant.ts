export const ADMIN_ROUTES = [
  {
    key: 1,
    name: 'Dashboard',
    path: '/admin/dashboard',
    role: ['1', '2'],
    enabled: true
  },
  {
    key: 2,
    name: 'Personalización',
    path: '/admin/customization',
    role: ['1', '2'],
    enabled: true
  },
  {
    key: 3,
    name: 'Entidades',
    path: '/admin/entities',
    role: ['1', '2'],
    enabled: true
  },
  {
    key: 4,
    name: 'Permisos',
    path: '/admin/permissions',
    role: ['1', '2'],
    enabled: true
  },
  {
    key: 5,
    name: 'Usuarios',
    path: '/admin/users',
    role: ['1', '2'],
    enabled: true
  },
  {
    key: 6,
    name: 'Monitoreo de Condicion',
    path: '/admin/moncon',
    role: ['1', '2', '3'],
    enabled: true
  },
  {
    key: 7,
    name: 'Equipos Rotatorios',
    path: '/admin/rotary-equipment',
    role: ['1', '2', '3'],
    enabled: true,
  },
  {
    key: 8,
    name: 'Equipos Estáticos',
    path: '/admin/static-equipment',
    role: ['1', '2', '3'],
    enabled: true,
  },
  {
    key: 9,
    name: 'Gestión de Planos',
    path: '/admin/blueprints',
    role: ['1', '2', '3'],
    enabled: false
  },
  {
    key: 10,
    name: 'Gestión de Interactivos',
    path: '/admin/interactives',
    role: ['1', '2', '3'],
    enabled: false
  },
]