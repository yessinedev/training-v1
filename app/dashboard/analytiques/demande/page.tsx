"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate, mockData } from "@/lib/mock-data"
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
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingDown, TrendingUp } from "lucide-react"

export default function DemandePage() {
  const monthlyData = mockData.monthlyTrends.map((item) => ({
    name: formatDate(item.month),
    value: item.trainings_count,
  }))

  const revenueMonthly = mockData.revenueMonthly.map((item) => ({
    name: formatDate(item.month),
    value: item.revenue,
  }))

  const domainsData = mockData.domainsThemes.map((item) => ({
    name: `${item.theme} (${item.domain})`,
    value: item.participants,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  let trendText = "";
  let trendIcon;
  if (monthlyData.length >= 2) {
    const lastMonth = monthlyData[monthlyData.length - 1];
    const secondLastMonth = monthlyData[monthlyData.length - 2];

    if (secondLastMonth.value > 0) {
      const percentageChange = ((lastMonth.value - secondLastMonth.value) / secondLastMonth.value) * 100;
      if (percentageChange > 0) {
        trendText = `Tendance à la hausse de ${percentageChange.toFixed(1)}%`;
        trendIcon = <TrendingUp className="h-4 w-4" color="green" />
      } else if (percentageChange < 0) {
        trendText = `Tendance à la baisse de ${Math.abs(percentageChange).toFixed(1)}%`;
        trendIcon = <TrendingDown className="h-6 w-6" color="red" />
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
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {domainsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
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
                  {mockData.demandTrainings.map((training) => (
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenus Mensuels</CardTitle>
                <CardDescription>Évolution des revenus par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueMonthly}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenu"]} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenus par Formation</CardTitle>
                <CardDescription>Classement des formations par revenu généré</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={mockData.revenueTrainings}>
                      <XAxis type="number" />
                      <YAxis dataKey="title" type="category" />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenu"]} />
                      <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenus par Formateur</CardTitle>
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
                  {mockData.revenueFormateurs.map((formateur) => (
                    <TableRow key={formateur.formateur_id}>
                      <TableCell className="font-medium">{formateur.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(formateur.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
