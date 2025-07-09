import { toast as baseToast, type ToastOptions } from 'vue3-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warn' | 'default';

const defaultOptions: ToastOptions = {
  autoClose: 3000,
  pauseOnHover: true,
  position: 'top-right',
  theme: 'light',
};

const showToast = (type: ToastType, message: string, options: ToastOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };

  switch (type) {
    case 'success':
      baseToast.success(message, mergedOptions);
      break;
    case 'error':
      baseToast.error(message, mergedOptions);
      break;
    case 'info':
      baseToast.info(message, mergedOptions);
      break;
    case 'warn':
      baseToast.warn(message, mergedOptions);
      break;
    case 'default':
    default:
      baseToast(message, mergedOptions);
  }
};

export const toastService = {
  success: (msg: string, options?: ToastOptions) => showToast('success', msg, options),
  error: (msg: string, options?: ToastOptions) => showToast('error', msg, options),
  info: (msg: string, options?: ToastOptions) => showToast('info', msg, options),
  warn: (msg: string, options?: ToastOptions) => showToast('warn', msg, options),
  default: (msg: string, options?: ToastOptions) => showToast('default', msg, options),
};
