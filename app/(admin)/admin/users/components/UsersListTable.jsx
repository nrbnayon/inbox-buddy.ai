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
import { Badge } from "@/components/ui/badge";
import { updateUser, deleteUser } from "@/lib/api/user";
import LoadingPing from "@/components/LoadingPing";
import { UserPagination } from "@/app/(admin)/components/UserPagination";
import SmallLoader from "@/components/SmallLoader";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export default function UsersListTable({
  users,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onActionComplete,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleActionClick = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !actionType) return;

    setIsActionLoading(true);
    try {
      let res;
      let successMessage = "";

      switch (actionType) {
        case "block":
          res = await updateUser(selectedUser._id, {
            status: selectedUser.status === "blocked" ? "active" : "blocked",
          });
          successMessage =
            selectedUser.status === "blocked"
              ? "User unblocked successfully"
              : "User blocked successfully";
          break;
        case "cancel":
          const tempRes = await axiosInstance.put(
            `/stripe/admin/cancel-user-subscription`,
            {
              userId: selectedUser._id,
            }
          );
          res = tempRes?.data;
          successMessage = res.message || "Operation Successful";
          break;
        case "delete":
          res = await deleteUser(selectedUser._id);
          successMessage = "User deleted successfully";
          break;
        default:
          break;
      }

      if (res?.success) {
        toast.success(successMessage);
        // Trigger data refresh and wait for it to complete
        await onActionComplete();
        setIsActionLoading(false);
        setSelectedUser(null);
        setActionType(null);
        // setIsConfirmOpen(false); // Close the dialog after success
      } else {
        toast.error(res?.message || "Action failed");
        await onActionComplete();
        setIsActionLoading(false);
      }
    } catch (err) {
      console.error(`Error performing ${actionType} action:`, err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to perform action"
      );
      setIsActionLoading(false); // Ensure the loading state is reset on failure
    }
  };

  const getActionMessage = () => {
    if (!selectedUser) return "";
    switch (actionType) {
      case "block":
        return `Are you sure you want to ${
          selectedUser.status === "blocked" ? "unblock" : "block"
        } ${selectedUser?.name}? This will ${
          selectedUser.status === "blocked" ? "restore" : "restrict"
        } their access.`;
      case "cancel":
        return isActionLoading
          ? "Cancelling subscription... Please wait."
          : `Are you sure you want to cancel the subscription for ${selectedUser?.name}? If you do, the user must subscribe again. You can't undo this action.`;
      case "delete":
        return `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`;
      default:
        return "";
    }
  };

  const renderStatusBadge = (status) => {
    let variant = "default";
    switch (status) {
      case "active":
        variant = "success";
        break;
      case "cancelled":
      case "blocked":
        variant = "destructive";
        break;
      case "pending":
        variant = "warning";
        break;
      default:
        variant = "default";
    }
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (loading && users.length === 0) {
    return <LoadingPing />;
  }

  if (error && users.length === 0) {
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
              <TableHead className="text-center">Provider</TableHead>
              <TableHead className="text-center">Subs. Plan</TableHead>
              <TableHead className="text-center">Subs. Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} className="border-b">
                  <TableCell className="font-medium pl-9 py-6 pr-4">
                    {user?.name || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell pr-4">
                    {user?.email || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.authProvider || "email"}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.subscription?.plan || "free"}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderStatusBadge(user.subscription?.status || "active")}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${user?.name}`}
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleActionClick(user, "block")}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {user.status === "blocked"
                            ? "Unblock User"
                            : "Block User"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick(user, "cancel")}
                          disabled={user.subscription?.status === "cancelled"}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Subscription
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick(user, "delete")}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && (
        <div className="flex mt-10 justify-center">
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="flex items-center">
              {getActionMessage()}
              {isActionLoading && actionType === "cancel" && (
                <SmallLoader className="ml-2 text-gray-500" />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              No, go back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <SmallLoader className="text-white" />
              ) : (
                "Yes, proceed"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
