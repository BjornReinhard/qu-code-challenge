import { toastService } from '@/services/toast.service.ts';

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notifyError = (message: string, error: unknown, logToConsole = true) => {
  if (logToConsole) {
    console.error(error);
  }
  toastService.error(message);
};
