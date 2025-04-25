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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Domain, Theme } from "@/types";
import { fetchDomaines } from "@/services/domaineService";

const formSchema = z.object({
  libelle_theme: z.string()
    .min(1, "Theme name is required")
    .max(100, "Theme name must be less than 100 characters"),
  domaine_id: z.string().min(1, "Domain is required"),
});

type FormValues = z.infer<typeof formSchema>;

type ThemeFormProps = {
  theme?: Theme;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
};

const ThemeForm = ({ theme, isOpen, onClose, onOpenChange }: ThemeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!theme;
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      libelle_theme: "",
      domaine_id: "",
    },
  });

  const { data: domains } = useQuery({
    queryKey: ["domaines"],
    queryFn: fetchDomaines,
  });

  useEffect(() => {
    if (isOpen && theme) {
      form.reset({
        libelle_theme: theme.libelle_theme,
        domaine_id: theme.domaine_id.toString(),
      });
    }
  }, [theme, isOpen, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        domaine_id: parseInt(data.domaine_id),
      };

      if (isEditing && theme) {
        const response = await axiosInstance.put(`/themes`, {
          theme_id: theme.theme_id,
          ...payload,
        });
        return response.data;
      } else {
        const response = await axiosInstance.post("/themes", payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      toast.success(`Theme ${isEditing ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to ${isEditing ? "update" : "create"} theme: ${error.message}`);
      console.error(`Error ${isEditing ? "updating" : "creating"} theme:`, error);
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
          <DialogTitle>{isEditing ? "Edit Theme" : "Add New Theme"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the theme information and click the update button"
              : "Enter the theme information and click the save button"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="libelle_theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter theme name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domaine_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {domains?.map((domain: Domain) => (
                        <SelectItem
                          key={domain.domaine_id}
                          value={domain.domaine_id.toString()}
                        >
                          {domain.libelle_domaine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default ThemeForm;