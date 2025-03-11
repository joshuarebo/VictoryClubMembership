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
import type { Student, Membership } from "@shared/schema";
import { AddStudentDialog } from "./add-student-dialog";
import { AddMembershipDialog } from "./add-membership-dialog";

export default function Students() {
  const { data: students, isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const { data: memberships, isLoading: membershipsLoading } = useQuery<Membership[]>({
    queryKey: ["/api/memberships"],
  });

  const isLoading = studentsLoading || membershipsLoading;

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
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student registrations and club memberships
          </p>
        </div>
        <AddStudentDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admission Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Club Memberships</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students?.map((student) => {
                const studentMemberships = memberships?.filter(
                  (m) => m.studentId === student.id
                );
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.admissionNumber}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      {studentMemberships?.length || 0} clubs
                    </TableCell>
                    <TableCell className="space-x-2">
                      <AddMembershipDialog studentId={student.id} />
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {students?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No students registered. Add your first student to get started.
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