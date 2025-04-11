import { toast } from "sonner";

export const showErrorToast = (errorMessage: string) => toast.error(errorMessage, {
  position: 'top-right',
});