import { Button } from "@/shared/components/ui/button";
import useRepos from "@/entities/repos/hooks/useRepos";
import { showErrorToast } from "@/shared/toasts/show-error-toast";
import RepoCard from "@/widgets/cards/repo-card";
import HandleRepoDialog from "@/widgets/dialogs/handle-repo-dialog";
import { RepoDialogType } from "@/widgets/dialogs/handle-repo-dialog/constants";
import { Plus } from "lucide-react";
import { RequestError } from "octokit";
import { useCallback, useEffect, useMemo, useState } from "react";

const ReposPage = () => {
  const [isCreateDialogOpened, setIsCreateDialogOpened] = useState(false);
  const { thunks, repos, stage, error } = useRepos();

  useEffect(() => {
    thunks.getRepos();
  }, [thunks]);

  const handleDeleteRepo = useCallback(
    async (name: string) => {
      try {
        await thunks.deleteRepo({ name }).unwrap();
      } catch (error) {
        if (error instanceof RequestError) {
          const errorMessage = error.message || "Something went wrong";
          showErrorToast(errorMessage);
        }
        return;
      }
      thunks.getRepos();
    },
    [thunks]
  );

  const content = useMemo(() => {
    switch (stage) {
      case "error":
        return <div>Error: {error}</div>;
      case "loading":
        return <div>Loading...</div>;
      case "success": {
        if (repos?.length) {
          return (
            <ul className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] auto-rows-[240px]">
              {repos.map((item) => (
                <li key={item.id} className="w-full h-full">
                  <RepoCard
                    repo={item}
                    handleDeleteRepo={() => handleDeleteRepo(item.name)}
                    onChangeRepo={thunks.getRepos}
                  />
                </li>
              ))}
              <li className="w-full h-full">
                <Button
                  variant="outline"
                  className="w-full h-full"
                  onClick={() => setIsCreateDialogOpened(true)}
                >
                  <Plus className="w-10 h-10" />
                </Button>
              </li>
            </ul>
          );
        }
        return (
          <div>
            <p>No repos found</p>
          </div>
        );
      }
      default:
        return null;
    }
  }, [error, handleDeleteRepo, repos, stage, thunks.getRepos]);

  return (
    <>
      {isCreateDialogOpened && (
        <HandleRepoDialog
          onCreate={thunks.getRepos}
          type={RepoDialogType.create}
          onOpenChange={setIsCreateDialogOpened}
          open={isCreateDialogOpened}
        />
      )}
      {content}
    </>
  );
};

export default ReposPage;
