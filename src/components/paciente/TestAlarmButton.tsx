import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Bell, X, Plus } from "lucide-react";
import { Medication, MedicationLog } from "../../App";

interface TestAlarmButtonProps {
  onAddTestMedication: (minutesFromNow: number) => void;
}

export function TestAlarmButton({ onAddTestMedication }: TestAlarmButtonProps) {
  const [showPanel, setShowPanel] = useState(false);

  const testOptions = [
    { label: "Daqui 1 minuto", minutes: 1 },
    { label: "Daqui 2 minutos", minutes: 2 },
    { label: "Daqui 5 minutos", minutes: 5 },
  ];

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-24 left-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40"
        title="Testar Alarmes"
      >
        <Bell className="w-6 h-6" />
      </button>

      {/* Panel de Teste */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[#1e3a8a] text-xl mb-1">🧪 Teste de Alarmes</h3>
                  <p className="text-gray-600 text-sm">
                    Adicione uma medicação de teste com alarme programado
                  </p>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  ⚠️ <strong>Atenção:</strong> Isso criará uma medicação de teste que disparará um alarme
                  no tempo selecionado. Certifique-se de permitir notificações no navegador!
                </div>

                {testOptions.map((option) => (
                  <Button
                    key={option.minutes}
                    onClick={() => {
                      onAddTestMedication(option.minutes);
                      setShowPanel(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-6 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {option.label}
                  </Button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm mb-2">
                  <strong>Como funciona:</strong>
                </p>
                <ol className="text-blue-700 text-xs space-y-1 list-decimal list-inside">
                  <li>Selecione um tempo acima</li>
                  <li>Uma medicação "Teste de Alarme" será criada</li>
                  <li>No horário programado, você receberá:
                    <ul className="ml-6 mt-1 space-y-1">
                      <li>• Toast notification na tela</li>
                      <li>• Notificação do navegador (se permitido)</li>
                    </ul>
                  </li>
                  <li>Você pode confirmar a tomada diretamente</li>
                </ol>
              </div>

              <Button
                onClick={() => setShowPanel(false)}
                variant="outline"
                className="w-full mt-4 border-gray-300 rounded-lg"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
