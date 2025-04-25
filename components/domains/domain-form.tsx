'use client';

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Domain } from "@/types";
import { createDomaine, updateDomaine } from "@/services/domaineService";

const formSchema = z.object({
  libelle_domaine: z.string()
    .min(1, "Domain name is required")
    .max(100, "Domain name must be less than 100 characters"),
});

export type FormValues = z.infer<typeof formSchema>;

type DomainFormProps = {
  domain?: Domain;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const DomainForm = ({ domain, isOpen, onClose, onOpenChange }: DomainFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!domain;
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      libelle_domaine: "",
    },
  });

  useEffect(() => {
    if (isOpen && domain) {
      form.reset({
        libelle_domaine: domain.libelle_domaine,
      });
    }
  }, [domain, isOpen, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditing && domain) {
        await updateDomaine(domain.domaine_id, data)
      } else {
        await createDomaine(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domaines"] });
      toast.success(`Domain ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to ${isEditing ? "update" : "create"} domain: ${error.message}`);
      console.error(`Error ${isEditing ? "updating" : "creating"} domain:`, error);
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Domain" : "Add New Domain"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the domain information and click the update button"
              : "Enter the domain information and click the save button"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="libelle_domaine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter domain name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DomainForm;