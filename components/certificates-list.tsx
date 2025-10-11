import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, QrCode } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Participant } from "@/types"

interface CertificatesListProps {
  participant: Participant
}

export function CertificatesList({ participant }: CertificatesListProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Vos certificats</h3>

      {participant?.attestations?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{"Vous n'avez pas encore reçu de certificats."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {participant?.attestations?.map((attestation) => (
            <Card key={attestation.attestation_id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{attestation?.action?.theme.libelle_theme}</CardTitle>
                <CardDescription>{attestation?.action?.theme.domaine.libelle_domaine}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Délivré le :</span>
                    <span>{attestation.date_emission ? formatDate(attestation.date_emission) : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée :</span>
                    <span>{attestation?.action?.duree_heures} heures</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lieu :</span>
                    <span>{attestation?.action?.lieu}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Button variant="outline" size="sm">
                  <QrCode className="mr-2 h-4 w-4" />
                  Voir QR
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
