"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchSurveyById } from "@/services/surveyService";
import { fetchResponsesBySurveyId } from "@/services/responseService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3Icon,
  PieChartIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SurveyResponsesPage() {
  const params = useParams();
  const surveyId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview"); 

  const { data: survey, isLoading: surveyLoading } = useQuery({
    queryKey: ["survey", surveyId], 
    queryFn: () => fetchSurveyById(surveyId),
  });

  const { data: responses = [], isLoading: responsesLoading } = useQuery({
    queryKey: ["responses", surveyId], 
    queryFn: () => fetchResponsesBySurveyId(surveyId), // Fonction pour récupérer les réponses par ID de sondage
    enabled: !!surveyId, // Activé seulement si surveyId existe
  });

  const isLoading = surveyLoading || responsesLoading; // Indicateur de chargement global

  // Calculs analytiques
  const totalResponses = responses.length; // Nombre total de réponses
  const anonymousResponses = responses.filter((r) => !r.participantId).length; // Nombre de réponses anonymes
  const completionRate =
    totalResponses > 0
      ? Math.round((totalResponses / (survey?.questions?.length || 1)) * 100) // Taux de complétion en pourcentage
      : 0;

  // Couleurs pour les graphiques
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Préparation des données pour les graphiques
  const prepareQuestionData = () => {
    if (!survey || !responses.length) return []; // Retourne un tableau vide si pas de sondage ou de réponses

    return survey.questions.map((question) => {
      const questionResponses = responses.flatMap((r) =>
        r.answers.filter((a) => a.questionId === question.id)
      );

      // Pour les questions à choix multiples, compter les occurrences de chaque option
      if (question.type === "multiple_choice" && question.options) {
        const options: string[] = Array.isArray(question.options)
          ? question.options
          : JSON.parse(question.options);
        const counts = options.reduce<Record<string, number>>((acc, opt) => {
          acc[opt] = questionResponses.filter(
            (r) => r.content.value === opt
          ).length;
          return acc;
        }, {});

        return {
          question: question.text,
          data: Object.entries(counts).map(([name, value]) => ({
            name,
            value: value as number,
          })),
        };
      }

      // Pour les questions d'évaluation, calculer la moyenne
      if (question.type === "rating") {
        const ratings = questionResponses.map((r) => r.content.value as number);
        const average = ratings.length
          ? ratings.reduce((sum, val) => sum + val, 0) / ratings.length
          : 0;

        return {
          question: question.text,
          average: parseFloat(average.toFixed(1)),
          data: [1, 2, 3, 4, 5].map((rating) => ({
            name: `${rating} Étoile${rating !== 1 ? "s" : ""}`, // Nom de l'option (ex: "5 Étoiles")
            value: ratings.filter((r) => r === rating).length,
          })),
        };
      }

      // Pour les questions booléennes
      if (question.type === "boolean") {
        const yesCount = questionResponses.filter(
          (r) => r.content.value === true
        ).length;
        const noCount = questionResponses.filter(
          (r) => r.content.value === false
        ).length;

        return {
          question: question.text,
          data: [
            { name: "Oui", value: yesCount }, // Nombre de "Oui"
            { name: "Non", value: noCount }, // Nombre de "Non"
          ],
        };
      }

      // Pour les questions textuelles, retourner simplement le nombre de réponses
      return {
        question: question.text,
        responseCount: questionResponses.length,
        responses: questionResponses.map((r) => r.content.value as string),
      };
    });
  };

  const questionData = prepareQuestionData(); // Données préparées pour les questions

  // Données de tendance des réponses (par date)
  const responseTrend = (() => {
    if (!responses.length) return []; // Retourne un tableau vide si pas de réponses

    const dateMap: Record<string, number> = {};
    responses.forEach((response) => {
      const date = new Date(response.createdAt).toLocaleDateString(); // Formatte la date
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return Object.entries(dateMap).map(([date, count]) => ({
      date,
      count,
    }));
  })();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!survey) {
    return <div className="container mx-auto py-8">Sondage non trouvé</div>; // Message si sondage non trouvé
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{survey.title}</h1>
          <p className="text-muted-foreground">{survey.description}</p>
        </div>
        <Badge variant={survey.status === "publié" ? "default" : "outline"}>
          {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)} 
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Aperçu</TabsTrigger> 
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="responses">Réponses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6"> 
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Réponses Totales
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalResponses}</div>
                <p className="text-xs text-muted-foreground">
                  {anonymousResponses} anonymes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Taux de Complétion
                </CardTitle>
                <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <div className="flex items-center pt-1">
                  {completionRate > 50 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {completionRate > 50
                      ? "Bon taux de complétion"
                      : "Faible taux de complétion"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Questions</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {survey.questions.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {survey.questions.filter((q) => q.required).length} requises
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphique de tendance des réponses */}
          <Card>
            <CardHeader>
              <CardTitle>Tendance des Réponses</CardTitle>
              <CardDescription>Nombre de réponses au fil du temps</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {responseTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={responseTrend}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} réponses`, "Nombre"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    Aucune donnée de réponse disponible
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questionData.map((qData, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{qData.question}</CardTitle>
                  <CardDescription>
                    {qData.responseCount
                      ? `${qData.responseCount} réponses`
                      : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {qData.data ? (
                    <div className="h-[300px]">
                      {qData.data.length > 0 ? (
                        qData.data.length <= 3 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={qData.data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {qData.data.map((entry, cellIndex) => (
                                  <Cell
                                    key={`cell-${cellIndex}`}
                                    fill={COLORS[cellIndex % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) => [
                                  `${value} réponses`,
                                  "Nombre",
                                ]}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={qData.data}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                              
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip
                                formatter={(value) => [
                                  `${value} réponses`,
                                  "Nombre",
                                ]}
                              />
                              <Legend />
                              <Bar dataKey="value" fill="#8884d8" radius={8} />
                            </BarChart>
                          </ResponsiveContainer>
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-muted-foreground">
                            Aucune donnée disponible
                          </p>
                        </div>
                      )}
                    </div>
                  ) : qData.responses ? (
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      {qData.responses.map((response, idx) => (
                        <div
                          key={idx}
                          className="mb-2 pb-2 border-b last:border-0"
                        >
                          <p className="text-sm">{response}</p>
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center">
                      <p className="text-muted-foreground">
                        Aucune réponse pour cette question
                      </p>
                    </div>
                  )}

                  {qData.average !== undefined && (
                    <div className="mt-4 flex items-center">
                      <span className="text-lg font-bold mr-2">
                        {qData.average}
                      </span>
                      <span className="text-muted-foreground">
                        note moyenne
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          {responses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {responses.map((response) => (
                <Card key={response.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {response.participantId ? (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>
                              {response.participant?.user.prenom?.charAt(0) ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Badge variant="outline" className="mr-2">
                            Anonyme
                          </Badge>
                        )}
                        <div>
                          <CardTitle className="text-sm">
                            {response.participant?.user.prenom ||
                              "Utilisateur anonyme"}
                          </CardTitle>
                          <CardDescription>
                            {formatDistanceToNow(new Date(response.createdAt), {
                              addSuffix: true,
                            })}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {response.answers.map((answer) => {
                        const question = survey.questions.find(
                          (q) => q.id === answer.questionId
                        );
                        return (
                          <div
                            key={answer.id}
                            className="border-b pb-2 last:border-0"
                          >
                            <p className="text-sm font-medium">
                              {question?.text}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {typeof answer.content.value === "boolean"
                                ? answer.content.value
                                  ? "Oui"
                                  : "Non"
                                : answer.content.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-2">Aucune réponse pour le moment</p>
                <p className="text-sm text-muted-foreground">
                  Les réponses apparaîtront ici une fois que les participants auront complété le sondage
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
