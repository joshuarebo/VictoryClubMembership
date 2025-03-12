import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { Activity, Club } from "@shared/schema";
import { AddActivityDialog } from "./add-activity-dialog";
import { format } from "date-fns";

export default function Activities() {
  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: clubs, isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const isLoading = activitiesLoading || clubsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground">
            Track and manage club activities and revenue
          </p>
        </div>
        <AddActivityDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity Name</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Allocated Budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities?.map((activity) => {
                const club = clubs?.find((c) => c.id === activity.clubId);
                const revenue = Number(activity.revenue);

                return (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.name}
                    </TableCell>
                    <TableCell>{club?.name || "Unknown"}</TableCell>
                    <TableCell>
                      {activity.date ? format(new Date(activity.date), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>Ksh {revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        <div>Ongoing Activities: Ksh {(revenue * 0.5).toLocaleString()}</div>
                        <div>Annual Party: Ksh {(revenue * 0.3).toLocaleString()}</div>
                        <div>Savings: Ksh {(revenue * 0.2).toLocaleString()}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {activities?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No activities found. Add your first activity to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}