"use client";

import { FileUpload } from "@/components/file-upload";
import { UserFiles } from "@/components/user-files";

export default function StoragePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Files</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload a New File</h2>
          <FileUpload />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Uploaded Files</h2>
          <UserFiles />
        </div>
      </div>
    </div>
  );
}
