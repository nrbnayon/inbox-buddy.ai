"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const InputOTPForm = ({ onComplete, disabled = false, className }) => {
  const [pin, setPin] = React.useState("");

  React.useEffect(() => {
    if (pin.length === 6) {
      onComplete(pin);
    }
  }, [pin, onComplete]);

  return (
    <div className={cn("space-y-6", className)}>
      <InputOTP
        maxLength={6}
        disabled={disabled}
        value={pin}
        onChange={(value) => setPin(value)}
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export { InputOTPForm };
