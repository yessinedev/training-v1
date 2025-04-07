import React from 'react'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileIcon, UserIcon, PhoneIcon, MailIcon, CalendarIcon } from 'lucide-react';
import { Formateur } from '@/types';
import { Avatar, AvatarFallback } from '../ui/avatar';
type Props = {
    formateur: Formateur
}

const FormateurProfile = ({formateur}: Props) => {
  return (
    <Dialog>
                
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Profil du formateur</DialogTitle>
                  </DialogHeader>
                  
                  {formateur && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-lg">
                            {formateur.user.prenom[0]}
                            {formateur.user.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-2xl font-bold">
                            {formateur.user.prenom} {formateur.user.nom}
                          </h3>
                          <p className="text-muted-foreground">
                            {formateur.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formateur.files.map((file) => (
                            <a
                              key={file.file_id}
                              href={file.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent"
                            >
                              <FileIcon className="h-5 w-5" />
                              <span>{file.type}</span>
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Séances</h4>
                        {/* <div className="space-y-3">
                          {mockSeances
                            .filter((seance) => seance.formateur_id === formateur.user_id)
                            .map((seance) => (
                              <div
                                key={seance.seance_id}
                                className="flex items-center justify-between p-3 rounded-lg border"
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-5 w-5" />
                                  <span>
                                    {new Date(seance.date).toLocaleDateString()} à {seance.heure}
                                  </span>
                                </div>
                                <Badge
                                  variant={
                                    seance.statut === 'TERMINEE'
                                      ? 'default'
                                      : seance.statut === 'EN_ATTENTE'
                                      ? 'secondary'
                                      : 'destructive'
                                  }
                                >
                                  {seance.statut}
                                </Badge>
                              </div>
                            ))}
                        </div> */}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
  )
}

export default FormateurProfile