import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import Input from "@/shared/components/rhf/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/entities/auth/hooks/useAuth";
import { Navigate } from "react-router";
import { Form } from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import { PATHS } from "@/app/providers/RouterProvider/paths";

const schema = z.object({
  username: z.string().min(1),
  token: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const token = import.meta.env.VITE_GITHUB_TOKEN || "";

const defaultValues: FormData = {
  username: "",
  token,
};

function MainPage() {
  const { thunks, stage } = useAuth();

  const form = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (draft: FormData) => {
      await thunks.login(draft);
    },
    [thunks]
  );

  const content = useMemo(() => {
    switch (stage) {
      case "loading":
      case "error":
      case "idle": {
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 w-56"
            >
              <Input
                name="username"
                type="text"
                placeholder="Your Github Username"
              />
              <Input name="token" type="text" placeholder="Your Github Token" />
              <Button
                disabled={stage === "loading"}
                className="w-full cursor-pointer"
                type="submit"
              >
                Find
              </Button>
            </form>
          </Form>
        );
      }
      case "success":
        return <Navigate to={PATHS.REPOS} />;
      default:
        return null;
    }
  }, [form, onSubmit, stage]);

  return (
    <main className="h-full flex flex-col items-center justify-center">
      {content}
    </main>
  );
}

export default MainPage;
