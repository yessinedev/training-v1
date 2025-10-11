"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/mock-data";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
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
  // Types
  type AttendanceRate = {
    action_id: number;
    title: string;
    attendance_rate: number;
  };
  type DropoutRate = { title: string; dropout_rate: number };
  type Absentee = { participant_id: number; name: string; absences: number };
  type TrainerPerformance = {
    formateur_id: number;
    name: string;
    trainingsCount: number;
    rating: number;
    revenue: number;
  };
  type CertificationStats = {
    rate: number;
    certificatesIssued: number;
    totalParticipants: number;
  };
  type CertificationEfficiency = { name: string; value: number };

  // Fetchers
  const fetchAttendanceRates = async (): Promise<AttendanceRate[]> => {
    const { data } = await axios.get("/analytics/attendance/rates");
    return data;
  };
  const fetchDropoutRates = async (): Promise<DropoutRate[]> => {
    const { data } = await axios.get("/analytics/training/dropout-rates");
    return data;
  };
  const fetchTopPunctual = async (): Promise<DropoutRate[]> => {
    const { data } = await axios.get("/analytics/attendance/top-punctual");
    return data;
  };
  const fetchFrequentAbsentees = async (): Promise<Absentee[]> => {
    const { data } = await axios.get(
      "/analytics/attendance/frequent-absentees?limit=10"
    );
    return data;
  };
  const fetchTrainerPerformance = async (): Promise<TrainerPerformance[]> => {
    const { data } = await axios.get("/analytics/trainer/performance");
    return data;
  };
  const fetchCertificationStats = async (): Promise<CertificationStats> => {
    const { data } = await axios.get("/analytics/certification/stats");
    return data;
  };
  const fetchCertificationEfficiency = async (): Promise<
    CertificationEfficiency[]
  > => {
    const { data } = await axios.get("/analytics/certification/efficiency");
    return data;
  };

  // Queries
  const { data: attendanceRates = [], isLoading: loadingAttendance } = useQuery(
    {
      queryKey: ["attendanceRates"],
      queryFn: fetchAttendanceRates,
    }
  );
  const { data: dropoutRates = [], isLoading: loadingDropout } = useQuery({
    queryKey: ["dropoutRates"],
    queryFn: fetchDropoutRates,
  });
  const { data: frequentAbsentees = [], isLoading: loadingAbsentees } =
    useQuery({
      queryKey: ["frequentAbsentees"],
      queryFn: fetchFrequentAbsentees,
    });
  const { data: trainerPerformance = [], isLoading: loadingTrainers } =
    useQuery({
      queryKey: ["trainerPerformance"],
      queryFn: fetchTrainerPerformance,
    });
  const { data: certificationStats, isLoading: loadingCertStats } = useQuery({
    queryKey: ["certificationStats"],
    queryFn: fetchCertificationStats,
  });
  const { data: certificationEfficiency = [], isLoading: loadingCertEff } =
    useQuery({
      queryKey: ["certificationEfficiency"],
      queryFn: fetchCertificationEfficiency,
    });

  // Data mapping
  const attendanceData = attendanceRates.map((item: AttendanceRate) => ({
    name: `Formation #${item.action_id} (${item.title})`,
    value: item.attendance_rate * 100,
  }));

  const dropoutData = dropoutRates.map((item: DropoutRate) => ({
    name: item.title,
    value: item.dropout_rate * 100,
  }));

  // const certData = certificationEfficiency.map((item: CertificationEfficiency) => ({
  //   name: item.name,
  //   value: item.value,
  // }));

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
                {loadingAttendance ? (
                  <div className="h-80 flex items-center justify-center">
                    Chargement...
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(value) => [
                            `${value}%`,
                            "Taux de présence",
                          ]}
                        />
                        <Bar dataKey="value" fill="#8884d8" radius={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
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
                {loadingDropout ? (
                  <div className="h-80 flex items-center justify-center">
                    Chargement...
                  </div>
                ) : (
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
                )}
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
              {loadingAbsentees ? (
                <div className="h-20 flex items-center justify-center">
                  Chargement...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead className="text-right">
                        {" Nombre dAbsences"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {frequentAbsentees
                      .filter((absentee) => absentee.absences > 0)
                      .map((absentee) => (
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
              )}
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
              {loadingTrainers ? (
                <div className="h-20 flex items-center justify-center">
                  Chargement...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formateur</TableHead>
                      <TableHead>Formations</TableHead>
                      <TableHead className="text-right">
                        Revenu Généré
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainerPerformance.map((trainer: TrainerPerformance) => (
                      <TableRow key={trainer.formateur_id}>
                        <TableCell className="font-medium">
                          {trainer.name}
                        </TableCell>
                        <TableCell>{trainer.trainingsCount}</TableCell>

                        <TableCell className="text-right">
                          {formatCurrency(trainer.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
                {loadingCertStats ? (
                  <div className="h-20 flex items-center justify-center">
                    Chargement...
                  </div>
                ) : certificationStats ? (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold">
                        {formatPercentage(certificationStats.rate)}
                      </div>
                      <p className="text-muted-foreground">
                        Taux de certification
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">
                          {certificationStats.certificatesIssued}
                        </div>
                        <p className="text-muted-foreground">Certifiés</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">
                          {certificationStats.totalParticipants}
                        </div>
                        <p className="text-muted-foreground">
                          Participants Total
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-20 flex items-center justify-center">
                    Aucune donnée
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Répartition des Certifications</CardTitle>
                <CardDescription>
                  Participants certifiés vs non certifiés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCertEff ? (
                  <div className="h-80 flex items-center justify-center">Chargement...</div>
                ) : certData.length > 0 ? (
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
                ) : (
                  <div className="h-80 flex items-center justify-center">Aucune donnée</div>
                )}
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
