import React, { useState } from 'react';
import { CURRENT_USER } from '../constants';
import { Appointment, Patient, ViewState } from '../types';
import { Calendar, Users, Clock, Video, MapPin, CheckCircle, ChevronRight, Plus } from 'lucide-react';
import { SessionDetailModal } from './SessionDetailModal';
import { NewAppointmentModal } from './NewAppointmentModal';
import { Button } from './Button';

interface DashboardProps {
  appointments: Appointment[];
  patients: Patient[];
  onNavigate: (view: ViewState) => void;
  onUpdateAppointment: (apt: Appointment) => void;
  onCreateAppointment: (data: any) => Promise<void>;
}

export const Dashboard: React.FC<DashboardProps> = ({ appointments, patients, onNavigate, onUpdateAppointment, onCreateAppointment }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  // Filter for today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(apt => apt.date === today);
  const nextAppointment = todaysAppointments.find(apt => apt.status === 'SCHEDULED');

  const StatCard = ({ icon: Icon, color, bg, title, value, sub, delay }: any) => (
      <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-slide-up ${delay}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${bg} p-3 rounded-xl ${color} shadow-sm`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Today</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          {sub && <p className="text-xs text-gray-400 mt-2 truncate">{sub}</p>}
      </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {CURRENT_USER.name || 'Doctor Friend'}. Here's your overview.</p>
        </div>
        <div className="flex space-x-3">
             <Button onClick={() => setIsNewSessionModalOpen(true)} className="shadow-lg shadow-brand-500/20">
                <Plus className="w-4 h-4 mr-2" />
                New Session
             </Button>
            <button 
                onClick={() => onNavigate('calendar')}
                className="group flex items-center text-sm text-brand-600 font-semibold bg-brand-50 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors"
            >
                View Full Calendar 
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            delay="delay-75"
            icon={Calendar} 
            bg="bg-brand-50" 
            color="text-brand-600" 
            value={todaysAppointments.length} 
            title="Sessions scheduled" 
        />
        <StatCard 
            delay="delay-150"
            icon={Users} 
            bg="bg-purple-50" 
            color="text-purple-600" 
            value={patients.length} 
            title="Active patients" 
        />
        <StatCard 
            delay="delay-200"
            icon={Clock} 
            bg="bg-teal-50" 
            color="text-teal-600" 
            value={nextAppointment ? nextAppointment.time : '--:--'} 
            title="Next Session" 
            sub={nextAppointment ? `with ${nextAppointment.patientName}` : 'No pending sessions'}
        />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-slide-up delay-300">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm">
            {today}
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {todaysAppointments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-medium">No sessions scheduled for today.</p>
                <div className="mt-4">
                     <Button variant="secondary" onClick={() => setIsNewSessionModalOpen(true)} className="text-xs">
                        Schedule One
                     </Button>
                </div>
            </div>
          ) : (
            todaysAppointments.map((apt, index) => (
              <div 
                key={apt.id} 
                onClick={() => setSelectedAppointment(apt)}
                className={`p-5 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group animate-slide-right`}
                style={{ animationDelay: `${400 + (index * 100)}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-16 text-center py-1 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100">
                    <p className="text-lg font-bold text-gray-900">{apt.time}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400">{apt.duration} min</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{apt.patientName}</h3>
                    <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
                        <span className="flex items-center">
                            {apt.type === 'ONLINE' ? <Video className="w-3.5 h-3.5 mr-1.5" /> : <MapPin className="w-3.5 h-3.5 mr-1.5" />}
                            {apt.type === 'ONLINE' ? 'Online Call' : 'In-Person'}
                        </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                    {apt.status === 'COMPLETED' ? (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                             <CheckCircle className="w-3 h-3 mr-1" />
                             Completed
                         </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-100 transition-colors">
                            Scheduled
                        </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 ml-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <SessionDetailModal 
            appointment={selectedAppointment} 
            isOpen={!!selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdate={onUpdateAppointment}
        />
      )}

      {/* New Session Modal */}
      <NewAppointmentModal 
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onCreate={onCreateAppointment}
        patients={patients}
      />
    </div>
  );
};