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
import { Button } from "@/components/ui/button";
import type { Activity, Club } from "@shared/schema";
import { AddActivityDialog } from "./add-activity-dialog";

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
            Manage club activities and revenue
          </p>
        </div>
        <AddActivityDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Club</TableHead>
                <TableHead>Activity Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Revenue (KES)</TableHead>
                <TableHead>Ongoing Activities (50%)</TableHead>
                <TableHead>Annual Party (30%)</TableHead>
                <TableHead>Savings (20%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities?.map((activity) => {
                const club = clubs?.find((c) => c.id === activity.clubId);
                const revenue = Number(activity.revenue);
                const ongoingActivities = revenue * 0.5;
                const annualParty = revenue * 0.3;
                const savings = revenue * 0.2;

                return (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{club?.name}</TableCell>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell>{revenue.toFixed(2)}</TableCell>
                    <TableCell>{ongoingActivities.toFixed(2)}</TableCell>
                    <TableCell>{annualParty.toFixed(2)}</TableCell>
                    <TableCell>{savings.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
              {activities?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No activities recorded. Add your first activity to get started.
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