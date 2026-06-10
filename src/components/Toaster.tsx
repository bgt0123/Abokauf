import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { removeToast, selectToasts } from '../features/notifications/notificationsSlice'
import type { Toast } from '../features/notifications/notificationsSlice'
import './Toaster.css'

export function Toaster() {
    const toasts = useAppSelector(selectToasts)

    return (
        <div className="toaster" aria-live="polite">
            {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
        </div>
    )
}

function ToastItem({ toast }: { toast: Toast }) {
    const dispatch = useAppDispatch()
    const remove   = () => dispatch(removeToast(toast.id))

    useEffect(() => {
        const timer = setTimeout(remove, 3500)
        return () => clearTimeout(timer)
    }, [toast.id])

    return (
        <div className={`toast toast--${toast.type}`}>
            {toast.type === 'success'
                ? <CheckCircle2 size={18} strokeWidth={2} className="toast__icon" />
                : <AlertCircle  size={18} strokeWidth={2} className="toast__icon" />
            }
            <span className="toast__message">{toast.message}</span>
            <button type="button" className="toast__close" onClick={remove} aria-label="Schließen">
                <X size={14} strokeWidth={2.5} />
            </button>
        </div>
    )
}
