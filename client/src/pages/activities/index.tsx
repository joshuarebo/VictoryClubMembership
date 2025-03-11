import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Activity } from "@shared/schema";

export default function Activities() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Activities</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities?.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                <TableCell>KES {activity.revenue}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
