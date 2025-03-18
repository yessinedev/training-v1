import { useEffect, useState } from "react";

import QRCode from "qrcode";

export const useQR = (id: string) => {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async (id: string) => {
      try {
        const qrData = `https://training-center25.netlify.app/verify/${id}`;

        const url = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          errorCorrectionLevel: "H",
        });
        setQrUrl(url);
      } catch (err) {
        console.error("QR Code generation error:", err);
        return "";
      }
    };
    generateQR(id);
  }, [id]);

  return qrUrl;
};
