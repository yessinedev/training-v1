'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Formateur } from "@/types";

const formSchema = z.object({
  formateur_id: z.string().min(1, "Trainer is required"),
});

type FormValues = z.infer<typeof formSchema>;

type AssignTrainerDialogProps = {
  formationId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AssignTrainerDialog({
  formationId,
  isOpen,
  onOpenChange,
}: AssignTrainerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formateur_id: "",
    },
  });

  const { data: formateurs } = useQuery({
    queryKey: ["formateurs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/formateurs");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log(data)
      const response = await axiosInstance.post(`/formations/${formationId}/formateurs`, {
        formateur_id: parseInt(data.formateur_id),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formation", formationId] });
      toast.success("Trainer assigned successfully");
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign trainer: ${error.message}`);
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
          <DialogTitle>Assign Trainer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="formateur_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trainer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formateurs?.map((formateur: Formateur) => (
                        <SelectItem
                          key={formateur.formateur_id}
                          value={formateur.formateur_id.toString()}
                        >
                          {formateur.user.prenom} {formateur.user.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Assigning..." : "Assign Trainer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}