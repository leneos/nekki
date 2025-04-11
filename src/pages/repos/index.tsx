import useRepos from "@/entities/repos/hooks/useRepos";
import { RequestError } from "octokit";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { showErrorToast } from "@/shared/toasts/show-error-toast";
import RepoCard from "@/widgets/cards/repo-card";
import HandleRepoDialog from "@/widgets/dialogs/handle-repo-dialog";
import { RepoDialogType } from "@/widgets/dialogs/handle-repo-dialog/constants";
import ReposPagination from "./repos-pagination";
import { REPOS_PER_PAGE } from "@/entities/repos/model/thunks";

const ReposPage: FC = () => {
  const { repos, thunks, totalCount, stage, error } = useRepos();

  const [page, setPage] = useState(1);

  const loadRepos = useCallback(async () => {
    thunks.getRepos({ page });
  }, [page, thunks]);

  useEffect(() => {
    loadRepos();
  }, [loadRepos, page, thunks]);

  const [isCreateDialogOpened, setIsCreateDialogOpened] = useState(false);

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
      thunks.getRepos({ page });
    },
    [page, thunks]
  );

  const onCreate = useCallback(async () => {
    await loadRepos();
    setIsCreateDialogOpened(false);
  }, [loadRepos]);

  const content = useMemo(() => {
    switch (stage) {
      case "error":
        return <div>Error: {error}</div>;
      case "loading":
        return <div>Loading...</div>;
      case "success": {
        if (!repos?.length) {
          return (
            <div>
              <p>No repos found</p>
            </div>
          );
        }
        return (
          <>
            {isCreateDialogOpened && (
              <HandleRepoDialog
                onCreate={onCreate}
                type={RepoDialogType.create}
                onOpenChange={setIsCreateDialogOpened}
                open={isCreateDialogOpened}
              />
            )}
            <div className="">
              <ul className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] auto-rows-[240px]">
                {repos.map((item) => (
                  <li key={item.id} className="w-full h-full">
                    <RepoCard
                      repo={item}
                      handleDeleteRepo={() => handleDeleteRepo(item.name)}
                      onChangeRepo={loadRepos}
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
              <ReposPagination
                currentPage={page}
                perPage={REPOS_PER_PAGE}
                onPageChange={setPage}
                totalCount={totalCount}
              />
            </div>
          </>
        );
      }
      default:
        return null;
    }
  }, [
    error,
    handleDeleteRepo,
    isCreateDialogOpened,
    loadRepos,
    onCreate,
    page,
    repos,
    stage,
    totalCount,
  ]);

  return content;
};

export default memo(ReposPage);
