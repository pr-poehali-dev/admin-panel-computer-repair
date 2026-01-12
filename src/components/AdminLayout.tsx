import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Панель управления', icon: 'LayoutDashboard', path: '/dashboard' },
  { id: 'orders', label: 'Заказы', icon: 'ClipboardList', path: '/orders' },
  { id: 'clients', label: 'Клиенты', icon: 'Users', path: '/clients' },
  { id: 'devices', label: 'Устройства', icon: 'Laptop', path: '/devices' },
  { id: 'repairs', label: 'Ремонты', icon: 'Wrench', path: '/repairs' },
  { id: 'parts', label: 'Запчасти', icon: 'Package', path: '/parts' },
  { id: 'warehouse', label: 'Склад', icon: 'Warehouse', path: '/warehouse' },
  { id: 'staff', label: 'Сотрудники', icon: 'UserCog', path: '/staff', roles: ['admin'] },
  { id: 'services', label: 'Услуги', icon: 'Briefcase', path: '/services' },
  { id: 'finances', label: 'Финансы', icon: 'DollarSign', path: '/finances', roles: ['admin', 'manager'] },
  { id: 'reports', label: 'Отчёты', icon: 'FileText', path: '/reports', roles: ['admin', 'manager'] },
  { id: 'analytics', label: 'Аналитика', icon: 'BarChart3', path: '/analytics', roles: ['admin', 'manager'] },
  { id: 'notifications', label: 'Уведомления', icon: 'Bell', path: '/notifications' },
  { id: 'settings', label: 'Настройки', icon: 'Settings', path: '/settings', roles: ['admin'] },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const visibleMenuItems = menuItems.filter(
    (item) => !item.roles || hasPermission(item.roles as any)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Wrench" size={20} className="text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">TechRepair</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {visibleMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                location.pathname === item.path && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              )}
            >
              <Icon name={item.icon} size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
            {!collapsed && <span className="ml-3">Тема</span>}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {visibleMenuItems.find((item) => item.path === location.pathname)?.label || 'Админ панель'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {user?.role === 'admin' ? 'Администратор' : user?.role === 'manager' ? 'Менеджер' : 'Техник'}
              </p>
            </div>
            <Avatar>
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} />
              Выход
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
