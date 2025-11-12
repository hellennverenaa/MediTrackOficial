import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ArrowLeft, User, Stethoscope, CheckCircle2 } from "lucide-react";
import { authService } from "../services/api"; // ← IMPORTA A API

interface CadastroPageProps {
  onNavigate: (page: string, mode?: "paciente" | "cuidador") => void;
  selectedMode: "paciente" | "cuidador";
  onSignupSuccess?: (user: any, userType: "paciente" | "cuidador") => void; // ← NOVA PROP
}

export function CadastroPage({ onNavigate, selectedMode, onSignupSuccess }: CadastroPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cuidadorEmail, setCuidadorEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // ← NOVO

  const handleSubmit = async (e: React.FormEvent) => { // ← ASYNC
    e.preventDefault();
    setError("");
    
    // Validações
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    if (selectedMode === "paciente" && !cuidadorEmail) {
      setError("É necessário informar o email do seu médico/cuidador!");
      return;
    }

    // ========================================
    // 🔥 CONEXÃO COM A API - NOVO CÓDIGO
    // ========================================
    setLoading(true);

    try {
      // Chama a API do back-end
      const response = await authService.register({
        name,
        email,
        password
      });

      console.log("✅ Cadastro realizado com sucesso!", response);
      console.log("📋 response.user:", response.user);
      console.log("📋 selectedMode:", selectedMode);

      // Salva informações extras no localStorage (se necessário)
      if (selectedMode === "paciente") {
        localStorage.setItem("userType", "paciente");
        localStorage.setItem("cuidadorEmail", cuidadorEmail);
        if (cpf) localStorage.setItem("cpf", cpf);
        if (birthdate) localStorage.setItem("birthdate", birthdate);
      } else {
        localStorage.setItem("userType", "cuidador");
      }

      console.log("📋 Verificando onSignupSuccess:", !!onSignupSuccess);
      
      // Mostra mensagem de sucesso primeiro
      setSuccess(true);
      
      // Aguarda um pouco e depois chama o callback
      setTimeout(() => {
        // Chama callback para atualizar o App.tsx
        if (onSignupSuccess) {
          console.log("📋 Chamando onSignupSuccess...");
          onSignupSuccess(response.user, selectedMode);
          console.log("📋 onSignupSuccess chamado!");
        } else {
          console.error("❌ onSignupSuccess NÃO EXISTE!");
        }
      }, 500); // Aguarda 500ms

    } catch (err: any) {
      // Trata erros da API
      console.error("❌ Erro ao cadastrar:", err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const modeConfig = {
    paciente: {
      title: "Cadastro de Paciente",
      icon: User,
      gradient: "from-[#00bcd4] to-[#14b8a6]",
      buttonColor: "bg-[#14b8a6] hover:bg-[#14b8a6]/90"
    },
    cuidador: {
      title: "Cadastro de Médico/Cuidador",
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
            <pattern id="wave-cadastro" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" fill="none" strokeWidth="2" />
              <path d="M0 70 Q 25 50, 50 70 T 100 70" stroke="white" fill="none" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-cadastro)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => onNavigate("login", selectedMode)}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mensagem de Sucesso - Design bonito */}
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300 shadow-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-green-900 font-semibold text-base">Conta criada com sucesso! 🎉</h4>
                    <p className="text-green-700 text-sm mt-1">Bem-vindo ao MediTrak!</p>
                    <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      Redirecionando para o aplicativo...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="rounded-xl border-gray-300 h-12 text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

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
                  disabled={loading}
                />
              </div>

              {selectedMode === "paciente" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm mb-3">
                    📋 Para usar o MediTrak como paciente, você precisa estar vinculado a um médico ou cuidador.
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="cuidadorEmail" className="text-gray-700">
                        Email do seu Médico/Cuidador *
                      </Label>
                      <Input
                        id="cuidadorEmail"
                        type="email"
                        placeholder="medico@email.com"
                        className="rounded-xl border-gray-300 h-12 text-base bg-white"
                        value={cuidadorEmail}
                        onChange={(e) => setCuidadorEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Seu médico/cuidador já deve ter uma conta no sistema
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-gray-700">
                        CPF (opcional)
                      </Label>
                      <Input
                        id="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        className="rounded-xl border-gray-300 h-12 text-base bg-white"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthdate" className="text-gray-700">
                        Data de Nascimento (opcional)
                      </Label>
                      <Input
                        id="birthdate"
                        type="date"
                        className="rounded-xl border-gray-300 h-12 text-base bg-white"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="rounded-xl border-gray-300 h-12 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirmar senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  className="rounded-xl border-gray-300 h-12 text-base"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className={`w-full ${config.buttonColor} text-white rounded-xl h-12 text-base shadow-lg mt-6`}
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate("login", selectedMode)}
                  className="text-[#1e3a8a] hover:underline"
                  disabled={loading}
                >
                  Já tem conta? Faça login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}