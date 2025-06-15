"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage, mockData } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function PerformancePage() {
  const attendanceData = mockData.attendanceRates.map((item) => ({
    name: `Formation #${item.action_id} (${item.title})`,
    value: item.attendance_rate * 100,
  }));

  const dropoutData = mockData.dropoutRates.map((item) => ({
    name: item.title,
    value: item.dropout_rate * 100,
  }));

  const certData = [
    {
      name: "Certifiés",
      value: mockData.certificationStats.certificatesIssued,
    },
    {
      name: "Non Certifiés",
      value:
        mockData.certificationStats.totalParticipants -
        mockData.certificationStats.certificatesIssued,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Performance</h1>

      <Tabs defaultValue="attendance">
        <TabsList className="mb-4">
          <TabsTrigger value="attendance">Présence</TabsTrigger>
          <TabsTrigger value="trainers">Formateurs</TabsTrigger>
          <TabsTrigger value="certification">Certification</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taux de Présence par Formation</CardTitle>
                <CardDescription>
                  Pourcentage de présence pour chaque formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Taux de présence"]}
                      />
                      <Bar dataKey="value" fill="#8884d8" radius={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{"Taux d'Abandon"}</CardTitle>
                <CardDescription>
                  {"Pourcentage d'abandon pour chaque formation: "}
                  Participation Prévu vs Participation Réelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dropoutData}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Taux d'abandon"]}
                      />
                      <Bar dataKey="value" fill="#FF8042" radius={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Participants Fréquemment Absents</CardTitle>
              <CardDescription>
                {"Liste des participants avec le plus d'absences"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead className="text-right">
                     {" Nombre d'Absences"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.frequentAbsentees.map((absentee) => (
                    <TableRow key={absentee.participant_id}>
                      <TableCell className="font-medium">
                        {absentee.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {absentee.absences}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance des Formateurs</CardTitle>
              <CardDescription>
                Évaluation globale des formateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Formateur</TableHead>
                    <TableHead>Formations</TableHead>
                    <TableHead>Évaluation</TableHead>
                    <TableHead className="text-right">Revenu Généré</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.trainerPerformance.map((trainer) => (
                    <TableRow key={trainer.formateur_id}>
                      <TableCell className="font-medium">
                        {trainer.name}
                      </TableCell>
                      <TableCell>{trainer.trainingsCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={trainer.rating * 20}
                            className="w-24"
                          />
                          <span>{trainer.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(trainer.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certification" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de Certification</CardTitle>
                <CardDescription>
                  Taux de réussite aux certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold">
                    {formatPercentage(mockData.certificationStats.rate)}
                  </div>
                  <p className="text-muted-foreground">Taux de certification</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {mockData.certificationStats.certificatesIssued}
                    </div>
                    <p className="text-muted-foreground">Certifiés</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {mockData.certificationStats.totalParticipants}
                    </div>
                    <p className="text-muted-foreground">Participants Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Certifications</CardTitle>
                <CardDescription>
                  Participants certifiés vs non certifiés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={certData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        strokeWidth={10}
                        labelLine={false}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {certData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
