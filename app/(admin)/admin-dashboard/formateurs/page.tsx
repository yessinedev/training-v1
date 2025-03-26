import FormateursTable from "@/components/formateurs/formateurs-table";


export default function FormateursPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Formateurs</h2>
      </div>
      <FormateursTable />
    </div>
  );
}