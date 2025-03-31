"use client";

import { useState } from "react";
import { EllipsisVertical, Ban, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    authProvider: "gmail",
    subsPlan: "free",
    subStatus: "active",
    emailDetails: "Marketing team lead with access to all campaigns.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    authProvider: "gmail",
    subsPlan: "free",
    subStatus: "active",
    emailDetails: "Customer support representative handling tier 1 tickets.",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    authProvider: "gmail",
    subsPlan: "free",
    subStatus: "active",
    emailDetails: "Product manager for the mobile application team.",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    authProvider: "gmail",
    subsPlan: "free",
    subStatus: "active",
    emailDetails: "UX designer working on the new dashboard interface.",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael@example.com",
    authProvider: "gmail",
    subsPlan: "free",
    subStatus: "active",
    emailDetails: "Backend developer responsible for API integration.",
  },
];

export default function UsersListTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleActionClick = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedUser || !actionType) return;

    switch (actionType) {
      case "block":
        console.log(`Blocking user: ${selectedUser.name}`);
        break;
      case "cancel":
        console.log(`Cancelling subscription for: ${selectedUser.name}`);
        break;
      case "delete":
        console.log(`Deleting user: ${selectedUser.name}`);
        break;
      default:
        break;
    }

    setIsConfirmOpen(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const getActionMessage = () => {
    switch (actionType) {
      case "block":
        return `Are you sure you want to block ${selectedUser?.name}? This will restrict their access.`;
      case "cancel":
        return `Are you sure you want to cancel the subscription for ${selectedUser?.name}?`;
      case "delete":
        return `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`;
      default:
        return "";
    }
  };

  return (
    <div className="py-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="pl-9 py-6">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-center">Provider</TableHead>
              <TableHead className="text-center">Subs. Plan</TableHead>
              <TableHead className="text-center">Subs. Status</TableHead>
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
                <TableCell className="text-center">
                  {user.authProvider}
                </TableCell>
                <TableCell className="text-center">{user.subsPlan}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="success">{user.subStatus}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${user.name}`}
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleActionClick(user, "block")}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Block User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleActionClick(user, "cancel")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleActionClick(user, "delete")}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex mt-10 justify-center">
        <EmailPagination />
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, go back</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Yes, proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
