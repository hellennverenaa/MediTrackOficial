import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ArrowLeft, User, Stethoscope, AlertCircle, CheckCircle2 } from "lucide-react";
import { authService } from "../services/api"; // ← IMPORTA A API

interface LoginPageProps {
  onNavigate: (page: string, mode?: "paciente" | "cuidador") => void;
  selectedMode: "paciente" | "cuidador";
  onLoginSuccess?: (user: any, userType: "paciente" | "cuidador") => void; // ← NOVA PROP
}

export function LoginPage({ onNavigate, selectedMode, onLoginSuccess }: LoginPageProps) {
  console.log("🚀 [LoginPage] COMPONENTE RENDERIZADO");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🔐 [LoginPage] handleSubmit CHAMADO");
    
    // FORÇA preventDefault MÚLTIPLAS VEZES para garantir
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🔐 [LoginPage] preventDefault executado");
    
    if (loading) {
      console.log("🔐 [LoginPage] Já está carregando, ignorando...");
      return;
    }
    
    setError("");
    setSuccessMessage("");
    setLoading(true);
    
    try {
      console.log("🔐 [LoginPage] Tentando login com:", { email });
      const response = await authService.login({ email, password });
      
      console.log("✅ Login realizado com sucesso!", response);

      // Salva o tipo de usuário
      localStorage.setItem("userType", selectedMode);
      
      // Chama callback para atualizar o App.tsx
      if (onLoginSuccess) {
        onLoginSuccess(response.user, selectedMode);
      }
      
      // Mostra mensagem de sucesso
      setSuccessMessage("Login realizado com sucesso!");
      
      // NÃO chama onNavigate aqui! O handleLoginSuccess já faz isso

    } catch (err: any) {
      console.error("❌ Erro ao fazer login:", err);
      console.log("🔐 [LoginPage] Entrando no CATCH");
      
      // Trata diferentes tipos de erro
      if (err.response?.status === 401) {
        setError("Email ou senha incorretos. Verifique seus dados e tente novamente.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === "Network Error") {
        setError("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
      
      console.log("🔐 [LoginPage] Erro setado, mantendo na mesma tela");
      console.log("🔐 [LoginPage] NÃO vai chamar onNavigate");
    } finally {
      console.log("🔐 [LoginPage] Finally - setando loading = false");
      setLoading(false);
      console.log("🔐 [LoginPage] handleSubmit FINALIZADO");
    }
  };

  const modeConfig = {
    paciente: {
      title: "Acesso do Paciente",
      icon: User,
      gradient: "from-[#00bcd4] to-[#14b8a6]",
      buttonColor: "bg-[#14b8a6] hover:bg-[#14b8a6]/90",
      errorBg: "from-red-50 to-red-100",
      successBg: "from-green-50 to-green-100"
    },
    cuidador: {
      title: "Acesso do Médico/Cuidador",
      icon: Stethoscope,
      gradient: "from-[#1e3a8a] to-[#2563eb]",
      buttonColor: "bg-[#1e3a8a] hover:bg-[#1e3a8a]/90",
      errorBg: "from-red-50 to-red-100",
      successBg: "from-blue-50 to-blue-100"
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
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${config.gradient} p-6 text-center relative overflow-hidden`}>
            {/* Animated background circles */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform hover:scale-110">
                <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-white text-2xl font-bold">{config.title}</CardTitle>
              <p className="text-white/80 text-sm mt-2">Entre com suas credenciais</p>
            </div>
          </div>

          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message - Novo design animado */}
              {successMessage && (
                <div className={`bg-gradient-to-r ${config.successBg} border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300 shadow-lg`}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-green-900 font-semibold text-base">Sucesso!</h4>
                    <p className="text-green-700 text-sm mt-1">{successMessage}</p>
                    <p className="text-green-600 text-xs mt-2">Redirecionando...</p>
                  </div>
                </div>
              )}

              {/* Error Message - Design melhorado e animado */}
              {error && (
                <div className={`bg-gradient-to-r ${config.errorBg} border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300 shadow-lg`}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-900 font-semibold text-base">Ops! Algo deu errado</h4>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                    {error.includes("Email ou senha") && (
                      <button
                        type="button"
                        onClick={() => onNavigate("cadastro", selectedMode)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium underline mt-2 inline-block"
                      >
                        Não tem conta? Cadastre-se aqui
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="rounded-xl border-gray-300 h-12 text-base focus:ring-2 focus:ring-[#00bcd4] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-gray-300 h-12 text-base focus:ring-2 focus:ring-[#00bcd4] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e as any);
                }}
                className={`w-full ${config.buttonColor} text-white rounded-xl h-12 text-base shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] active:scale-[0.98]`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="text-center space-y-3 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate("cadastro", selectedMode)}
                  className="text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium hover:underline block w-full transition-colors"
                  disabled={loading}
                >
                  Não tem conta? Cadastre-se
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Dica de teste removida - agora usa dados reais */}
      </div>
    </div>
  );
}