import { toast, ToastOptions } from 'react-toastify'

export enum NOTIFICATION_TYPE {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

const defaultToastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  style: { width: '100%' },
}

export const notify = (type: NOTIFICATION_TYPE, message: string, options: Partial<ToastOptions> = {}) => {
  if (type === NOTIFICATION_TYPE.ERROR) {
    toast.error(message, { ...defaultToastOptions, ...options })
  } else if (type === NOTIFICATION_TYPE.SUCCESS) {
    toast.success(message, { ...defaultToastOptions, ...options })
  } else if (type === NOTIFICATION_TYPE.INFO) {
    toast.info(message, { ...defaultToastOptions, ...options })
  }
}
