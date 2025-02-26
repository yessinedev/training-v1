import { Attestation } from "@/types";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    width: "297mm", // A4 width in landscape
    height: "210mm", // A4 height in landscape
    padding: "10mm",
  },
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    position: "absolute",
    top: "38%",
    width: "100%",
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
  themeText: {
    marginBottom: 10,
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
    wordBreak: "break-word",
  },
  bold: {
    fontSize: 16,
    fontWeight: "extrabold",
  },
  bottomSection: {
    position: "absolute",
    bottom: "35mm",
    right: "10mm",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  qrCode: {
    width: "25mm",
    height: "25mm",
  },
  footer: {
    textAlign: "right",
    marginRight: "10mm",
  },
  footerText: {
    fontSize: 12,
    marginBottom: "5mm",
  },
});

const AttestationPDF = ({
  attestation,
  qrUrl,
}: {
  attestation: Attestation;
  qrUrl: string;
}) => {
  const formatDate = (isoString: Date): string => {
    return ` ${format(isoString, "dd/MM/yyyy")} `;
  };
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        <Image src="/image1.png" style={styles.background} />
        <View style={styles.content}>
          <Text style={styles.text}>
            Le cabinet de formation continue STAT + TRAINING atteste par la
            présente que :
          </Text>
          <Text style={[styles.text, styles.bold]}>
            {attestation.participant?.nom} {attestation.participant?.prenom} (
            {attestation.participant?.entreprise})
          </Text>
          <Text style={styles.text}>a participé au séminaire</Text>
          <Text style={[styles.text, styles.themeText]}>
            {attestation.action?.theme?.libelle_theme}
          </Text>
          <Text style={styles.text}>
            organisé à {attestation.action?.lieu} de
            {attestation.action?.date_debut
              ? formatDate(attestation.action.date_debut)
              : "N/A"}
            à{attestation.action?.date_fin ? formatDate(attestation.action.date_fin): "N/A"}
          </Text>
          <Text style={[styles.text, { fontStyle: "italic" }]}>
            Cette attestation est délivrée à l&apos;intéressé pour servir et
            valoir ce que de droit.
          </Text>
        </View>
        <View style={styles.bottomSection}>
          <Image src={qrUrl} style={styles.qrCode} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remis en main propres</Text>
            <Text style={styles.footerText}>
              à {attestation.action?.lieu}, le{" "}
              {formatDate(attestation.date_emission as Date)}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default AttestationPDF;
