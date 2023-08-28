"use client";
import "@uploadthing/react/styles.css";
import React from "react";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { UploadthingEndpoint } from "@/types";

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
      <div className="w-full justify-center items-center">
        <div className="h-20 w-20 relative">
          <Image
            className="rounded-full self-center"
            height={450}
            width={650}
            alt="Upload"
            src={value}
          />
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
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
