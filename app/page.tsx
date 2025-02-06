import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">TrainingManager</span>
          </div>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Training Management{' '}
              <span className="text-primary">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {"Streamline your training operations with our comprehensive management platform. From course scheduling to participant tracking, we've gotyou covered."}
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-4 text-primary" />
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>
                    Easily create and manage training sessions, workshops, and
                    seminars.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Schedule training sessions</li>
                    <li>Track attendance</li>
                    <li>Manage resources</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 mb-4 text-primary" />
                  <CardTitle>Participant Tracking</CardTitle>
                  <CardDescription>
                    Keep track of all participants and their progress throughout
                    training.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Registration management</li>
                    <li>Attendance tracking</li>
                    <li>Progress monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-8 w-8 mb-4 text-primary" />
                  <CardTitle>Certification</CardTitle>
                  <CardDescription>
                    Generate and manage certificates for completed training
                    sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Automatic generation</li>
                    <li>Digital certificates</li>
                    <li>Certificate tracking</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart className="h-8 w-8 mb-4 text-primary" />
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Get insights into your training programs with detailed
                    analytics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Performance metrics</li>
                    <li>Attendance reports</li>
                    <li>Success tracking</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Training Management?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join us and experience a more efficient way to manage your training
              programs.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard" className="gap-2">
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold">TrainingManager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TrainingManager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}