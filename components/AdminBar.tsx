import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { fetchAllProfiles } from '../services/authService';
import { Users, ShieldAlert, X } from 'lucide-react';

interface AdminBarProps {
  currentImpersonation: string | null;
  onImpersonate: (userId: string | null) => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({ currentImpersonation, onImpersonate }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const list = await fetchAllProfiles();
    setProfiles(list);
  };

  if (!isOpen && !currentImpersonation) {
    return (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform z-50 flex items-center"
            title="Admin Tools"
        >
            <ShieldAlert className="w-5 h-5" />
        </button>
    )
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-50 transition-transform duration-300 ${isOpen || currentImpersonation ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="font-bold text-sm uppercase tracking-wider">Admin Mode</span>
            {currentImpersonation && (
                <span className="bg-red-600 text-xs px-2 py-1 rounded">Impersonating Active</span>
            )}
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <select 
                    className="bg-gray-800 border border-gray-700 text-sm rounded px-3 py-1 focus:outline-none focus:border-brand-500"
                    value={currentImpersonation || ''}
                    onChange={(e) => onImpersonate(e.target.value || null)}
                >
                    <option value="">-- View as Myself --</option>
                    {profiles.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.full_name} ({p.role})
                        </option>
                    ))}
                </select>
            </div>
            {!currentImpersonation && (
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};