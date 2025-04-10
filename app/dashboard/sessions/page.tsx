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
        <h2 className="text-2xl font-bold">Training Catalog</h2>
      </div>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="domains">Domains & Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog">
          <FormationsTable />
        </TabsContent>

        <TabsContent value="domains">
          <DomainsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}