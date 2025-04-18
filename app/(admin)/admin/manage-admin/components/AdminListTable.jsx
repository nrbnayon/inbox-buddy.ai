"use client";

import { useState, useEffect } from "react";
import { Ban, EllipsisVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUser, deleteUser, getAllUsers } from "@/lib/api/user";
import { toast } from "sonner";
import { UserPagination } from "@/app/(admin)/components/UserPagination";
import LoadingPing from "@/components/LoadingPing";
import SmallLoader from "@/components/SmallLoader";

export default function AdminListTable() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAdminUsers();
  }, [currentPage]);

  const fetchAdminUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(currentPage, itemsPerPage);
      const adminUsers =
        response?.users.filter((usr) => usr.role === "admin") || [];
      setAdminUsers(adminUsers || []);
      setTotalPages(response?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load admin users");
      toast.error("Failed to load admin users");
      console.error("Error fetching admin users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (admin, action) => {
    setSelectedAdmin(admin);
    setActionType(action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAdmin || !actionType) return;

    setIsActionLoading(true);
    try {
      let res;
      let successMessage = "";

      switch (actionType) {
        case "toggle":
          res = await updateUser(selectedAdmin._id, {
            status: selectedAdmin.status === "blocked" ? "active" : "blocked",
          });
          successMessage =
            selectedAdmin.status === "blocked"
              ? "Admin authority restored successfully"
              : "Admin authority revoked successfully";
          break;
        case "delete":
          res = await deleteUser(selectedAdmin._id);
          successMessage = "Admin deleted successfully";
          break;
        default:
          break;
      }

      if (res?.success) {
        toast.success(successMessage);
        fetchAdminUsers();
      } else {
        throw new Error(res?.message || "Action failed");
      }
    } catch (err) {
      console.error(`Error performing ${actionType} action:`, err);
      toast.error(err.message || "Failed to perform action");
    } finally {
      setIsActionLoading(false);
      setIsConfirmOpen(false);
      setSelectedAdmin(null);
      setActionType(null);
    }
  };

  const getActionMessage = () => {
    if (!selectedAdmin) return "";
    switch (actionType) {
      case "toggle":
        return `Are you sure you want to ${
          selectedAdmin.status === "blocked" ? "restore" : "revoke"
        } admin authority for ${selectedAdmin?.name}?`;
      case "delete":
        return `Are you sure you want to delete admin ${selectedAdmin?.name}? This action cannot be undone.`;
      default:
        return "";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "blocked":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading && !adminUsers.length) {
    return <LoadingPing />;
  }

  if (error && !adminUsers.length) {
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
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.length > 0 ? (
              adminUsers.map((admin) => (
                <TableRow key={admin._id} className="border-b">
                  <TableCell className="font-medium pl-9 py-6 pr-4">
                    {admin.name || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell pr-4">
                    {admin.email || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(admin.status)}>
                      {admin.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${admin.name}`}
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleActionClick(admin, "toggle")}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {admin.status === "blocked"
                            ? "Restore Authority"
                            : "Revoke Authority"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick(admin, "delete")}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No admins found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {adminUsers.length > 0 && (
        <div className="flex mt-10 justify-center">
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <SmallLoader className="text-white" />
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
