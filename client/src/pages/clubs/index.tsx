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
import type { Club } from "@shared/schema";

export default function Clubs() {
  const { data: clubs, isLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Clubs</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Club
        </Button>
      </div>

      <div className="border rounded-lg">
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
                <TableCell>{club.name}</TableCell>
                <TableCell>{club.patron}</TableCell>
                <TableCell>KES {club.registrationFee}</TableCell>
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
