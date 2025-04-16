'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Plus } from "lucide-react";

interface TrainingInvoiceItem {
  trainingTitle: string;
  participants: number;
  daysCount: number;
  pricePerDay: number;
  tva: number;
}

interface TrainerInvoiceItem {
  trainingTitle: string;
  hoursCount: number;
  pricePerHour: number;
  tva: number;
}

export function CreateInvoiceDialog() {
  const [invoiceType, setInvoiceType] = useState<'training' | 'trainer'>('training');
  const [trainingItems, setTrainingItems] = useState<TrainingInvoiceItem[]>([
    { trainingTitle: '', participants: 1, daysCount: 1, pricePerDay: 0, tva: 20 }
  ]);
  const [trainerItems, setTrainerItems] = useState<TrainerInvoiceItem[]>([
    { trainingTitle: '', hoursCount: 1, pricePerHour: 0, tva: 20 }
  ]);
  const [clientInfo, setClientInfo] = useState({
    company: '',
    siret: '',
    opco: '',
    contactName: '',
    email: '',
    address: '',
    conventionNumber: ''
  });
  const [invoiceInfo, setInvoiceInfo] = useState({
    number: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    trainingPeriod: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });

  const addTrainingItem = () => {
    setTrainingItems([...trainingItems, { trainingTitle: '', participants: 1, daysCount: 1, pricePerDay: 0, tva: 20 }]);
  };

  const addTrainerItem = () => {
    setTrainerItems([...trainerItems, { trainingTitle: '', hoursCount: 1, pricePerHour: 0, tva: 20 }]);
  };

  const removeTrainingItem = (index: number) => {
    setTrainingItems(trainingItems.filter((_, i) => i !== index));
  };

  const removeTrainerItem = (index: number) => {
    setTrainerItems(trainerItems.filter((_, i) => i !== index));
  };

  const updateTrainingItem = (index: number, field: keyof TrainingInvoiceItem, value: string | number) => {
    const newItems = [...trainingItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTrainingItems(newItems);
  };

  const updateTrainerItem = (index: number, field: keyof TrainerInvoiceItem, value: string | number) => {
    const newItems = [...trainerItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTrainerItems(newItems);
  };

  const calculateTrainingItemTotal = (item: TrainingInvoiceItem) => {
    return item.participants * item.daysCount * item.pricePerDay;
  };

  const calculateTrainerItemTotal = (item: TrainerInvoiceItem) => {
    return item.hoursCount * item.pricePerHour;
  };

  const calculateSubtotal = () => {
    if (invoiceType === 'training') {
      return trainingItems.reduce((sum, item) => sum + calculateTrainingItemTotal(item), 0);
    } else {
      return trainerItems.reduce((sum, item) => sum + calculateTrainerItemTotal(item), 0);
    }
  };

  const calculateTVA = () => {
    if (invoiceType === 'training') {
      return trainingItems.reduce((sum, item) => {
        const itemTotal = calculateTrainingItemTotal(item);
        return sum + (itemTotal * (item.tva / 100));
      }, 0);
    } else {
      return trainerItems.reduce((sum, item) => {
        const itemTotal = calculateTrainerItemTotal(item);
        return sum + (itemTotal * (item.tva / 100));
      }, 0);
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTVA();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une Facture</DialogTitle>
        </DialogHeader>

        <Tabs value={invoiceType} onValueChange={(value: string) => setInvoiceType(value as 'training' | 'trainer')} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="training">Facture Centre de Formation</TabsTrigger>
            <TabsTrigger value="trainer">Facture Formateur</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations {invoiceType === 'training' ? 'Client' : 'Formateur'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">{invoiceType === 'training' ? 'Entreprise' : 'Nom du formateur'}</Label>
                <Input
                  id="company"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo({...clientInfo, company: e.target.value})}
                  placeholder={invoiceType === 'training' ? "Nom de l'entreprise" : "Nom complet du formateur"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET</Label>
                <Input
                  id="siret"
                  value={clientInfo.siret}
                  onChange={(e) => setClientInfo({...clientInfo, siret: e.target.value})}
                  placeholder="Numéro SIRET"
                />
              </div>
              {invoiceType === 'training' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="opco">OPCO</Label>
                    <Input
                      id="opco"
                      value={clientInfo.opco}
                      onChange={(e) => setClientInfo({...clientInfo, opco: e.target.value})}
                      placeholder="Nom de l'OPCO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conventionNumber">Numéro de convention</Label>
                    <Input
                      id="conventionNumber"
                      value={clientInfo.conventionNumber}
                      onChange={(e) => setClientInfo({...clientInfo, conventionNumber: e.target.value})}
                      placeholder="Numéro de la convention de formation"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact</Label>
                <Input
                  id="contactName"
                  value={clientInfo.contactName}
                  onChange={(e) => setClientInfo({...clientInfo, contactName: e.target.value})}
                  placeholder="Nom du contact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                  placeholder="Adresse complète"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails de la Facture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Numéro de Facture</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceInfo.number}
                  onChange={(e) => setInvoiceInfo({...invoiceInfo, number: e.target.value})}
                  placeholder="FAC-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">{"Date d'émission"}</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceInfo.date}
                  onChange={(e) => setInvoiceInfo({...invoiceInfo, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">{"Date d'échéance"}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceInfo.dueDate}
                  onChange={(e) => setInvoiceInfo({...invoiceInfo, dueDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodStart">Période de formation - Début</Label>
                  <Input
                    id="periodStart"
                    type="date"
                    value={invoiceInfo.trainingPeriod.start}
                    onChange={(e) => setInvoiceInfo({
                      ...invoiceInfo,
                      trainingPeriod: {...invoiceInfo.trainingPeriod, start: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodEnd">Période de formation - Fin</Label>
                  <Input
                    id="periodEnd"
                    type="date"
                    value={invoiceInfo.trainingPeriod.end}
                    onChange={(e) => setInvoiceInfo({
                      ...invoiceInfo,
                      trainingPeriod: {...invoiceInfo.trainingPeriod, end: e.target.value}
                    })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Mode de paiement</Label>
                <Select 
                  value={invoiceInfo.paymentMethod}
                  onValueChange={(value) => setInvoiceInfo({...invoiceInfo, paymentMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                    {invoiceType === 'training' && (
                      <SelectItem value="subrogation">Subrogation OPCO</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Détails des Prestations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoiceType === 'training' ? (
                // Training Center Invoice Items
                trainingItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4">
                      <Label>Intitulé de la formation</Label>
                      <Input
                        value={item.trainingTitle}
                        onChange={(e) => updateTrainingItem(index, 'trainingTitle', e.target.value)}
                        placeholder="Titre de la formation"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Participants</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.participants}
                        onChange={(e) => updateTrainingItem(index, 'participants', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Jours</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.daysCount}
                        onChange={(e) => updateTrainingItem(index, 'daysCount', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Prix/Jour (€)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.pricePerDay}
                        onChange={(e) => updateTrainingItem(index, 'pricePerDay', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label>TVA (%)</Label>
                      <Select
                        value={item.tva.toString()}
                        onValueChange={(value) => updateTrainingItem(index, 'tva', parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="TVA" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-1">
                      {trainingItems.length > 1 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeTrainingItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Trainer Invoice Items
                trainerItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5">
                      <Label>Intitulé de la formation</Label>
                      <Input
                        value={item.trainingTitle}
                        onChange={(e) => updateTrainerItem(index, 'trainingTitle', e.target.value)}
                        placeholder="Titre de la formation"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Heures</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.hoursCount}
                        onChange={(e) => updateTrainerItem(index, 'hoursCount', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label>Prix/Heure (€)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.pricePerHour}
                        onChange={(e) => updateTrainerItem(index, 'pricePerHour', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label>TVA (%)</Label>
                      <Select
                        value={item.tva.toString()}
                        onValueChange={(value) => updateTrainerItem(index, 'tva', parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="TVA" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-1">
                      {trainerItems.length > 1 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeTrainerItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              <Button 
                onClick={invoiceType === 'training' ? addTrainingItem : addTrainerItem} 
                variant="outline" 
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter une {invoiceType === 'training' ? 'formation' : 'prestation'}
              </Button>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total HT</span>
                <span>{calculateSubtotal().toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA</span>
                <span>{calculateTVA().toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total TTC</span>
                <span>{calculateTotal().toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}