import React, { useState } from 'react';
import { Button } from './Button';
import { Calendar, Brain, Shield, ChevronRight } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* Navigation */}
              <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
                 <Brain className="w-5 h-5 text-white" />
               </div>
               <span className="font-bold text-xl tracking-tight text-gray-900">Doctor Friend</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Features</a>
              <Button variant="ghost" onClick={() => setIsAuthModalOpen(true)}>Log in</Button>
              <Button onClick={() => setIsAuthModalOpen(true)}>Get Started</Button>
            </div>
        </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-slide-up inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-6 border border-brand-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 mr-2 animate-pulse"></span>
              Now with AI-Powered Clinical Notes
            </div>
            <h1 className="animate-slide-up delay-100 text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
              Focus on your patients,<br/>
              <span className="text-brand-600">we'll handle the rest.</span>
            </h1>
            <p className="animate-slide-up delay-200 text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Doctor Friend is the simplified workspace for freelance psychologists. 
              Manage sessions, secure notes, and automate reminders without the clutter of clinic software.
            </p>
            <div className="animate-slide-up delay-300 flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => setIsAuthModalOpen(true)} className="px-8 py-4 text-lg h-auto shadow-xl shadow-brand-500/20 transform hover:-translate-y-1 transition-all duration-300">
                Start for Free
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" onClick={() => setIsAuthModalOpen(true)} className="px-8 py-4 text-lg h-auto bg-white hover:bg-gray-50">
                View Demo
              </Button>
            </div>
            <p className="animate-slide-up delay-500 mt-6 text-sm text-gray-400">No credit card required • HIPAA Compliant logic</p>
          </div>
        </div>
        
        {/* Abstract shapes with animation */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-3xl opacity-60 animate-blob" />
           <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-200/30 rounded-full blur-3xl opacity-60 animate-blob delay-2000" />
           <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-teal-200/30 rounded-full blur-3xl opacity-60 animate-blob delay-4000" />
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up delay-100">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need, nothing you don't</h2>
            <p className="mt-4 text-lg text-gray-500">Designed specifically for the solo practitioner workflow.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              delay="delay-150"
              icon={<Calendar className="w-6 h-6 text-white" />} 
              color="bg-blue-500"
              title="Smart Scheduling" 
              description="Effortless calendar management that syncs 2-way with Google Calendar to prevent double bookings."
            />
            <FeatureCard 
              delay="delay-300"
              icon={<Brain className="w-6 h-6 text-white" />} 
              color="bg-purple-500"
              title="AI Clinical Assistant" 
              description="Generate professional summaries from your raw notes and get therapeutic question suggestions instantly."
            />
            <FeatureCard 
              delay="delay-500"
              icon={<Shield className="w-6 h-6 text-white" />} 
              color="bg-teal-500"
              title="Secure Records" 
              description="Keep patient data safe with encrypted, compliant storage accessible only to you."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
            {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 text-center text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
               <Brain className="w-6 h-6" />
               <span className="font-bold text-lg">Doctor Friend</span>
            </div>
            <p>&copy; 2023 Doctor Friend. Built with ❤️ for psychologists.</p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color, delay }: any) => (
  <div className={`bg-white p-8 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up ${delay}`}>
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 shadow-md transform transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);