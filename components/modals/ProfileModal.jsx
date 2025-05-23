"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  logout,
} from "@/lib/api/user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Globe2,
  Calendar,
  Camera,
  UserCircle2,
  Loader2,
  AlertTriangle,
  Trash2,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import useGetUser from "@/hooks/useGetUser";
import { logoutAction } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { InputOTPForm } from "@/app/(admin)/admin/verify-email/components/input-otp-form";

const ProfileModal = ({ isOpen, onClose, accessToken, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useGetUser(accessToken);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordChangeStep, setPasswordChangeStep] = useState("initial");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData(user);
      } else {
        fetchUserProfile();
      }
    }
  }, [isOpen, user]);

  // Start timer when OTP is sent
  useEffect(() => {
    if (passwordChangeStep === "otp") {
      setRemainingTime(300);
      setTimerActive(true);
    }
  }, [passwordChangeStep]);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (timerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, remainingTime]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getUserProfile();
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setActiveTab("edit");
    setFormData({ ...user });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB limit");
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== "email") {
          data.append(key, value);
        }
      });
      if (profilePicture) data.append("profilePicture", profilePicture);

      const response = await updateUserProfile(data);

      const updatedUser = response.user;
      setUser(updatedUser);

      setIsEditing(false);
      setProfilePicture(null);
      setActiveTab("overview");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const res = await deleteUserAccount();
      if (res.success) {
        toast.success("Account deleted successfully");
        const res = await logoutAction();

        setShowDeleteDialog(false);
        onClose();
        router.refresh();
        router.replace("/login");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const sendChangePasswordOtp = async () => {
    try {
      const response = await axiosInstance.post(
        "/users/request-change-password-otp",
        {
          email: user?.email,
        }
      );
      if (response.data.success) {
        toast.success("OTP sent to your email");
      } else {
        console.log("Error while sending ot to email: ", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
      throw error;
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const response = await axiosInstance.post("/users/verify-otp", {
        email: user?.email,
        otp,
      });
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
      throw error;
    }
  };

  const changePassword = async (otp, oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.post("/users/change-password", {
        otp,
        currentPassword: oldPassword,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password changed successfully");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to change password");
      throw error;
    }
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      await sendChangePasswordOtp();
      setPasswordChangeStep("otp");
    } catch (error) {
      // Error already handled in sendChangePasswordOtp
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsChangingPassword(true);
    try {
      await verifyOtp(enteredOtp);
      setOtp(enteredOtp);
      setPasswordChangeStep("changePassword");
    } catch (error) {
      // Error already handled in verifyOtp
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(otp, oldPassword, newPassword);
      setPasswordChangeStep("initial");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setOtp("");
    } catch (error) {
      // Error already handled in changePassword
    } finally {
      setIsChangingPassword(false);
    }
  };

  const imageSrc = previewUrl || user?.profilePicture;

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
      <Icon className="w-5 h-5 text-gray-500" />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value || "Not set"}</p>
      </div>
    </div>
  );

  if (!isOpen) return null;

  // console.log(user);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 gap-0 bg-white dark:bg-gray-950">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1 cursor-pointer">
                Overview
              </TabsTrigger>
              {user?.role !== "user" && (
                <TabsTrigger
                  value="managePassword"
                  className="flex-1 cursor-pointer"
                >
                  Manage Password
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="flex-1 cursor-pointer">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(60vh-180px)] px-6 py-4">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage
                      src={imageSrc}
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">
                    {user?.name || "No Name"}
                  </h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                {/* <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleEditClick}
                    disabled={isLoading}
                  >
                    Edit Profile
                  </Button>
                </div> */}
              </div>
            </TabsContent>

            {user?.role !== "user" && (
              <TabsContent value="managePassword" className="mt-0">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  {passwordChangeStep === "initial" && (
                    <Button
                      variant="blueGradient"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? "Sending OTP..." : "Change Password"}
                    </Button>
                  )}
                  {passwordChangeStep === "otp" && (
                    <div className="space-y-4">
                      <p>Enter the OTP sent to your email</p>
                      <InputOTPForm
                        onComplete={setEnteredOtp}
                        disabled={isChangingPassword}
                      />
                      <div className="flex justify-between space-x-3">
                        <div className="flex gap-4">
                          <Button
                            variant="blueGradient"
                            onClick={handleVerifyOtp}
                            disabled={
                              enteredOtp.length !== 6 || isChangingPassword
                            }
                          >
                            {isChangingPassword ? "Verifying..." : "Verify"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setPasswordChangeStep("initial")}
                          >
                            Cancel
                          </Button>
                        </div>
                        <div>
                          <Button variant="secondary" onClick={handleSendOtp}>
                            {timerActive
                              ? `Resend in: ${Math.floor(
                                  remainingTime / 60
                                )}:${(remainingTime % 60)
                                  .toString()
                                  .padStart(2, "0")}`
                              : "Resend OTP"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {passwordChangeStep === "changePassword" && (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Old Password</Label>
                        <div className="relative">
                          <Input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOffIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                              <EyeIcon className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOffIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                              <EyeIcon className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmNewPassword"
                            type={showConfirmNewPassword ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) =>
                              setConfirmNewPassword(e.target.value)
                            }
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() =>
                              setShowConfirmNewPassword(!showConfirmNewPassword)
                            }
                          >
                            {showConfirmNewPassword ? (
                              <EyeOffIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                              <EyeIcon className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          type="submit"
                          disabled={isChangingPassword}
                          variant="blueGradient"
                        >
                          {isChangingPassword
                            ? "Changing..."
                            : "Change Password"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setPasswordChangeStep("initial")}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </TabsContent>
            )}

            <TabsContent value="settings" className="mt-0">
              <div className="space-y-6">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900/20">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                      Danger Zone
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Once you delete your account, there is no going back. This
                    will permanently delete your account.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="mt-4"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Yes, delete account"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;

{
  /* <TabsContent value="edit" className="mt-0">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={previewUrl || imageSrc}
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                        {formData?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profilePicture"
                      className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your gender"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={
                        formData.dateOfBirth
                          ? new Date(formData.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="blueGradient"
                    onClick={() => {
                      setIsEditing(false);
                      setActiveTab("overview");
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent> */
}
