"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { getAllUsers, updateUser } from "@/lib/api/user";
import { toast } from "sonner";
import { UserPagination } from "@/app/(admin)/components/UserPagination";
import LoadingPing from "@/components/LoadingPing";
import SmallLoader from "@/components/SmallLoader";

export default function BlockedUsersTable() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUnblocking, setIsUnblocking] = useState(false); // New loading state for unblock action
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBlockedUsers();
  }, [currentPage]);

  const fetchBlockedUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(currentPage, itemsPerPage, "blocked");
      setBlockedUsers(response?.users || []);
      setTotalPages(response?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load blocked users");
      toast.error("Failed to load blocked users");
      console.error("Error fetching blocked users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoClick = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleUnblockClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmUnblock = async () => {
    if (selectedUser) {
      setIsUnblocking(true); // Start loading state
      try {
        const response = await updateUser(selectedUser?._id, {
          status: selectedUser.status === "blocked" ? "active" : "blocked",
        });

        if (response.success) {
          toast.success(`${selectedUser.name || "User"} has been unblocked`);
          fetchBlockedUsers();
        }
      } catch (err) {
        toast.error("Failed to unblock user");
        console.error("Error unblocking user:", err);
      } finally {
        setIsUnblocking(false); // End loading state
        setIsConfirmOpen(false); // Close confirmation dialog
        setIsDetailsOpen(false); // Close details dialog
        setSelectedUser(null); // Reset selected user
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "blocked":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading && !blockedUsers.length) {
    return <LoadingPing />;
  }

  if (error && !blockedUsers.length) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="pl-9 py-6">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Inbox</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blockedUsers.length > 0 ? (
              blockedUsers.map((user) => (
                <TableRow key={user._id || user.id} className="border-b">
                  <TableCell className="font-medium pl-9 py-6 pr-4">
                    {user.name || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell pr-4">
                    {user.email || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.inboxList?.[0] || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(user.status)}>
                      {user.status || "blocked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleInfoClick(user)}
                      aria-label={`View details for ${user.name || "user"}`}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No blocked users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {blockedUsers.length > 0 && (
        <div className="flex mt-10 justify-center">
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Blocked User Details</DialogTitle>
            <DialogDescription>
              Information about {selectedUser?.name || "the user"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-3">{selectedUser?.name || "N/A"}</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Email:</div>
              <div className="col-span-3">{selectedUser?.email || "N/A"}</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Inbox:</div>
              <div className="col-span-3">
                {selectedUser?.inboxList?.[0] || "Not specified"}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Role:</div>
              <div className="col-span-3">{selectedUser?.role || "N/A"}</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Blocked Since:</div>
              <div className="col-span-3">
                {selectedUser?.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "Unknown"}
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button variant="blueGradient" onClick={handleUnblockClick}>
              Unblock User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will unblock {selectedUser?.name || "the user"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="link-btn cursor-pointer text-black"
              onClick={handleConfirmUnblock}
              disabled={isUnblocking} // Disable button during unblock
            >
              {isUnblocking ? <SmallLoader /> : "Yes, unblock user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
