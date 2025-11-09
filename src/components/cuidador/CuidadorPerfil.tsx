import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { User } from "../../App";
import { LogOut, Mail, Shield } from "lucide-react";

interface CuidadorPerfilProps {
  user: User;
  onLogout: () => void;
}

export function CuidadorPerfil({ user, onLogout }: CuidadorPerfilProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00bcd4] to-[#00acc1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-perfil" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-perfil)" />
          </svg>
        </div>

        <div className="relative z-10 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-[#1e3a8a]">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-white text-2xl mb-1">{user.name}</h1>
          <p className="text-white/90 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6 relative z-20 pb-6">
        <Card className="shadow-lg mb-6">
          <div className="p-5">
            <h3 className="text-[#1e3a8a] mb-4">Informações da Conta</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                <Mail className="w-5 h-5 text-[#14b8a6]" />
                <div>
                  <p className="text-gray-500 text-sm">E-mail</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 py-3">
                <Shield className="w-5 h-5 text-[#14b8a6]" />
                <div>
                  <p className="text-gray-500 text-sm">Tipo de Conta</p>
                  <p className="text-gray-800 capitalize">{user.type}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="shadow-lg mb-6">
          <div className="p-5">
            <h3 className="text-[#1e3a8a] mb-4">Configurações</h3>
            
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-gray-800">Notificações</p>
                <p className="text-gray-500 text-sm mt-1">Gerencie suas preferências de notificação</p>
              </button>
              
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-gray-800">Privacidade</p>
                <p className="text-gray-500 text-sm mt-1">Configurações de privacidade e segurança</p>
              </button>
              
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-gray-800">Ajuda e Suporte</p>
                <p className="text-gray-500 text-sm mt-1">Central de ajuda e FAQ</p>
              </button>
            </div>
          </div>
        </Card>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50 rounded-lg py-6 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}
