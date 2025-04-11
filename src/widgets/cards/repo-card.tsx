import { FC, memo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import ConfirmDangerDialog from "@/widgets/dialogs/confirm-danger-dialog";
import { Repo } from "@/entities/repos/model/slice";
import HandleRepoDialog from "../dialogs/handle-repo-dialog";
import { RepoDialogType } from "../dialogs/handle-repo-dialog/constants";
import { Eye, EyeClosed, ScanEye } from "lucide-react";

interface RepoCardProps {
  repo: Repo;
  onChangeRepo: () => void;
  handleDeleteRepo: () => void;
}

const RepoCard: FC<RepoCardProps> = ({
  repo,
  onChangeRepo,
  handleDeleteRepo,
}) => {
  const [isEditDialogOpened, setIsEditDialogOpened] = useState(false);
  const [isViewDialogOpened, setIsViewDialogOpened] = useState(false);
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false);

  return (
    <>
      {isViewDialogOpened && (
        <HandleRepoDialog
          open={isViewDialogOpened}
          onOpenChange={setIsViewDialogOpened}
          type={RepoDialogType.view}
          repo={{
            description: repo.description || "",
            name: repo.name,
            visibility: repo.visibility as "public" | "private",
          }}
        />
      )}
      {isEditDialogOpened && (
        <HandleRepoDialog
          open={isEditDialogOpened}
          onOpenChange={setIsEditDialogOpened}
          onEdit={onChangeRepo}
          type={RepoDialogType.edit}
          repo={{
            description: repo.description || "",
            name: repo.name,
            visibility: repo.visibility as "public" | "private",
            repo: repo.name,
          }}
        />
      )}
      {isDeleteDialogOpened && (
        <ConfirmDangerDialog
          open={isDeleteDialogOpened}
          onOpenChange={setIsDeleteDialogOpened}
          onConfirm={handleDeleteRepo}
        />
      )}
      <Card className="w-full h-full">
        <CardHeader className="flex items-center justify-between gap-x-3">
          <div className="flex items-center gap-x-3">
            {repo.visibility === "public" ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeClosed className="w-5 h-5" />
            )}
            <CardTitle className="line-clamp-1">{repo.name}</CardTitle>
          </div>
          <Button onClick={() => setIsViewDialogOpened(true)}>
            <ScanEye className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="h-0 grow">
          <p className="line-clamp-3">{repo?.description}</p>
        </CardContent>
        <CardFooter className="gap-3 mt-auto">
          <CardAction className="w-full">
            <Button
              onClick={() => setIsEditDialogOpened(true)}
              className="w-full"
            >
              Edit
            </Button>
          </CardAction>
          <CardAction className="w-full">
            <Button
              onClick={() => setIsDeleteDialogOpened(true)}
              className="w-full"
              variant={"destructive"}
            >
              Delete
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </>
  );
};

export default memo(RepoCard);
