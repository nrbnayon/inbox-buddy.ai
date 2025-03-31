import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addToWaitingList } from "@/lib/auth";
import { toast } from "sonner";

export default function WaitingListForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    inbox: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addToWaitingList(formData);
      toast.success("Successfully joined the waiting list!");
      setFormData({ email: "", name: "", inbox: "", description: "" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Input
          placeholder="Inbox (optional)"
          value={formData.inbox}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, inbox: e.target.value }))
          }
        />
      </div>
      <div>
        <Textarea
          placeholder="Tell us about your email management needs..."
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Join Waiting List"}
      </Button>
    </form>
  );
}
