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
import type { Student } from "@shared/schema";

export default function Students() {
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admission Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.admissionNumber}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
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
