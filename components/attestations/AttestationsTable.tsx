"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, Trash2 } from "lucide-react";
import { Attestation} from "@/types";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { PreviewModal } from "./PreviewModal";
import { Document, pdf } from "@react-pdf/renderer";
import AttestationPDF from "./AttestationPDF";
import QRCode from "qrcode";

type Props = {
  actionId: number;
};

const AttestationsTable = ({ actionId }: Props) => {
  const [previewAttestation, setPreviewAttestation] =
    useState<Attestation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: certifications = [] } = useQuery({
    queryKey: ["formation-certifications", actionId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/formations/${actionId}/attestations`
      );
      return response.data;
    },
  });

  const generateQR = async (id: string) => {
    try {
      const qrData = `https://training-v1.vercel.app/verify/${id}`;

      const url = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: "H",
      });
      return url;
    } catch (err) {
      console.error("QR Code generation error:", err);
      return "";
    }
  };

  const downloadAllPDFs = async () => {
    try {
      // Generate QR codes for all participants
      const attestationsWithQR = await Promise.all(
        certifications.map(async (attestation: Attestation) => ({
          attestation,
          qrUrl: await generateQR(
            attestation.participant?.user_id as string
          ),
        }))
      );
      // Create combined PDF with all certificates
      const blob = await pdf(
        <Document>
          {attestationsWithQR.map(({ attestation, qrUrl }, index) => (
            <AttestationPDF key={index} attestation={attestation} qrUrl={qrUrl} />
          ))}
        </Document>
      ).toBlob();
      console.log("blob", blob);
      // Download combined PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attestations-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating combined PDF:", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CardTitle>Liste des attestations</CardTitle>
            </div>
            <Button
              onClick={downloadAllPDFs}
              disabled={
                isGenerating
              }
              variant="default"
              className="w-full sm:w-auto bg-blue-600/90 rounded-xl py-3 text-white hover:bg-blue-800/90"
            >
              <DownloadCloud className="w-5 h-5 mr-2" />
              {isGenerating
                ? "Génération en cours..."
                : "Télécharger toutes les attestations"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prenom</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((c: Attestation) => (
                  <TableRow key={c.participant?.user_id}>
                    <TableCell>{c.participant?.user.nom}</TableCell>
                    <TableCell>{c.participant?.user.prenom}</TableCell>
                    <TableCell>{c.participant?.user.telephone}</TableCell>
                    <TableCell>{c.participant?.entreprise}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              // onClick={() => removeTrainerMutation.mutate({
                              //   formateurId: f.formateur.formateur_id,
                              // })}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">
                                Supprimer Attestation
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer Attestation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        onClick={() => setPreviewAttestation(c)}
                        variant="ghost"
                        size="icon"
                        className="text-purple-600 hover:text-purple-900 hover:bg-purple-50"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {previewAttestation && (
        <PreviewModal
          attestation={previewAttestation}
          onClose={() => setPreviewAttestation(null)}
        />
      )}
    </>
  );
};

export default AttestationsTable;
