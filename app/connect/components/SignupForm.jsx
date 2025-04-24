"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  InboxIcon,
  Loader2,
  Mail,
  MessageCircleQuestion,
  User,
} from "lucide-react";
import Link from "next/link";
import InputField from "./InputField";
import { joinWaitingListAction } from "@/app/actions/authActions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Assuming you’re using shadcn/ui for modals
import SmallLoader from "@/components/SmallLoader";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inbox: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState({
    title: "",
    description: "",
    // status: "wait",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await joinWaitingListAction(formData);

      if (res?.entry?._id) {
        setLoading(false);
        toast.success(res?.message + " wait for approval");
        setFormData({
          name: "",
          email: "",
          inbox: "",
          description: "",
        }); // Reset the form
        setModalMessage({
          title: "Thanks for signing up!",
          description:
            "We will confirm your email shortly and send you a designated link to log in. Enjoy your new inbox buddy!",
        });
        setShowModal(true); // Show the modal
      } else {
        setLoading(false);
        setModalMessage({
          title: "Approved!",
          description: res.message,
        });
        setShowModal(true);
        // toast.info(res.message + " Wait for approval.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal when OK is clicked
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-start mb-6">
        <h1 className="text-2xl font-bold mb-2">Join the Waiting List!</h1>
        <p className="text-gray-600">
          Sign up early to receive one month - cost free!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name - Made required */}
        <InputField
          icon={User}
          name={"name"}
          type={"text"}
          placeHolder={"Name"}
          value={formData.name}
          handleChange={handleChange}
          required // Added required attribute
        />

        {/* mail - Made required */}
        <InputField
          icon={Mail}
          name={"email"}
          type={"email"}
          placeHolder={"E-mail"}
          value={formData.email}
          handleChange={handleChange}
          required // Added required attribute
        />

        {/* inbox count */}
        {/* <InputField
          icon={InboxIcon}
          name={"inbox"}
          type={"text"}
          placeHolder={"How many inboxes / apps would you like to connect?"}
          value={formData.inbox}
          handleChange={handleChange}
        /> */}

        {/* feedback */}
        <div className="relative">
          <MessageCircleQuestion className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Textarea
            name="description"
            placeholder="If we could fix one of your pain points, what would it be?"
            value={formData.description}
            onChange={handleChange}
            className="pl-10 min-h-[100px] resize-none bg-[#F2F4F7] focus-visible:ring-0"
          />
        </div>

        <div className="flex justify-center">
          <Button
            disabled={loading}
            type="submit"
            className="py-6 mt-6 px-24 w-[80%] rounded-full bg-gradient-to-r from-[#00ACDA] via-blue-400 to-[#43D4FB] hover:opacity-90 text-white relative z-10"
          >
            {loading ? (
              <>
                <SmallLoader /> Joining...
              </>
            ) : (
              "Join"
            )}
          </Button>
        </div>
      </form>

      <div className="text-center mt-4 text-sm">
        Already a member?
        <Link
          href="/login"
          className="text-[#00ACDA] hover:text-[#43D4FB] ml-1"
        >
          Login to your account
        </Link>
      </div>

      {/* Modal for success notification */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={`text-xl `}>
              {modalMessage?.title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-md text-gray-600">
            {modalMessage?.description}
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={handleModalClose}
              className="bg-[#00ACDA] hover:bg-[#00ACDA]/90 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
