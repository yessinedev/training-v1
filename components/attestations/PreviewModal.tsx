import React from "react";
import { Document, PDFViewer } from "@react-pdf/renderer";
import { Attestation, Participant } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { useQR } from "@/hooks/useQR";
import AttestationPDF from "./AttestationPDF";

interface PreviewModalProps {
  attestation: Attestation;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
    attestation,
  onClose,
}) => {
  const qrUrl = useQR(attestation?.participant?.user_id as string);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] bg-white flex flex-col gap-2 justify-start items-center">
      <DialogHeader>
          <DialogTitle>
            Attestation de : {attestation?.participant?.user.nom} {attestation?.participant?.user.prenom}
          </DialogTitle>
        </DialogHeader>
        {qrUrl && (
          <PDFViewer width="100%" height="100%" className="mt-4">
            <Document>
              <AttestationPDF attestation={attestation} qrUrl={qrUrl} />
            </Document>
          </PDFViewer>
        )}
      </DialogContent>
    </Dialog>
  );
};
