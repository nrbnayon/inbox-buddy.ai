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
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

const ProfileModal = ({ isOpen, onClose, initialUser }) => {
  const [user, setUser] = useState(initialUser || null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialUser) {
        setUser(initialUser);
        setFormData(initialUser);
      } else {
        fetchUserProfile();
      }
    }
  }, [isOpen, initialUser]);

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
      setUser(response.user);
      setIsEditing(false);
      setProfilePicture(null);
      setPreviewUrl(null);
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
      await deleteUserAccount();
      toast.success("Account deleted successfully");
      await logout();
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const imageSrc =
    previewUrl ||
    (user?.image && user.image.length > 2
      ? `http://localhost:4000/uploads/images/${user.image}`
      : user?.profilePicture || "");

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className='flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900'>
      <Icon className='w-5 h-5 text-gray-500' />
      <div>
        <p className='text-sm font-medium text-gray-500'>{label}</p>
        <p className='text-sm font-semibold'>{value || "Not set"}</p>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[600px] max-h-[90vh] p-0 gap-0 bg-white dark:bg-gray-950'>
          <DialogHeader className='p-6 pb-2'>
            <DialogTitle className='text-2xl font-bold'>
              Profile Settings
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <div className='px-6'>
              <TabsList className='w-full'>
                <TabsTrigger value='overview' className='flex-1'>
                  Overview
                </TabsTrigger>
                <TabsTrigger value='edit' className='flex-1'>
                  Edit Profile
                </TabsTrigger>
                <TabsTrigger value='settings' className='flex-1'>
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className='h-[calc(90vh-180px)] px-6 py-4'>
              <TabsContent value='overview' className='mt-0'>
                <div className='space-y-6'>
                  <div className='flex flex-col items-center'>
                    <Avatar className='w-32 h-32 mb-4'>
                      <AvatarImage
                        src={imageSrc}
                        alt='Profile'
                        className='object-cover'
                      />
                      <AvatarFallback className='text-2xl bg-gradient-to-br from-blue-500 to-purple-500'>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className='text-2xl font-bold'>
                      {user?.name || "No Name"}
                    </h2>
                    <p className='text-gray-500'>{user?.email}</p>
                    <p className='text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full mt-2'>
                      {user?.role || "User"}
                    </p>
                  </div>

                  <Separator />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <InfoField icon={Mail} label='Email' value={user?.email} />
                    <InfoField icon={Phone} label='Phone' value={user?.phone} />
                    <InfoField
                      icon={MapPin}
                      label='Address'
                      value={user?.address}
                    />
                    <InfoField
                      icon={Globe2}
                      label='Country'
                      value={user?.country}
                    />
                    <InfoField
                      icon={UserCircle2}
                      label='Gender'
                      value={user?.gender}
                    />
                    <InfoField
                      icon={Calendar}
                      label='Date of Birth'
                      value={
                        user?.dateOfBirth
                          ? new Date(user.dateOfBirth).toLocaleDateString()
                          : null
                      }
                    />
                  </div>

                  <div className='flex justify-end space-x-3 pt-4'>
                    <Button
                      variant='outline'
                      onClick={handleEditClick}
                      disabled={isLoading}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='edit' className='mt-0'>
                <form onSubmit={handleSave} className='space-y-6'>
                  <div className='flex flex-col items-center'>
                    <div className='relative'>
                      <Avatar className='w-32 h-32'>
                        <AvatarImage
                          src={previewUrl || imageSrc}
                          alt='Profile'
                          className='object-cover'
                        />
                        <AvatarFallback className='text-2xl bg-gradient-to-br from-blue-500 to-purple-500'>
                          {formData?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor='profilePicture'
                        className='absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                      >
                        <Camera className='w-5 h-5' />
                        <input
                          id='profilePicture'
                          type='file'
                          accept='image/*'
                          onChange={handleFileChange}
                          className='hidden'
                        />
                      </label>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Full Name</Label>
                      <Input
                        id='name'
                        name='name'
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        placeholder='Enter your full name'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        name='email'
                        value={user?.email || ""}
                        disabled
                        className='bg-gray-50'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Phone Number</Label>
                      <Input
                        id='phone'
                        name='phone'
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        placeholder='Enter your phone number'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='country'>Country</Label>
                      <Input
                        id='country'
                        name='country'
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        placeholder='Enter your country'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='address'>Address</Label>
                      <Input
                        id='address'
                        name='address'
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        placeholder='Enter your address'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='gender'>Gender</Label>
                      <Input
                        id='gender'
                        name='gender'
                        value={formData.gender || ""}
                        onChange={handleInputChange}
                        placeholder='Enter your gender'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                      <Input
                        id='dateOfBirth'
                        name='dateOfBirth'
                        type='date'
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

                  <div className='flex justify-end space-x-3 pt-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setIsEditing(false);
                        setActiveTab("overview");
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type='submit' disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value='settings' className='mt-0'>
                <div className='space-y-6'>
                  <div className='p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900/20'>
                    <div className='flex items-center space-x-3'>
                      <AlertTriangle className='w-5 h-5 text-red-600 dark:text-red-400' />
                      <h3 className='text-lg font-semibold text-red-600 dark:text-red-400'>
                        Danger Zone
                      </h3>
                    </div>
                    <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                      Once you delete your account, there is no going back. This
                      will permanently delete your account and remove your data
                      from our servers.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='destructive'
                          className='mt-4'
                          disabled={isLoading}
                        >
                          <Trash2 className='w-4 h-4 mr-2' />
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
                            className='bg-red-600 hover:bg-red-700 text-white'
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
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
    </>
  );
};

export default ProfileModal;
