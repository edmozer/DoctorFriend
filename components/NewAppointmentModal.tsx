import React, { useState } from 'react';
import { AppointmentType, Patient } from '../types';
import { Button } from './Button';
import { X, Calendar, Clock, User, Check, MapPin, Video } from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
  patients: Patient[];
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, onCreate, patients }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(50);
  const [type, setType] = useState<AppointmentType>(AppointmentType.ONLINE);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientId || !date || !time) return;

        // Validação: não permitir datas/horários passados
        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        if (selectedDateTime < now) {
            alert('Não é permitido agendar para datas ou horários passados.');
            return;
        }

        setIsLoading(true);
        await onCreate({
                patientId,
                date,
                time,
                duration,
                type,
                status: 'SCHEDULED'
        });
        setIsLoading(false);
        onClose();
        // Reset form
        setPatientId('');
        setDate('');
    };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-fade-in" 
            onClick={onClose} 
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-scale-in">
          
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900">
                    New Session
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Schedule a new appointment.
                    </p>
                </div>
                <button onClick={onClose} className="bg-gray-50 rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
             {/* Patient Select */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                        required
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                        <option value="">Select a patient...</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                {patients.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No patients found. Add a patient first.</p>
                )}
             </div>

             {/* Date & Time */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="date" 
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="time" 
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>
             </div>

             {/* Duration & Type */}
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <button
                            type="button"
                            onClick={() => setType(AppointmentType.ONLINE)}
                            className={`flex-1 flex items-center justify-center py-1.5 text-sm font-medium rounded-lg transition-all ${type === AppointmentType.ONLINE ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Video className="w-4 h-4 mr-1.5" />
                            Online
                        </button>
                        <button
                            type="button"
                            onClick={() => setType(AppointmentType.IN_PERSON)}
                            className={`flex-1 flex items-center justify-center py-1.5 text-sm font-medium rounded-lg transition-all ${type === AppointmentType.IN_PERSON ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <MapPin className="w-4 h-4 mr-1.5" />
                            Person
                        </button>
                    </div>
                 </div>
             </div>

          </form>

          <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse border-t border-gray-100">
            <Button onClick={handleSubmit} isLoading={isLoading} disabled={!patientId} className="w-full sm:w-auto sm:ml-3 shadow-sm">
                <Check className="w-4 h-4 mr-2" />
                Schedule Session
            </Button>
            <Button variant="secondary" onClick={onClose} className="mt-3 sm:mt-0 w-full sm:w-auto bg-white">
                Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};