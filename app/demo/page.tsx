import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { fetchUsers } from "@/services/userService";



export default async function DemoPage() {
  const data = await fetchUsers("hello")

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
