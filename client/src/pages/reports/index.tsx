import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Activity, Club } from "@shared/schema";

export default function Reports() {
  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: clubs } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const revenueByClub = activities?.reduce((acc, activity) => {
    const club = clubs?.find((c) => c.id === activity.clubId);
    if (!club) return acc;

    if (!acc[club.name]) {
      acc[club.name] = 0;
    }
    acc[club.name] += Number(activity.revenue);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(revenueByClub || {}).map(([name, revenue]) => ({
    name,
    revenue,
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Reports</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES{" "}
              {activities?.reduce(
                (sum, activity) => sum + Number(activity.revenue),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Revenue by Club</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
