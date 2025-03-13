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
import type { Club, Membership, Student } from "@shared/schema";
import { AddActivityDialog } from "../activities/add-activity-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface ViewMembersDialogProps {
  clubId: number;
  clubName: string;
  memberships: Membership[];
}

function ViewMembersDialog({ clubId, clubName, memberships }: ViewMembersDialogProps) {
  const { data: students } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const clubMembers = memberships.filter(m => m.clubId === clubId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View Members
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{clubName} Members</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Admission Number</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubMembers.map((member) => {
              const student = students?.find(s => s.id === member.studentId);
              return (
                <TableRow key={member.id}>
                  <TableCell>{student?.name}</TableCell>
                  <TableCell>{student?.admissionNumber}</TableCell>
                  <TableCell>{student?.class}</TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell>{member.position || '-'}</TableCell>
                  <TableCell>{format(new Date(member.joinDate), 'MMM d, yyyy')}</TableCell>
                </TableRow>
              );
            })}
            {clubMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No members in this club yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

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
                      <ViewMembersDialog 
                        clubId={club.id} 
                        clubName={club.name} 
                        memberships={memberships || []} 
                      />
                      <AddActivityDialog clubId={club.id} />
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