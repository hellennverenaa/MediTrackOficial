import { Card } from "../ui/card";
import { Patient, Medication, MedicationLog } from "../../App";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TrendingUp } from "lucide-react";

interface AdesaoTabProps {
  patient: Patient;
  medications: Medication[];
  medicationLogs: MedicationLog[];
}

export function AdesaoTab({ patient, medications, medicationLogs }: AdesaoTabProps) {
  // Dados do gráfico (últimos 7 dias)
  const chartData = [
    { day: "Seg", tomado: 4, perdido: 0 },
    { day: "Ter", tomado: 4, perdido: 0 },
    { day: "Qua", tomado: 3, perdido: 1 },
    { day: "Qui", tomado: 4, perdido: 0 },
    { day: "Sex", tomado: 4, perdido: 0 },
    { day: "Sáb", tomado: 2, perdido: 2 },
    { day: "Dom", tomado: 4, perdido: 0 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.tomado + d.perdido));

  return (
    <div className="space-y-6 pb-6">
      {/* Taxa de Adesão Geral */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#14b8a6]" />
            <h3 className="text-[#1e3a8a]">Taxa de Adesão Geral</h3>
          </div>
          
          <div className="text-center py-6">
            <div className="text-5xl text-[#14b8a6] mb-2">{patient.adherence}%</div>
            <p className="text-gray-600">Últimos 7 dias</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#14b8a6] to-[#00bcd4] h-full rounded-full transition-all"
              style={{ width: `${patient.adherence}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Gráfico de Barras Customizado */}
      <Card className="shadow-lg">
        <div className="p-6">
          <h3 className="text-[#1e3a8a] mb-4">Adesão nos Últimos 7 Dias</h3>
          
          <div className="space-y-4">
            {chartData.map((data, index) => {
              const tomadoPercent = (data.tomado / maxValue) * 100;
              const perdidoPercent = (data.perdido / maxValue) * 100;
              const total = data.tomado + data.perdido;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600">{data.day}</div>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden h-8 flex">
                      {data.tomado > 0 && (
                        <div
                          className="bg-[#14b8a6] flex items-center justify-center text-white text-xs"
                          style={{ width: `${tomadoPercent}%` }}
                        >
                          {data.tomado > 0 && <span>{data.tomado}</span>}
                        </div>
                      )}
                      {data.perdido > 0 && (
                        <div
                          className="bg-[#ef4444] flex items-center justify-center text-white text-xs"
                          style={{ width: `${perdidoPercent}%` }}
                        >
                          {data.perdido > 0 && <span>{data.perdido}</span>}
                        </div>
                      )}
                    </div>
                    <div className="w-10 text-sm text-gray-600 text-right">{total}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
              <span className="text-sm text-gray-600">Tomado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
              <span className="text-sm text-gray-600">Perdido</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabela de Detalhes por Medicamento */}
      <Card className="shadow-lg">
        <div className="p-6">
          <h3 className="text-[#1e3a8a] mb-4">Detalhe por Medicação</h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicamento</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead className="text-center">Tomados</TableHead>
                  <TableHead className="text-center">Adesão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Nenhuma medicação cadastrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  medications.map((med) => {
                    // Calcular adesão mock para cada medicamento
                    const mockTaken = Math.floor(Math.random() * 21) + 10; // 10-30
                    const mockTotal = 30;
                    const adherence = Math.round((mockTaken / mockTotal) * 100);
                    
                    return (
                      <TableRow key={med.id}>
                        <TableCell className="text-gray-800">{med.name}</TableCell>
                        <TableCell className="text-gray-600">{med.dose}</TableCell>
                        <TableCell className="text-center text-gray-800">
                          {mockTaken}/{mockTotal}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            adherence >= 80 
                              ? "bg-green-100 text-green-700"
                              : adherence >= 70
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {adherence}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
