import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { Button } from './Button';
import { X, Calendar, Clock, User, Wand2, Mail, Check, AlertCircle } from 'lucide-react';
import { generateClinicalSummary, generateReminderEmail, suggestTherapeuticQuestions } from '../services/geminiService';

interface SessionDetailModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Appointment) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ appointment, isOpen, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [summary, setSummary] = useState(appointment.summary || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'ai'>('details');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [status, setStatus] = useState(appointment.status);

  // Reset state when modal opens with a new appointment
  useEffect(() => {
    setNotes(appointment.notes || '');
    setSummary(appointment.summary || '');
    setStatus(appointment.status);
    setGeneratedEmail('');
  }, [appointment]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate({
      ...appointment,
      notes,
      summary,
      status
    });
    onClose();
  };

  const handleGenerateSummary = async () => {
    if (!notes.trim()) return;
    setIsGenerating(true);
    const result = await generateClinicalSummary(notes, appointment.patientName);
    setSummary(result);
    setIsGenerating(false);
  };

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    const result = await generateReminderEmail(appointment.patientName, appointment.date, appointment.time);
    setGeneratedEmail(result);
    setIsGenerating(false);
  };

  const handleSuggestQuestions = async () => {
      setIsGenerating(true);
      const result = await suggestTherapeuticQuestions(notes || "First session, anxious patient.");
      // Append to notes for now as a scratchpad
      setNotes(prev => prev + "\n\n--- AI Suggestions ---\n" + result);
      setIsGenerating(false);
  }

    // Mensagem WhatsApp
    const whatsappMsg = `Olá ${appointment.patientName}, este é um lembrete da sua consulta agendada para ${appointment.date} às ${appointment.time}. Qualquer dúvida, estou à disposição!`;
    const whatsappUrl = `https://wa.me/${appointment.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div 
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-fade-in" 
            onClick={onClose} 
            aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full animate-scale-in">
          
          {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100">
                        <div className="flex justify-end mb-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors text-sm font-semibold"
                            >
                                Enviar WhatsApp
                            </a>
                        </div>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                    Session Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage session data and clinical notes.
                    </p>
                </div>
                <button onClick={onClose} className="bg-gray-50 rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            {/* Tabs */}
            <div className="mt-6 flex space-x-6 border-b border-gray-100">
                {(['details', 'notes', 'ai'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                            activeTab === tab 
                            ? 'border-brand-600 text-brand-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 h-[420px] overflow-y-auto custom-scrollbar">
            
            {/* Details Tab */}
            {activeTab === 'details' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Patient</label>
                            <div className="flex items-center mt-2 text-gray-900 font-medium">
                                <User className="w-4 h-4 mr-2 text-brand-500" />
                                {appointment.patientName}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date & Time</label>
                            <div className="flex items-center mt-2 text-gray-900 font-medium">
                                <Calendar className="w-4 h-4 mr-2 text-brand-500" />
                                {appointment.date} <span className="mx-2 text-gray-300">|</span> {appointment.time}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duration</label>
                            <div className="flex items-center mt-2 text-gray-900 font-medium">
                                <Clock className="w-4 h-4 mr-2 text-brand-500" />
                                {appointment.duration} minutes
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                             <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</label>
                             <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                                className="mt-1 block w-full py-1 pl-0 pr-8 border-transparent bg-transparent text-gray-900 font-medium focus:ring-0 sm:text-sm cursor-pointer"
                             >
                                 {Object.values(AppointmentStatus).map(s => (
                                     <option key={s} value={s}>{s}</option>
                                 ))}
                             </select>
                        </div>
                    </div>

                    <div className="border border-blue-100 rounded-xl p-5 bg-blue-50/50">
                        <div className="flex items-start">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-blue-900">Quick Actions</h4>
                                <p className="text-xs text-blue-700 mt-1 mb-3">AI tools to help you prepare or follow up.</p>
                                <div className="flex space-x-3">
                                    <Button variant="secondary" onClick={() => setActiveTab('ai')} className="text-xs bg-white border-blue-200 hover:bg-blue-50 text-blue-700 shadow-sm">
                                        <Mail className="w-3 h-3 mr-2" />
                                        Draft Reminder
                                    </Button>
                                    <Button variant="secondary" onClick={() => setActiveTab('ai')} className="text-xs bg-white border-blue-200 hover:bg-blue-50 text-blue-700 shadow-sm">
                                        <Wand2 className="w-3 h-3 mr-2" />
                                        Prepare Questions
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
                <div className="space-y-4 h-full flex flex-col animate-fade-in">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Notes (Private)
                        </label>
                        <textarea
                            className="w-full h-40 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow resize-none"
                            placeholder="Type raw session observations here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Clinical Summary
                            </label>
                            <Button 
                                type="button" 
                                variant="secondary" 
                                className="text-xs py-1 h-8 bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100"
                                onClick={handleGenerateSummary}
                                isLoading={isGenerating}
                                disabled={!notes}
                            >
                                <Wand2 className="w-3 h-3 mr-1.5" />
                                Auto-Summarize
                            </Button>
                        </div>
                        <textarea
                            className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow resize-none"
                            placeholder="AI generated summary will appear here..."
                            value={summary}
                            readOnly
                        />
                    </div>
                </div>
            )}

            {/* AI Assistant Tab */}
            {activeTab === 'ai' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-1">
                        <h4 className="font-bold text-gray-900 flex items-center mb-2">
                            <div className="p-1.5 bg-brand-100 rounded-md mr-2">
                                <Mail className="w-4 h-4 text-brand-600" />
                            </div>
                            Email Assistant
                        </h4>
                        <p className="text-sm text-gray-500 mb-4 pl-9">Generate a polite reminder or follow-up email for this patient.</p>
                        <Button onClick={handleGenerateEmail} isLoading={isGenerating} variant="secondary" className="w-full mb-4 ml-9 w-[calc(100%-2.25rem)]">
                            Generate Reminder Email
                        </Button>
                        {generatedEmail && (
                            <div className="ml-9 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 animate-slide-up">
                                {generatedEmail}
                            </div>
                        )}
                    </div>
                     <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-bold text-gray-900 flex items-center mb-2">
                            <div className="p-1.5 bg-purple-100 rounded-md mr-2">
                                <Wand2 className="w-4 h-4 text-purple-600" />
                            </div>
                            Session Prep
                        </h4>
                         <p className="text-sm text-gray-500 mb-4 pl-9">Get 3 suggested therapeutic questions based on your notes.</p>
                         <Button onClick={handleSuggestQuestions} isLoading={isGenerating} variant="secondary" className="ml-9 w-[calc(100%-2.25rem)]">
                            Generate Questions
                        </Button>
                    </div>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <Button onClick={handleSave} className="w-full sm:w-auto sm:ml-3 shadow-sm">
                <Check className="w-4 h-4 mr-2" />
                Save Changes
            </Button>
            <Button variant="secondary" onClick={onClose} className="mt-3 sm:mt-0 w-full sm:w-auto bg-white hover:bg-gray-50">
                Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};