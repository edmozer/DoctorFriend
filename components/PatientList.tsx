import React, { useState } from 'react';
import { Patient } from '../types';
import { Search, Plus, Phone, Mail, ChevronRight, X, User, Save } from 'lucide-react';
import { Button } from './Button';

interface PatientListProps {
  patients: Patient[];
  onAddPatient: (data: any) => Promise<void>;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onAddPatient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', notes: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onAddPatient(newPatient);
    setIsLoading(false);
    setIsModalOpen(false);
    setNewPatient({ name: '', email: '', phone: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patients</h1>
          <p className="text-gray-500 mt-1">Manage your patient directory.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-brand-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative animate-slide-up delay-75">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
            type="text" 
            placeholder="Search patients by name..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none shadow-sm transition-all"
        />
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden animate-slide-up delay-150">
        {patients.length === 0 ? (
            <div className="p-12 text-center">
                <p className="text-gray-500">No patients found. Add your first patient to get started.</p>
            </div>
        ) : (
            <ul className="divide-y divide-gray-100">
                {patients.map((patient, index) => (
                    <li 
                        key={patient.id} 
                        className="group p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer animate-slide-up"
                        style={{ animationDelay: `${150 + (index * 50)}ms` }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm border border-white shadow-sm">
                                    {patient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{patient.name}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-2 sm:gap-4 text-sm text-gray-500">
                                        <span className="flex items-center hover:text-gray-700">
                                            <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {patient.email}
                                        </span>
                                        <span className="flex items-center hover:text-gray-700">
                                            <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {patient.phone}
                                        </span>
                                    </div>
                                    {patient.notes && (
                                        <p className="mt-3 text-sm text-gray-600 bg-amber-50 p-2 px-3 rounded-lg border border-amber-100 inline-block max-w-xl">
                                            <span className="font-bold text-[10px] text-amber-600/70 block mb-0.5 uppercase tracking-wider">Internal Note</span>
                                            {patient.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <Button variant="secondary" className="text-xs py-1.5 bg-white group-hover:border-gray-300">View History</Button>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )}
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
             <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-scale-in">
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Add New Patient</h3>
                        <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600"/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" required 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={newPatient.name}
                                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={newPatient.email}
                                    onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input 
                                    type="tel" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={newPatient.phone}
                                    onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes (Optional)</label>
                            <textarea 
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none h-24 resize-none"
                                value={newPatient.notes}
                                onChange={e => setNewPatient({...newPatient, notes: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                             <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Create Patient
                             </Button>
                        </div>
                    </form>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};