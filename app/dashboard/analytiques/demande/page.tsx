"use client"

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, TrendingUp } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { formatCurrency, formatDate } from "@/lib/mock-data"; // Keep your formatters

// API fetchers
const fetchMonthlyTrends = async () => {
  const { data } = await axiosInstance.get("analytics/demand/monthly");
  return data;
};
const fetchMostDemandedTrainings = async (limit = 10) => {
  const { data } = await axiosInstance.get(`analytics/demand/trainings?limit=${limit}`);
  return data;
};
const fetchTopDomainsThemes = async () => {
  const { data } = await axiosInstance.get("analytics/demand/domains-themes");
  return data;
};
// Revenue analytics fetchers
const fetchRevenuePerTraining = async () => {
  const { data } = await axiosInstance.get("analytics/revenue/trainings");
  return data;
};
const fetchRevenueByMonth = async () => {
  const { data } = await axiosInstance.get("analytics/revenue/monthly");
  return data;
};
const fetchRevenueByFormateur = async () => {
  const { data } = await axiosInstance.get("analytics/revenue/formateurs");
  return data;
};

export default function DemandePage() {
  // Queries
  const { data: monthlyTrends = [], isLoading: loadingMonthly } = useQuery({
    queryKey: ["monthlyTrends"],
    queryFn: fetchMonthlyTrends,
  });
  const { data: demandTrainings = [], isLoading: loadingDemand } = useQuery({
    queryKey: ["demandTrainings"],
    queryFn: () => fetchMostDemandedTrainings(10),
  });
  const { data: domainsThemes = [], isLoading: loadingDomains } = useQuery({
    queryKey: ["domainsThemes"],
    queryFn: fetchTopDomainsThemes,
  });
  // Revenue queries
  const { data: revenueTrainings = [], isLoading: loadingRevenueTrainings } = useQuery({
    queryKey: ["revenueTrainings"],
    queryFn: fetchRevenuePerTraining,
  });
  const { data: revenueMonthly = [], isLoading: loadingRevenueMonthly } = useQuery({
    queryKey: ["revenueMonthly"],
    queryFn: fetchRevenueByMonth,
  });
  const { data: revenueFormateurs = [], isLoading: loadingRevenueFormateurs } = useQuery({
    queryKey: ["revenueFormateurs"],
    queryFn: fetchRevenueByFormateur,
  });

  // Prepare chart/table data
  const monthlyData = monthlyTrends.map((item: any) => ({
    name: formatDate(item.month),
    value: item.trainings_count,
  }));

  const revenueMonthlyData = revenueMonthly.map((item: any) => ({
    name: formatDate(item.month),
    value: item.revenue,
  }));

  const domainsData = domainsThemes.map((item: any) => ({
    name: `${item.theme} (${item.domain})`,
    value: item.participants,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Trend calculation
  let trendText = "";
  let trendIcon;
  if (monthlyData.length >= 2) {
    const lastMonth = monthlyData[monthlyData.length - 1];
    const secondLastMonth = monthlyData[monthlyData.length - 2];

    if (secondLastMonth.value > 0) {
      const percentageChange = ((lastMonth.value - secondLastMonth.value) / secondLastMonth.value) * 100;
      if (percentageChange > 0) {
        trendText = `Tendance à la hausse de ${percentageChange.toFixed(1)}%`;
        trendIcon = <TrendingUp className="h-4 w-4" color="green" />;
      } else if (percentageChange < 0) {
        trendText = `Tendance à la baisse de ${Math.abs(percentageChange).toFixed(1)}%`;
        trendIcon = <TrendingDown className="h-6 w-6" color="red" />;
      } else {
        trendText = "Aucun changement ce mois-ci";
      }
    } else if (lastMonth.value > 0) {
      trendText = "Augmentation par rapport à zéro le mois précédent";
    } else {
      trendText = "Données insuffisantes pour calculer la tendance";
    }
  } else {
    trendText = "Données insuffisantes pour calculer la tendance";
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Demande et Revenus</h1>

      <Tabs defaultValue="demand">
        <TabsList className="mb-4">
          <TabsTrigger value="demand">Demande de Formation</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tendances Mensuelles</CardTitle>
                <CardDescription>Nombre de formations par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loadingMonthly ? (
                    <div>Chargement...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {trendText && <p className="flex items-center gap-2 font-medium leading-none">{trendText} {trendIcon && trendIcon}</p>}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domaines et Thèmes Populaires</CardTitle>
                <CardDescription>Répartition des participants par thème</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loadingDomains ? (
                    <div>Chargement...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={domainsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={(props) => {
                            const { name, percent, x, y } = props;
                            return (
                              <text
                                x={x - 55}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fontSize: 12,
                                  maxWidth: 90,
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-line",
                                  fill: "#333",
                                }}
                              >
                                {`${name}: ${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                          }}
                        >
                          {domainsData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Formations les Plus Demandées</CardTitle>
              <CardDescription>Classement par nombre de participants</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Formation</TableHead>
                    <TableHead>Thème</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead className="text-right">Prix Unitaire</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDemand ? (
                    <TableRow>
                      <TableCell colSpan={6}>Chargement...</TableCell>
                    </TableRow>
                  ) : (
                    demandTrainings.map((training: any) => (
                      <TableRow key={training.action_id}>
                        <TableCell className="font-medium">Action #{training.action_id}</TableCell>
                        <TableCell>{training.theme.libelle_theme}</TableCell>
                        <TableCell>{training.type_action}</TableCell>
                        <TableCell>{training.lieu}</TableCell>
                        <TableCell>
                          {training._count.participants}/{training.nb_participants_prevu}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(training.prix_unitaire)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenu Mensuel</CardTitle>
                <CardDescription>Revenu total par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loadingRevenueMonthly ? (
                    <div>Chargement...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueMonthlyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={formatCurrency} />
                        <Bar dataKey="value" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenu par Formateur</CardTitle>
                <CardDescription>Classement des formateurs par revenu généré</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formateur</TableHead>
                      <TableHead className="text-right">Revenu Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingRevenueFormateurs ? (
                      <TableRow>
                        <TableCell colSpan={3}>Chargement...</TableCell>
                      </TableRow>
                    ) : (
                      revenueFormateurs.map((formateur: any) => (
                        <TableRow key={formateur.formateur_id}>
                          <TableCell>
                            {formateur.name}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(formateur.revenue)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenu par Formation</CardTitle>
              <CardDescription>Classement des formations par revenu généré</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Formation</TableHead>
                    <TableHead>Thème</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead className="text-right">Revenu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingRevenueTrainings ? (
                    <TableRow>
                      <TableCell colSpan={6}>Chargement...</TableCell>
                    </TableRow>
                  ) : (
                    revenueTrainings.map((training: any) => (
                      <TableRow key={training.action_id}>
                        <TableCell className="font-medium">Action #{training.action_id}</TableCell>
                        <TableCell>{training.title}</TableCell>
                        <TableCell>{training.type_action}</TableCell>
                        <TableCell>{training.lieu}</TableCell>
                        <TableCell>
                          {training.participants}/{training.nb_participants_prevu}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(training.revenue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
