import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FormLabel } from "./ui/form";

type FileInputProps = {
  accept: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileInput: React.FC<FileInputProps> = ({ accept, label, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center gap-2">
        <Input type="file" accept={accept} onChange={onChange} />
        <Button type="button" variant="outline" size="icon">
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      {/* <p className="text-sm text-muted-foreground">
        Accepted formats: {accept}
      </p> */}
    </div>
  );
};

export default FileInput;
