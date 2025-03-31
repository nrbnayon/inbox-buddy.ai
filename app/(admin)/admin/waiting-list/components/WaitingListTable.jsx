"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmailPagination } from "@/app/(main)/dashboard/components/EmailPagination";
import { Badge } from "@/components/ui/badge";

// Mock data for the table
const mockData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    totalInbox: 10,
    status: "pending",
    description:
      "lorem alsdkjflak;sdf asdflosdjfkalsd  foajsdfl;kasjd fl;kasd flsad jf;lkasdjf;lkasdj flkdj fla;ksdjf lask;dfj lska;djf asdl;kfj",
    emailDetails: "Marketing team lead with access to all campaigns.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    totalInbox: 8,
    status: "pending",
    description:
      "lorem alsdkjflak;sdf asdflosdjfkalsd  foajsdfl;kasjd fl;kasd flsad jf;lkasdjf;lkasdj flkdj fla;ksdjf lask;dfj lska;djf asdl;kfj",
    emailDetails: "Customer support representative handling tier 1 tickets.",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    totalInbox: 10,
    status: "pending",
    description:
      "lorem alsdkjflak;sdf asdflosdjfkalsd  foajsdfl;kasjd fl;kasd flsad jf;lkasdjf;lkasdj flkdj fla;ksdjf lask;dfj lska;djf asdl;kfj",
    emailDetails: "Product manager for the mobile application team.",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    totalInbox: 5,
    status: "pending",
    description:
      "lorem alsdkjflak;sdf asdflosdjfkalsd  foajsdfl;kasjd fl;kasd flsad jf;lkasdjf;lkasdj flkdj fla;ksdjf lask;dfj lska;djf asdl;kfj",
    emailDetails: "UX designer working on the new dashboard interface.",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael@example.com",
    totalInbox: 10,
    status: "pending",
    description:
      "lorem alsdkjflak;sdf asdflosdjfkalsd  foajsdfl;kasjd fl;kasd flsad jf;lkasdjf;lkasdj flkdj fla;ksdjf lask;dfj lska;djf asdl;kfj",
    emailDetails: "Backend developer responsible for API integration.",
  },
];

export default function WaitingListTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleInfoClick = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleCancelClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
    setIsDetailsOpen(false);
    setSelectedUser(null);
  };

  const handleGiveAccess = () => {
    // Implement your access granting logic here
    console.log(`Access granted to ${selectedUser.name}`);
    setIsDetailsOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="py-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="pl-9 py-6">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Feedback</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Total Inbox</TableHead>
              <TableHead className="text-center">Actions</TableHead>
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
                <TableCell className="text-center">
                  <Badge
                    variant={
                      user?.status === "pending" ? "pending" : "destructive"
                    }
                  >
                    {user.status}
                  </Badge>
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
      </div>

      {/* pagination */}
      <div className="flex mt-10 justify-center">
        <EmailPagination />
      </div>

      {/* Email Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>
              Information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-3">{selectedUser?.name}</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Email:</div>
              <div className="col-span-3">{selectedUser?.email}</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Total Inbox:</div>
              <div className="col-span-3">{selectedUser?.totalInbox}</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Details:</div>
              <div className="col-span-3">{selectedUser?.emailDetails}</div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={handleCancelClick}>
              Cancel Request
            </Button>
            <Button onClick={handleGiveAccess}>Give Access</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will close the email details dialog. Any unsaved
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, go back</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
