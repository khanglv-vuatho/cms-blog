import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ToastComponent = ({
  message,
  position,
  autoClose,
  hideProgressBar,
  closeOnClick,
  pauseOnHover,
  draggable,
  type = 'default',
}: {
  message: string
  position?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
  autoClose?: number
  hideProgressBar?: boolean
  closeOnClick?: boolean
  pauseOnHover?: boolean
  draggable?: boolean
  type?: 'info' | 'success' | 'warning' | 'error' | 'default'
  propsStyleBtn?: any
}) => {
  toast(message, {
    position: position || 'top-right',
    autoClose: autoClose || 2000,
    hideProgressBar: hideProgressBar || false,
    closeOnClick: closeOnClick || true,
    pauseOnHover: pauseOnHover || true,
    draggable: draggable || true,
    progress: undefined,
    type: type,
  })
}
