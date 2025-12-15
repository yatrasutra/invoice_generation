import React from 'react';
import ThemeToggle from '../ThemeToggle';

// Header Component - Compact top bar with brand and user profile
export const AppHeader = ({ 
  brandName = 'TravelPDF Manager',
  brandLogo,
  user,
  onLogout,
  children 
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  const getUserInitials = (user) => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="app-header">
      <div className="header-content max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className="h-8 w-auto" />
          ) : (
            <div className="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{brandName}</span>
            <span className="hidden sm:inline-flex px-2 py-0.5 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
              Pro
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        {children && (
          <nav className="hidden md:flex items-center gap-1">
            {children}
          </nav>
        )}

        {/* User Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="btn-icon relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <div className="avatar">
                {getUserInitials(user)}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="dropdown-menu animate-scale-in">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout?.();
                    }}
                    className="dropdown-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Tab Navigation Item
export const NavTab = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
      active 
        ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
    }`}
  >
    {icon && <span className="w-4 h-4">{icon}</span>}
    {children}
  </button>
);

// Status Badge Component
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { class: 'badge-draft', label: 'Draft', icon: null },
    pending: { class: 'badge-pending', label: 'Pending', icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )},
    approved: { class: 'badge-approved', label: 'Approved', icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )},
    final: { class: 'badge-final', label: 'Final', icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )},
    rejected: { class: 'badge-rejected', label: 'Rejected', icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )},
    sent: { class: 'badge-sent', label: 'Sent', icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    )},
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;

  return (
    <span className={`badge ${config.class}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon,
  title = 'No items found',
  description,
  action,
  actionLabel
}) => (
  <div className="empty-state">
    {icon || (
      <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )}
    <h3 className="empty-state-title">{title}</h3>
    {description && <p className="empty-state-description">{description}</p>}
    {action && actionLabel && (
      <button onClick={action} className="btn-primary mt-4">
        {actionLabel}
      </button>
    )}
  </div>
);

// Toast Notification Component
export const Toast = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: (
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className={`toast toast-${type} animate-slide-in`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Loading Spinner
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClass = size === 'sm' ? 'spinner-sm' : 'spinner';
  return <div className={`${sizeClass} ${className}`} />;
};

// Skeleton Loader
export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
    card: 'h-32 w-full rounded-xl',
  };
  
  return <div className={`skeleton ${variants[variant]} ${className}`} />;
};

// Stat Card
export const StatCard = ({ label, value, icon, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400',
    success: 'bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    warning: 'bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    error: 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="stat-label">{label}</span>
        {icon && (
          <div className={`stat-icon ${colors[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <p className="stat-value">{value}</p>
    </div>
  );
};

// Action Button with Loading State
export const ActionButton = ({ 
  onClick, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon,
  children 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]}`}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

// Section Header
export const SectionHeader = ({ icon, iconColor = 'primary', title, subtitle, action }) => {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400',
    blue: 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    pink: 'bg-pink-50 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400',
    teal: 'bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[iconColor]}`}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};

// Filter Tabs
export const FilterTabs = ({ filters, activeFilter, onFilterChange }) => (
  <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
    {filters.map((filter) => (
      <button
        key={filter.value}
        onClick={() => onFilterChange(filter.value)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
          activeFilter === filter.value
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        {filter.icon && <span className="mr-1.5">{filter.icon}</span>}
        {filter.label}
        {filter.count !== undefined && (
          <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
            activeFilter === filter.value 
              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}>
            {filter.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

export { default as ThemeToggle } from '../ThemeToggle';

export default {
  AppHeader,
  NavTab,
  StatusBadge,
  EmptyState,
  Toast,
  Spinner,
  Skeleton,
  StatCard,
  ActionButton,
  SectionHeader,
  FilterTabs,
  ThemeToggle,
};
