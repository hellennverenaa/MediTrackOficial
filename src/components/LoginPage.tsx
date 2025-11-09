import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ArrowLeft, User, Stethoscope, AlertCircle } from "lucide-react";

interface LoginPageProps {
  onNavigate: (page: string, mode?: "paciente" | "cuidador") => void;
  onLogin: (email: string, password: string, mode: "paciente" | "cuidador") => boolean;
  selectedMode: "paciente" | "cuidador";
}

export function LoginPage({ onNavigate, onLogin, selectedMode }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = onLogin(email, password, selectedMode);
    if (!success) {
      setError(`Este email não está cadastrado como ${selectedMode === "paciente" ? "paciente" : "médico/cuidador"}.`);
    }
  };

  const modeConfig = {
    paciente: {
      title: "Acesso do Paciente",
      icon: User,
      gradient: "from-[#00bcd4] to-[#14b8a6]",
      buttonColor: "bg-[#14b8a6] hover:bg-[#14b8a6]/90"
    },
    cuidador: {
      title: "Acesso do Médico/Cuidador",
      icon: Stethoscope,
      gradient: "from-[#1e3a8a] to-[#2563eb]",
      buttonColor: "bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
    }
  };

  const config = modeConfig[selectedMode];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00bcd4] via-[#00acc1] to-[#14b8a6] relative overflow-hidden flex items-center justify-center p-4">
      {/* Wavy pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-login" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              <path d="M0 70 Q 25 50, 50 70 T 100 70" stroke="white" fill="none" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-login)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => onNavigate("landing")}
          className="mb-6 text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${config.gradient} p-6 text-center`}>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-white text-2xl">{config.title}</CardTitle>
          </div>

          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="rounded-xl border-gray-300 h-12 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-gray-300 h-12 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className={`w-full ${config.buttonColor} text-white rounded-xl h-12 text-base shadow-lg`}
              >
                Entrar
              </Button>

              <div className="text-center space-y-3 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate("cadastro", selectedMode)}
                  className="text-[#1e3a8a] hover:underline block w-full"
                >
                  Não tem conta? Cadastre-se
                </button>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm mb-2">Para testar:</p>
                  <p className="text-gray-600 text-xs">
                    {selectedMode === "paciente" 
                      ? "Use: paciente@teste.com" 
                      : "Use: cuidador@teste.com"}
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
