import React from "react";

export default function MicrosoftPermissions() {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#00a4ef] flex items-center justify-center text-white font-bold">
          M
        </div>
        <span className="text-gray-700">Permissions requested</span>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1" checked readOnly />
          <div>
            <div className="font-medium">Select all</div>
            <div className="text-sm text-gray-500">
              Allow all permissions below
            </div>
          </div>
        </label>

        <div className="pl-8 space-y-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked readOnly />
            <div>
              <div className="font-medium">
                Read and write access to your mail
              </div>
              <div className="text-sm text-gray-500">
                Full access to your mailbox
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked readOnly />
            <div>
              <div className="font-medium">Send mail as you</div>
              <div className="text-sm text-gray-500">
                Send mail from your account
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked readOnly />
            <div>
              <div className="font-medium">Read your profile</div>
              <div className="text-sm text-gray-500">
                View your basic profile info
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
