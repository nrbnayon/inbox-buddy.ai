import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GooglePermissions from "../illustrations/GooglePermissions";
import MicrosoftPermissions from "../illustrations/MicrosoftPermissions";

export default function PermissionModal({
  isOpen,
  onClose,
  provider,
  onContinue,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grant Permissions</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Click to grant the permissions
          </h2>
          <p className="mb-6">
            You will be asked to choose what{" "}
            {provider === "google" ? "Google" : "Microsoft"} has access to.
            Please choose Select all.
          </p>

          <div className="mb-6">
            {provider === "google" ? (
              <GooglePermissions />
            ) : (
              <MicrosoftPermissions />
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Go back
            </Button>
            <Button
              onClick={onContinue}
              className="bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] text-white hover:opacity-90"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
