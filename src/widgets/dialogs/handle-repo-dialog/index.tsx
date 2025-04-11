import { FC, memo, useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../shared/components/rhf/input";
import Combobox from "../../../shared/components/rhf/combobox";
import { Button } from "@/shared/components/ui/button";
import { LoadingStages } from "@/shared/types";
import { RepoDialogType } from "./constants";
import useRepos from "@/entities/repos/hooks/useRepos";
import { RequestError } from "octokit";
import { showErrorToast } from "@/shared/toasts/show-error-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  visibility: z.enum(["public", "private"]),
});

type FormData = z.infer<typeof schema>;

interface MutualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditRepoDialogProps extends MutualProps {
  type: RepoDialogType.edit;
  repo: FormData & {
    repo: string;
  };
  onEdit: () => void;
}

interface CreateRepoDialogProps extends MutualProps {
  type: RepoDialogType.create;
  onCreate: () => void;
}

interface ViewRepoDialogProps extends MutualProps {
  type: RepoDialogType.view;
  repo: FormData;
}

type HandleRepoDialogProps =
  | EditRepoDialogProps
  | CreateRepoDialogProps
  | ViewRepoDialogProps;

const HandleRepoDialog: FC<HandleRepoDialogProps> = (props) => {
  const { thunks } = useRepos();
  const [stage, setStage] = useState<LoadingStages>("idle");

  const defaultValues = useMemo(() => {
    switch (props.type) {
      case RepoDialogType.view:
      case RepoDialogType.edit: {
        const repo = props.repo;
        return {
          name: repo.name,
          description: repo.description,
          visibility: repo.visibility,
        };
      }
      default: {
        return {
          name: "",
          description: "",
          visibility: "public" as "public" | "private",
        };
      }
    }
  }, [props]);

  const form = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const heading = useMemo(() => {
    switch (props.type) {
      case RepoDialogType.view:
        return "View";
      case RepoDialogType.create:
        return "Create";
      case RepoDialogType.edit:
        return "Edit";
    }
  }, [props.type]);

  const onSubmit = useCallback(
    async (draft: FormData) => {
      if (props.type === RepoDialogType.view) {
        return;
      }
      setStage("loading");
      switch (props.type) {
        case RepoDialogType.create:
          try {
            await thunks.createRepo(draft).unwrap();
          } catch (error) {
            if (error instanceof RequestError) {
              const errorMessage = error.message || "Something went wrong";
              showErrorToast(errorMessage);
              setStage("error");
              return;
            }
          }
          props.onCreate();
          break;
        case RepoDialogType.edit: {
          try {
            await thunks.editRepo({ ...draft, repo: props.repo.repo }).unwrap();
          } catch (error) {
            if (error instanceof RequestError) {
              const errorMessage = error.message || "Something went wrong";
              showErrorToast(errorMessage);
              setStage("error");
              return;
            }
          }
          props.onEdit();
          break;
        }
        default: {
          throw new Error("Unknown type");
        }
      }
      setStage("success");
    },
    [props, thunks]
  );

  const isViewMode = useMemo(
    () => props.type === RepoDialogType.view,
    [props.type]
  );

  const content = useMemo(() => {
    switch (stage) {
      case "error": {
        return <div>Oops something went wrong</div>;
      }
      case "idle":
        return (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <Input
                disabled={isViewMode}
                name="name"
                type="text"
                placeholder="Name"
              />
              <Input
                disabled={isViewMode}
                name="description"
                type="text"
                placeholder="Description"
              />
              <Combobox
                disabled={isViewMode}
                name={"visibility"}
                options={[
                  { value: "public", label: "Public" },
                  { value: "private", label: "Private" },
                ]}
              />
              <Button disabled={isViewMode} type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </FormProvider>
        );
      case "loading":
        return <div>Loading...</div>;
      case "success":
        return <div>Success</div>;
      default:
        throw new Error("Unknown stage");
    }
  }, [form, isViewMode, onSubmit, stage]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{heading} Repo</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default memo(HandleRepoDialog);
