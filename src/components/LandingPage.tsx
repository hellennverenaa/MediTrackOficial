import { Stethoscope, User, ArrowRight, Activity, Shield } from "lucide-react";
import { Card } from "./ui/card";

interface LandingPageProps {
  onNavigate: (page: string, mode?: "paciente" | "cuidador") => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00bcd4] via-[#00acc1] to-[#14b8a6] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-landing" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              <path d="M0 70 Q 25 50, 50 70 T 100 70" stroke="white" fill="none" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-landing)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Activity className="w-11 h-11 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-white text-4xl mb-3">MediTrak</h1>
          <p className="text-white/90 text-lg">
            Gerenciamento inteligente de medicações
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="flex-1 flex flex-col gap-6 mb-8">
          <div className="text-center mb-2">
            <p className="text-white/95">Escolha como deseja acessar:</p>
          </div>

          {/* Paciente Card */}
          <Card 
            onClick={() => onNavigate("login", "paciente")}
            className="bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transform transition-all hover:scale-105 active:scale-95 border-0"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00bcd4] to-[#14b8a6] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                <User className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-[#1e3a8a] text-2xl mb-3">
                Sou Paciente
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Visualize seus horários, receba alarmes e confirme suas medicações
              </p>

              <div className="flex items-center gap-2 text-[#14b8a6]">
                <span>Acessar como paciente</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Cuidador/Médico Card */}
          <Card 
            onClick={() => onNavigate("login", "cuidador")}
            className="bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transform transition-all hover:scale-105 active:scale-95 border-0"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                <Stethoscope className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-[#1e3a8a] text-2xl mb-3">
                Sou Médico/Cuidador
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Gerencie pacientes, adicione medicações e monitore a adesão
              </p>

              <div className="flex items-center gap-2 text-[#1e3a8a]">
                <span>Acessar como cuidador</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white">Seguro e Confiável</span>
          </div>
          <p className="text-white/80 text-sm">
            Seus dados de saúde protegidos com criptografia
          </p>
        </div>
      </div>
    </div>
  );
}
