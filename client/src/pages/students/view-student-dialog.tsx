import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Student, Membership, Club } from "@shared/schema";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface ViewStudentDialogProps {
  student: Student;
  memberships: Membership[];
}

export function ViewStudentDialog({ student, memberships }: ViewStudentDialogProps) {
  const { data: clubs } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const studentMemberships = memberships.filter(m => m.studentId === student.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Admission Number</TableCell>
                  <TableCell>{student.admissionNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{student.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Class</TableCell>
                  <TableCell>{student.class}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Club Memberships</h3>
            <Table>
              <TableBody>
                {studentMemberships.map((membership) => {
                  const club = clubs?.find(c => c.id === membership.clubId);
                  return (
                    <TableRow key={membership.id}>
                      <TableCell className="font-medium">{club?.name}</TableCell>
                      <TableCell className="capitalize">{membership.role}</TableCell>
                      <TableCell>{membership.position || '-'}</TableCell>
                      <TableCell>{format(new Date(membership.joinDate), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  );
                })}
                {studentMemberships.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Not a member of any clubs
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 