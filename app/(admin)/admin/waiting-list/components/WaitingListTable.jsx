// app\(admin)\admin\waiting-list\components\WaitingListTable.jsx
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
import {
  getAllWaitingListUsers,
  approveWaitingList,
  rejectWaitingList,
} from "@/lib/api/user";
import { toast } from "sonner";
import { UserPagination } from "@/app/(admin)/components/UserPagination";
import LoadingPing from "@/components/LoadingPing";
import SmallLoader from "@/components/SmallLoader";

export default function WaitingListTable() {
  const [waitingListUsers, setWaitingListUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchWaitingListUsers();
  }, [currentPage]);

  const fetchWaitingListUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllWaitingListUsers(currentPage, itemsPerPage);
      setWaitingListUsers(response?.data || []);
      setTotalPages(response?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load waiting list users");
      toast.error("Failed to load waiting list users");
      console.error("Error fetching waiting list users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoClick = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleCancelClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    setIsRejecting(true);
    try {
      await rejectWaitingList({ email: selectedUser.email });
      toast.success(`Access request for ${selectedUser.name} was rejected`);
      fetchWaitingListUsers();
    } catch (err) {
      toast.error("Failed to reject waiting list request");
      console.error("Error rejecting waiting list request:", err);
    } finally {
      setIsRejecting(false);
      setIsConfirmOpen(false);
      setIsDetailsOpen(false);
      setSelectedUser(null);
    }
  };

  const handleGiveAccess = async () => {
    setIsApproving(true);
    try {
      await approveWaitingList({ email: selectedUser.email });
      toast.success(`Access granted to ${selectedUser.name}`);
      fetchWaitingListUsers();
    } catch (err) {
      toast.error("Failed to approve waiting list request");
      console.error("Error approving waiting list request:", err);
    } finally {
      setIsApproving(false);
      setIsDetailsOpen(false);
      setSelectedUser(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "waiting":
      default:
        return "pending";
    }
  };

  if (isLoading && !waitingListUsers.length) {
    return <LoadingPing />;
  }

  if (error && !waitingListUsers.length) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="pl-9 py-6">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Inbox</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waitingListUsers.length > 0 ? (
              waitingListUsers.map((user) => (
                <TableRow key={user._id || user.id} className="border-b">
                  <TableCell className="font-medium pl-9 py-6 pr-4">
                    {user.name || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell pr-4">
                    {user.email || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.description
                      ? user.description.length > 25
                        ? `${user.description.substring(0, 25)}...`
                        : user.description
                      : "No description provided"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(user.status)}>
                      {user.status || "waiting"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.inbox || "N/A"}
                  </TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No waiting list users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {waitingListUsers.length > 0 && (
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
            <DialogTitle>Waiting List Request</DialogTitle>
            <DialogDescription>
              Information about {selectedUser?.name}
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
                {selectedUser?.inbox || "Not specified"}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Description:</div>
              <div className="col-span-3">
                {selectedUser?.description || "No description provided"}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Applied:</div>
              <div className="col-span-3">
                {selectedUser?.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "Unknown"}
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            {selectedUser?.status !== "rejected" && (
              <Button
                variant="destructive"
                onClick={handleCancelClick}
                disabled={isApproving || isRejecting}
                className="hover:bg-red-600 bg-red-500"
              >
                Reject Request
              </Button>
            )}
            {selectedUser?.status !== "approved" && (
              <Button
                variant="blueGradient"
                onClick={handleGiveAccess}
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <div className="flex justify-center">
                    <SmallLoader className="text-white" />
                  </div>
                ) : (
                  "Approve Access"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reject the waiting list request from{" "}
              {selectedUser?.name}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRejecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isRejecting}
              className="bg-red-500 hover:bg-red-500/90 cursor-pointer"
            >
              {isRejecting ? (
                <div className="flex justify-center">
                  <SmallLoader className="text-white" />
                </div>
              ) : (
                "Yes, reject request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
