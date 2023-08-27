"use client";

import React from "react";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: UploadthingEndpoint;
}
export const FileUpload: React.FunctionComponent<FileUploadProps> = ({
  value,
  onChange,
  endpoint,
}) => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="h-20 w-20 relative">
        <Image
          className="rounded-full"
          height={560}
          width={560}
          alt="Upload"
          src={value}
        />
        <button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm">
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log("File upload error", error);
      }}
    />
  );
};
