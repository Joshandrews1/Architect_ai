"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { initializeFirebase } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

export function FileUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!user || !file) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload a file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { storage, firestore } = initializeFirebase();
      const storageRef = ref(storage, `users/${user.uid}/${file.name}`);
      
      toast({
        title: "Uploading File",
        description: "Your file is being uploaded. Please wait.",
      });

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(firestore, "files"), {
        uid: user.uid,
        name: file.name,
        url: downloadURL,
        createdAt: serverTimestamp(),
      });

      setFile(null);
      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded and saved.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input type="file" onChange={handleFileChange} disabled={uploading} />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  );
}
