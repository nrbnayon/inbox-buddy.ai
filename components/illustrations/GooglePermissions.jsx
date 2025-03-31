import React from "react";

export default function GooglePermissions() {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          G
        </div>
        <span className="text-gray-700">Select what Google can access</span>
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
                Read, compose, send, and permanently delete all your email from
                Gmail
              </div>
              <div className="text-sm text-gray-500">
                View and manage your mail
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked readOnly />
            <div>
              <div className="font-medium">See and download your contacts</div>
              <div className="text-sm text-gray-500">View your contacts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
