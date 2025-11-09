import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Patient } from "../../App";
import { X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AddPacienteModalProps {
  onAdd: (patient: Omit<Patient, "id" | "adherence">) => void;
  onClose: () => void;
}

export function AddPacienteModal({ onAdd, onClose }: AddPacienteModalProps) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, cpf, birthdate });
    toast.success("Paciente adicionado com sucesso!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in duration-200 rounded-t-2xl sm:rounded-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1e3a8a] text-xl">Adicionar Paciente</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Nome do Paciente
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Ana Silva"
                className="rounded-lg border-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-gray-700">
                CPF
              </Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                className="rounded-lg border-gray-300"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-gray-700">
                Data de Nascimento
              </Label>
              <Input
                id="birthdate"
                type="date"
                className="rounded-lg border-gray-300"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-300 rounded-lg py-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg py-6"
              >
                Confirmar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
