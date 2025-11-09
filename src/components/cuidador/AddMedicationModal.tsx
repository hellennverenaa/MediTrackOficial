import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Medication } from "../../App";
import { X, Plus, Minus } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AddMedicationModalProps {
  onAdd: (medication: Omit<Medication, "id" | "patientId">) => void;
  onClose: () => void;
}

export function AddMedicationModal({ onAdd, onClose }: AddMedicationModalProps) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequencyType, setFrequencyType] = useState<"interval" | "specific">("interval");
  
  // Para modo "interval"
  const [interval, setInterval] = useState(8);
  const [startTime, setStartTime] = useState("06:00");
  
  // Para modo "specific"
  const [timesPerDay, setTimesPerDay] = useState(3);
  const [specificTimes, setSpecificTimes] = useState(["06:00", "14:00", "22:00"]);
  
  const [alarmEnabled, setAlarmEnabled] = useState(true);

  const handleTimesPerDayChange = (newCount: number) => {
    if (newCount < 1 || newCount > 10) return;
    
    setTimesPerDay(newCount);
    
    // Ajustar array de horários
    if (newCount > specificTimes.length) {
      // Adicionar novos horários
      const newTimes = [...specificTimes];
      while (newTimes.length < newCount) {
        newTimes.push("12:00");
      }
      setSpecificTimes(newTimes);
    } else {
      // Remover horários extras
      setSpecificTimes(specificTimes.slice(0, newCount));
    }
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...specificTimes];
    newTimes[index] = value;
    setSpecificTimes(newTimes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (frequencyType === "interval") {
      onAdd({
        name,
        dose,
        frequencyType: "interval",
        interval,
        startTime,
        alarmEnabled,
      });
    } else {
      onAdd({
        name,
        dose,
        frequencyType: "specific",
        timesPerDay,
        specificTimes,
        alarmEnabled,
      });
    }
    
    toast.success("Medicação adicionada com sucesso!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-md shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in duration-200 rounded-t-2xl sm:rounded-2xl my-auto">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1e3a8a] text-xl">Adicionar Medicação</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Medicamento */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Nome do Medicamento
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Dipirona"
                className="rounded-lg border-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Dose */}
            <div className="space-y-2">
              <Label htmlFor="dose" className="text-gray-700">
                Dose
              </Label>
              <Input
                id="dose"
                type="text"
                placeholder="Ex: 500 mg"
                className="rounded-lg border-gray-300"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                required
              />
            </div>

            {/* SEÇÃO CRÍTICA: Frequência */}
            <div className="space-y-4 border-t pt-4">
              <Label className="text-gray-700 text-base">Frequência</Label>
              
              {/* Seletor de Tipo (Segmentado) */}
              <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setFrequencyType("interval")}
                  className={`flex-1 py-3 rounded-md transition-all ${
                    frequencyType === "interval"
                      ? "bg-white text-[#1e3a8a] shadow"
                      : "text-gray-600"
                  }`}
                >
                  Intervalos
                </button>
                <button
                  type="button"
                  onClick={() => setFrequencyType("specific")}
                  className={`flex-1 py-3 rounded-md transition-all ${
                    frequencyType === "specific"
                      ? "bg-white text-[#1e3a8a] shadow"
                      : "text-gray-600"
                  }`}
                >
                  Horários Específicos
                </button>
              </div>

              {/* Opção 1: Intervalos */}
              {frequencyType === "interval" && (
                <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="interval" className="text-gray-700">
                      A cada (horas)
                    </Label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInterval(Math.max(1, interval - 1))}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <Input
                        id="interval"
                        type="number"
                        min="1"
                        max="24"
                        className="text-center rounded-lg border-gray-300 bg-white"
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setInterval(Math.min(24, interval + 1))}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-700 whitespace-nowrap">horas</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-gray-700">
                      Horário de início
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      className="rounded-lg border-gray-300 bg-white"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      O app calculará automaticamente os próximos horários
                    </p>
                  </div>
                </div>
              )}

              {/* Opção 2: Horários Específicos */}
              {frequencyType === "specific" && (
                <div className="space-y-4 bg-green-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="timesPerDay" className="text-gray-700">
                      Vezes ao dia
                    </Label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleTimesPerDayChange(timesPerDay - 1)}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <Input
                        id="timesPerDay"
                        type="number"
                        min="1"
                        max="10"
                        className="text-center rounded-lg border-gray-300 bg-white"
                        value={timesPerDay}
                        onChange={(e) => handleTimesPerDayChange(Number(e.target.value))}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleTimesPerDayChange(timesPerDay + 1)}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-700 whitespace-nowrap">vezes</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {specificTimes.map((time, index) => (
                      <div key={index} className="space-y-1">
                        <Label htmlFor={`time-${index}`} className="text-gray-700 text-sm">
                          Dose {index + 1}:
                        </Label>
                        <Input
                          id={`time-${index}`}
                          type="time"
                          className="rounded-lg border-gray-300 bg-white"
                          value={time}
                          onChange={(e) => handleTimeChange(index, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lembretes */}
            <div className="space-y-4 border-t pt-4">
              <Label className="text-gray-700 text-base">Lembretes</Label>
              
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="alarm" className="text-gray-700 cursor-pointer">
                    Avisar o paciente com alarme?
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Notificações push nos horários programados
                  </p>
                </div>
                <Switch
                  id="alarm"
                  checked={alarmEnabled}
                  onCheckedChange={setAlarmEnabled}
                />
              </div>
            </div>

            {/* Botões */}
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
                className="flex-1 bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-lg py-6"
              >
                Salvar Medicação
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
