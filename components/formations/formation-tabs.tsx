import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Formation,
} from "@/types";
import AttestationsTable from "../attestations/AttestationsTable";
import ActionFormationFormateursTable from "../formateurs/ActionFormationFormateursTable";
import ActionForParticipants from "../participants/ActionForParticipants";

type FormationTabsProps = {
  formation: Formation;
};

export default function FormationTabs({ formation }: FormationTabsProps) {
  return (
    <Tabs defaultValue="participants" className="space-y-4">
      <TabsList>
        <TabsTrigger value="participants">Participants</TabsTrigger>
        <TabsTrigger value="trainers">Formateurs</TabsTrigger>
        <TabsTrigger value="certifications">Attestations</TabsTrigger>
      </TabsList>

      <TabsContent value="participants">
        <ActionForParticipants actionId={formation.action_id} />
      </TabsContent>

      <TabsContent value="trainers">
        <ActionFormationFormateursTable actionId={formation.action_id} />
      </TabsContent>

      <TabsContent value="certifications">
        <AttestationsTable actionId={formation.action_id} />
      </TabsContent>
    </Tabs>
  );
}
