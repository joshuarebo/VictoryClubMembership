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
import { Card, CardContent } from "@/components/ui/card";
import { AddClubDialog } from "./add-club-dialog";
import type { Club } from "@shared/schema";

export default function Clubs() {
  const { data: clubs, isLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

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
          <h1 className="text-3xl font-bold tracking-tight">Clubs</h1>
          <p className="text-muted-foreground">
            Manage school clubs and their registrations
          </p>
        </div>
        <AddClubDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Patron</TableHead>
                <TableHead>Registration Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs?.map((club) => (
                <TableRow key={club.id}>
                  <TableCell className="font-medium">{club.name}</TableCell>
                  <TableCell>{club.patron}</TableCell>
                  <TableCell>KES {club.registrationFee}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {clubs?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No clubs found. Create your first club to get started.
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
import type { Club, Membership } from "@shared/schema";
import { AddClubDialog } from "./add-club-dialog";

export default function Clubs() {
  const { data: clubs, isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const { data: memberships, isLoading: membershipsLoading } = useQuery<Membership[]>({
    queryKey: ["/api/memberships"],
  });

  const isLoading = clubsLoading || membershipsLoading;

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
          <h1 className="text-3xl font-bold tracking-tight">Clubs</h1>
          <p className="text-muted-foreground">
            Manage school clubs and their activities
          </p>
        </div>
        <AddClubDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Patron</TableHead>
                <TableHead>Registration Fee</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs?.map((club) => {
                const clubMemberships = memberships?.filter(
                  (m) => m.clubId === club.id
                );
                return (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">
                      {club.name}
                    </TableCell>
                    <TableCell>{club.patron}</TableCell>
                    <TableCell>Ksh {Number(club.registrationFee).toLocaleString()}</TableCell>
                    <TableCell>
                      {clubMemberships?.length || 0} students
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="ghost" size="sm">
                        View Members
                      </Button>
                      <Button variant="ghost" size="sm">
                        Add Activity
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {clubs?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No clubs found. Create your first club to get started.
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
