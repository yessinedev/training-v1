"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2, FileText, Send } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function InvoicePage() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    address: "",
    company: "",
  });

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Création de Devis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={clientInfo.company}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, company: e.target.value })
                }
                placeholder="Nom de l'entreprise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom du contact</Label>
              <Input
                id="name"
                value={clientInfo.name}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, name: e.target.value })
                }
                placeholder="Nom complet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clientInfo.email}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={clientInfo.address}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, address: e.target.value })
                }
                placeholder="Adresse complète"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la Formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type de Formation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presentiel">Présentiel</SelectItem>
                  <SelectItem value="distanciel">Distanciel</SelectItem>
                  <SelectItem value="hybride">Hybride</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Durée</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 jour</SelectItem>
                  <SelectItem value="2">2 jours</SelectItem>
                  <SelectItem value="3">3 jours</SelectItem>
                  <SelectItem value="5">5 jours</SelectItem>
                  <SelectItem value="10">10 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nombre de participants</Label>
              <Input
                type="number"
                min="1"
                placeholder="Nombre de participants"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Éléments du Devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
              >
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    placeholder="Description de l'élément"
                  />
                </div>
                <div>
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label>Prix unitaire (€)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button onClick={addItem} variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un élément
            </Button>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-lg font-semibold">
              Total:{" "}
              {calculateTotal().toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
            <div className="space-x-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Aperçu PDF
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Envoyer le devis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
