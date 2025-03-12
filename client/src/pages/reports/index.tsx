
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Activity, Club, Membership } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: clubs } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const { data: memberships } = useQuery<Membership[]>({
    queryKey: ["/api/memberships"],
  });

  // Calculate total revenue
  const totalRevenue = activities?.reduce(
    (sum, activity) => sum + Number(activity.revenue),
    0
  ) || 0;

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

  // Calculate membership distribution
  const membershipsByClub = memberships?.reduce((acc, membership) => {
    const club = clubs?.find((c) => c.id === membership.clubId);
    if (!club) return acc;
    
    if (!acc[club.name]) {
      acc[club.name] = 0;
    }
    
    acc[club.name] += 1;
    return acc;
  }, {} as Record<string, number>);

  const membershipChartData = Object.entries(membershipsByClub || {}).map(([name, count]) => ({
    name,
    value: count,
  }));

  // For the allocation pie chart
  const allocationData = [
    { name: 'Ongoing Activities (50%)', value: totalRevenue * 0.5 },
    { name: 'Annual Party (30%)', value: totalRevenue * 0.3 },
    { name: 'Savings (20%)', value: totalRevenue * 0.2 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B66FF'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground">
          Overview of club activities, revenue, and membership distribution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all club activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clubs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active clubs in the school</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberships?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Students participating in clubs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="mb-4">
          <TabsTrigger value="revenue">Revenue by Club</TabsTrigger>
          <TabsTrigger value="allocation">Revenue Allocation</TabsTrigger>
          <TabsTrigger value="membership">Club Membership</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
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
                    <Tooltip formatter={(value) => [`Ksh ${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="allocation">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle>Club Membership Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value} members`}
                    >
                      {membershipChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Members']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Revenue Allocation Details</h2>
        <Card>
          <CardContent className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Club</th>
                  <th className="text-right pb-2">Total Revenue</th>
                  <th className="text-right pb-2">Ongoing Activities (50%)</th>
                  <th className="text-right pb-2">Annual Party (30%)</th>
                  <th className="text-right pb-2">Savings (20%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(revenueByClub || {}).map(([name, data]) => (
                  <tr key={name} className="border-b">
                    <td className="py-2">{name}</td>
                    <td className="text-right py-2">Ksh {data.totalRevenue.toLocaleString()}</td>
                    <td className="text-right py-2">Ksh {data.ongoingActivities.toLocaleString()}</td>
                    <td className="text-right py-2">Ksh {data.annualParty.toLocaleString()}</td>
                    <td className="text-right py-2">Ksh {data.savings.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="py-2">Total</td>
                  <td className="text-right py-2">Ksh {totalRevenue.toLocaleString()}</td>
                  <td className="text-right py-2">Ksh {(totalRevenue * 0.5).toLocaleString()}</td>
                  <td className="text-right py-2">Ksh {(totalRevenue * 0.3).toLocaleString()}</td>
                  <td className="text-right py-2">Ksh {(totalRevenue * 0.2).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
