import React, { useState } from 'react';
import { Appointment } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SessionDetailModal } from './SessionDetailModal';

interface CalendarViewProps {
  appointments: Appointment[];
  onUpdateAppointment: (apt: Appointment) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onUpdateAppointment }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentYear = today.getFullYear();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Calcular número de dias do mês atual
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Calcular o dia da semana do primeiro dia do mês
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  // Calcular o dia da semana do último dia do mês
  const lastDayOfWeek = new Date(currentYear, currentMonth, daysInMonth).getDay();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <span className="font-semibold text-gray-900">{monthNames[currentMonth]} {currentYear}</span>
            <button className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {day}
                </div>
            ))}
        </div>

        {/* Calendar Grid (Real Month) */}
        <div className="grid grid-cols-7 auto-rows-fr h-[600px]">
          {/* Empty days before first day */}
          {[...Array(firstDayOfWeek)].map((_, i) => <div key={`prev-${i}`} className="bg-gray-50/50 border-b border-r border-gray-100" />)}
          {/* Days of current month */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dayStr = `${currentYear}-${(currentMonth+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayAppts = appointments.filter(a => a.date === dayStr);
            const isToday = currentDay === day;
            return (
              <div key={day} className={`min-h-[100px] border-b border-r border-gray-100 p-2 relative group hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50 border-blue-400' : ''}`}>
                <span className={`text-sm font-medium ${dayAppts.length > 0 ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'text-blue-700 font-bold' : ''}`}>{day}</span>
                <div className="mt-1 space-y-1">
                  {dayAppts.map(apt => (
                    <div 
                      key={apt.id} 
                      onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                      className="text-xs bg-brand-100 text-brand-700 p-1 rounded truncate border-l-2 border-brand-500 cursor-pointer hover:bg-brand-200 transition-colors"
                    >
                      {apt.time} {apt.patientName}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {/* Empty days after last day */}
          {[...Array(6 - lastDayOfWeek)].map((_, i) => <div key={`next-${i}`} className="bg-gray-50/50 border-b border-r border-gray-100" />)}
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
    </div>
  );
};