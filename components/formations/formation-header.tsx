'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Formation } from "@/types";

type FormationHeaderProps = {
  formation: Formation;
};

export default function FormationHeader({ formation }: FormationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/sessions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{formation.type_action}</h2>
          <p className="text-muted-foreground">{formation.theme?.libelle_theme}</p>
        </div>
      </div>
    </div>
  );
}