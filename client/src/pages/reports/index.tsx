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

  // Calculate total revenue
  const totalRevenue = activities?.reduce(
    (sum, activity) => sum + Number(activity.revenue),
    0
  );

  // Calculate revenue by club
  const revenueByClub = activities?.reduce((acc, activity) => {
    const club = clubs?.find((c) => c.id === activity.clubId);
    if (!club) return acc;

    if (!acc[club.name]) {
      acc[club.name] = {
        totalRevenue: 0,
        ongoingActivities: 0,
        annualParty: 0,
        savings: 0,
      };
    }

    const revenue = Number(activity.revenue);
    acc[club.name].totalRevenue += revenue;
    acc[club.name].ongoingActivities += revenue * 0.5;
    acc[club.name].annualParty += revenue * 0.3;
    acc[club.name].savings += revenue * 0.2;

    return acc;
  }, {} as Record<string, { totalRevenue: number; ongoingActivities: number; annualParty: number; savings: number; }>);

  const chartData = Object.entries(revenueByClub || {}).map(([name, data]) => ({
    name,
    revenue: data.totalRevenue,
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Financial Reports</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {totalRevenue?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 mb-8">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Club Revenue Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {Object.entries(revenueByClub || {}).map(([clubName, data]) => (
                <div key={clubName} className="py-4">
                  <h3 className="font-semibold mb-2">{clubName}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Revenue</p>
                      <p className="font-medium">KES {data.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ongoing Activities (50%)</p>
                      <p className="font-medium">KES {data.ongoingActivities.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annual Party (30%)</p>
                      <p className="font-medium">KES {data.annualParty.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Savings (20%)</p>
                      <p className="font-medium">KES {data.savings.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}