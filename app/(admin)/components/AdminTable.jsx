import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminTable({ mockData, columns }) {
  return (
    <Table>
      <TableHeader className="bg-blue-100">
        <TableRow>
          <TableHead className="w-[200px] pl-9 py-6">Name</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Feedback</TableHead>
          <TableHead className="text-center">Total Inbox</TableHead>
          <TableHead className="text-center w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockData.map((user) => (
          <TableRow key={user.id} className="border-b">
            <TableCell className="font-medium pl-9 py-6 pr-4">
              {user.name}
            </TableCell>
            <TableCell className="hidden md:table-cell pr-4">
              {user.email}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {user.emailDetails}
            </TableCell>
            <TableCell className="text-center">{user.totalInbox}</TableCell>
            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleInfoClick(user)}
                aria-label={`View details for ${user.name}`}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
