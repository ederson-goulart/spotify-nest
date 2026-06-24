"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  changePasswordConfirmSchema,
  ChangePasswordConfirmSchema,
} from "@/app/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePassword } from "./action";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<ChangePasswordConfirmSchema>({
    resolver: zodResolver(changePasswordConfirmSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const handleSubmit = async (data: ChangePasswordConfirmSchema) => {
    const response = await changePassword(data);

    console.log(response);
    if (!response.success) {
      if (Array.isArray(response.errors)) {
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            form.setError(path as keyof ChangePasswordConfirmSchema, {
              message: issue.message,
            });
          });
        });
      }
    }

    if (response.success) {
      form.reset();
      toast.success(response.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      {" "}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset
                className="flex flex-col gap-4"
                disabled={form.formState.isSubmitting}
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha atual</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmação da nova senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Alterar senha</Button>
                {!!form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root?.message}
                  </FormMessage>
                )}
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
