'use client';

import DomainsTable from "@/components/domains/domains-table";
import FormationsTable from "@/components/formations/formations-table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function FormationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sessions de formations</h2>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="domaines">Domaines & Thèmes</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <FormationsTable />
        </TabsContent>

        <TabsContent value="domaines">
          <DomainsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}