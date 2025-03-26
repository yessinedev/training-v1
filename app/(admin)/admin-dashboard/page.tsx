'use client';

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Users,
  UserCog,
  GraduationCap,
  Award,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axiosInstance from "@/lib/axios";
import { Formation, Participant } from "@/types";

// Chart colors from our theme
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface MonthlyFormations {
  [key: string]: number;
}

export default function DashboardPage() {
  const { data: formations } = useQuery({
    queryKey: ["formations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/formations");
      return response.data;
    },
  });

  const { data: participants } = useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      const response = await axiosInstance.get("/participants");
      return response.data;
    },
  });

  const { data: formateurs } = useQuery({
    queryKey: ["formateurs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/formateurs");
      return response.data;
    },
  });

  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await axiosInstance.get("/themes");
      return response.data;
    },
  });

  // Calculate statistics
  const totalFormations = formations?.length || 0;
  const totalParticipants = participants?.length || 0;
  const totalFormateurs = formateurs?.length || 0;
  const totalThemes = themes?.length || 0;

  const upcomingFormations = formations?.filter(
    (f: Formation) => new Date(f.date_debut) > new Date()
  ).length || 0;

  const completedFormations = formations?.filter(
    (f: Formation) => new Date(f.date_fin) < new Date()
  ).length || 0;

  // Prepare data for charts
  const participantStatusData = [
    { name: 'Confirmed', value: participants?.filter((p: Participant) => p.actions?.some(a => a.statut === 'Confirmé')).length || 0 },
    { name: 'Pending', value: participants?.filter((p: Participant) => p.actions?.some(a => a.statut === 'En attente')).length || 0 },
    { name: 'Waitlist', value: participants?.filter((p: Participant) => p.actions?.some(a => a.statut === "Liste d'attente")).length || 0 },
  ];

  
  
  const monthlyFormations = formations?.reduce((acc: MonthlyFormations, formation: Formation) => {
    const month = format(new Date(formation.date_debut), 'MMM');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as MonthlyFormations);
  

  const monthlyData = Object.entries(monthlyFormations || {}).map(([month, count]) => ({
    month,
    formations: count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Formations
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFormations}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingFormations} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Participants
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
              <p className="text-xs text-muted-foreground">
                Active in training sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Formateurs
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFormateurs}</div>
              <p className="text-xs text-muted-foreground">
                Qualified trainers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Training Themes
              </CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalThemes}</div>
              <p className="text-xs text-muted-foreground">
                Available courses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Formations</CardTitle>
            <CardDescription>
              Number of training sessions per month
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="formations" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Participant Status</CardTitle>
            <CardDescription>
              Distribution of participant statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participantStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {participantStatusData.map((entry, index) => (
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Training Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">In Progress:</span>
                <span className="font-bold">
                  {totalFormations - completedFormations - upcomingFormations}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upcoming:</span>
                <span className="font-bold">{upcomingFormations}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Completed:</span>
                <span className="font-bold">{completedFormations}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Certification Status
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Issued:</span>
                <span className="font-bold">
                  {participants?.filter((p: Participant) => (p.attestations?.length ?? 0) > 0).length || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Pending:</span>
                <span className="font-bold">
                  {participants?.filter((p: Participant) => 
                    p.actions?.some(a => a.statut === 'Confirmé') && 
                    !p.attestations?.length
                  ).length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formations?.slice(0, 3).map((formation: Formation) => (
                <div key={formation.action_id} className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {formation.type_action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(formation.date_debut), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formation.participants?.length || 0} participants
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}