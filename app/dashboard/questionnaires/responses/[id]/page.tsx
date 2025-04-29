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
    queryFn: () => fetchResponsesBySurveyId(surveyId),
    enabled: !!surveyId,
  });

  const isLoading = surveyLoading || responsesLoading;

  // Analytics calculations
  const totalResponses = responses.length;
  const anonymousResponses = responses.filter((r) => !r.participantId).length;
  const completionRate =
    totalResponses > 0
      ? Math.round((totalResponses / (survey?.questions?.length || 1)) * 100)
      : 0;

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Prepare chart data
  const prepareQuestionData = () => {
    if (!survey || !responses.length) return [];

    return survey.questions.map((question) => {
      const questionResponses = responses.flatMap((r) =>
        r.answers.filter((a) => a.questionId === question.id)
      );

      // For multiple choice questions, count occurrences of each option
      if (question.type === "multiple_choice" && question.options) {
        const counts = question.options.reduce<Record<string, number>>(
          (acc, opt) => {
            acc[opt] = questionResponses.filter(
              (r) => r.content.value === opt
            ).length;
            return acc;
          },
          {}
        );

        return {
          question: question.text,
          data: Object.entries(counts).map(([name, value]) => ({
            name,
            value: value as number,
          })),
        };
      }

      // For rating questions, calculate average
      if (question.type === "rating") {
        const ratings = questionResponses.map((r) => r.content.value);
        const average = ratings.length
          ? ratings.reduce((sum, val) => sum + val, 0) / ratings.length
          : 0;

        return {
          question: question.text,
          average: parseFloat(average.toFixed(1)),
          data: [1, 2, 3, 4, 5].map((rating) => ({
            name: `${rating} Star${rating !== 1 ? "s" : ""}`,
            value: ratings.filter((r) => r === rating).length,
          })),
        };
      }

      // For boolean questions
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
            { name: "Yes", value: yesCount },
            { name: "No", value: noCount },
          ],
        };
      }

      // For text questions, just return the count
      return {
        question: question.text,
        responseCount: questionResponses.length,
        responses: questionResponses.map((r) => r.content.value),
      };
    });
  };

  const questionData = prepareQuestionData();

  // Response trend data (by date)
  const responseTrend = (() => {
    if (!responses.length) return [];

    const dateMap: Record<string, number> = {};
    responses.forEach((response) => {
      const date = new Date(response.createdAt).toLocaleDateString();
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
    return <div className="container mx-auto py-8">Survey not found</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{survey.title}</h1>
          <p className="text-muted-foreground">{survey.description}</p>
        </div>
        <Badge variant={survey.status === "published" ? "default" : "outline"}>
          {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Responses
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalResponses}</div>
                <p className="text-xs text-muted-foreground">
                  {anonymousResponses} anonymous
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
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
                      ? "Good completion rate"
                      : "Low completion rate"}
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
                  {survey.questions.filter((q) => q.required).length} required
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Response Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Response Trend</CardTitle>
              <CardDescription>Number of responses over time</CardDescription>
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
                      formatter={(value) => [`${value} responses`, "Count"]}
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
                    No response data available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {questionData.map((qData, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{qData.question}</CardTitle>
                <CardDescription>
                  {qData.responseCount
                    ? `${qData.responseCount} responses`
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
                              labelLine={true}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {qData.data.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [
                                `${value} responses`,
                                "Count",
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
                                `${value} responses`,
                                "Count",
                              ]}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          No data available
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
                      No responses for this question
                    </p>
                  </div>
                )}

                {qData.average !== undefined && (
                  <div className="mt-4 flex items-center">
                    <span className="text-lg font-bold mr-2">
                      {qData.average}
                    </span>
                    <span className="text-muted-foreground">
                      average rating
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          {responses.length > 0 ? (
            responses.map((response) => (
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
                          Anonymous
                        </Badge>
                      )}
                      <div>
                        <CardTitle className="text-sm">
                          {response.participant?.user.prenom ||
                            "Anonymous User"}
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
                                ? "Yes"
                                : "No"
                              : answer.content.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-2">No responses yet</p>
                <p className="text-sm text-muted-foreground">
                  Responses will appear here once participants complete the
                  survey
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
