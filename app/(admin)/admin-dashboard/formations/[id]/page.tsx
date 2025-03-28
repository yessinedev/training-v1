'use client';

import { useParams } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Formation } from "@/types";
import FormationHeader from '@/components/formations/formation-header';
import FormationDetails from '@/components/formations/formation-details';
import FormationActions from '@/components/formations/formation-actions';
import FormationTabs from '@/components/formations/formation-tabs';

export default function TrainingSessionPage() {
  const params = useParams();

  const { data: formation, isLoading, isError } = useQuery<Formation>({
    queryKey: ["formation", params.id],
    queryFn: async () => {
      console.log(`/formations/${params.id}`)
      const response = await axiosInstance.get(`/formations/${params.id}`);
      console.log(response)
      return response.data;
    },
  });

  if (isLoading || !formation) return <div>Loading...</div>;

  if(isError) return <div>Error happend</div>

  return (
    <div className="space-y-6">
      <FormationHeader formation={formation} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <FormationDetails formation={formation} />
        <FormationActions formationId={formation.action_id} />
      </div>

      <FormationTabs formation={formation} />
    </div>
  );
}