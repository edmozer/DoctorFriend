import React, { ReactNode } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Menu, X } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mb-1 group ${
        currentView === view
          ? 'bg-brand-50 text-brand-700 shadow-sm translate-x-1'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${currentView === view ? 'scale-110' : 'group-hover:scale-110'}`} />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b z-20 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30">DF</div>
            <span className="font-bold text-gray-800">Doctor Friend</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 active:scale-90 transition-transform">
          {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:block shadow-xl lg:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-16 lg:pt-0`}
      >
        <div className="h-full flex flex-col">
          <div className="hidden lg:flex items-center space-x-2 px-6 py-8 animate-fade-in">
             <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30 transform transition-transform hover:scale-105 hover:rotate-3">DF</div>
             <span className="text-xl font-bold text-gray-900 tracking-tight">Doctor Friend</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 animate-slide-right delay-100">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="patients" icon={Users} label="Patients" />
            <NavItem view="calendar" icon={Calendar} label="Calendar" />
          </nav>

          <div className="p-4 border-t animate-slide-up delay-200">
            <div className="flex items-center p-3 mb-2 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:border-gray-200">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border-2 border-white shadow-sm">
                    {CURRENT_USER.name.charAt(0)}
                </div>
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{CURRENT_USER.name}</p>
                    <p className="text-xs text-gray-500">Psychologist</p>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen pt-16 lg:pt-0 overflow-y-auto overflow-x-hidden bg-gray-50/50">
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Key prop triggers re-animation on view change */}
            <div key={currentView} className="animate-fade-in">
                {children}
            </div>
        </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};