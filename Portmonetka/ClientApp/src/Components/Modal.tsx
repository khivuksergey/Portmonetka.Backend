import { Modal as BModal } from "react-bootstrap";

interface ModalProps {
    title: React.ReactNode
    size?: "sm" | "lg" | "xl" | undefined
    show: boolean
    backdrop?: boolean | "static" | undefined
    fullscreen?: true | string
    onClose: () => void
    children: React.ReactNode
    contentClassName: string
}

function Modal({ title, size, show, fullscreen, backdrop, onClose, children, contentClassName }: ModalProps) {
    return (
        <BModal
            show={show}
            onHide={onClose}
            contentClassName={contentClassName}
            fullscreen={fullscreen}
            backdrop={backdrop ?? true}
            size={size}
        >
            <BModal.Header>
                <BModal.Title>
                    {title}
                </BModal.Title>
            </BModal.Header>
            <BModal.Body>
                {children}
            </BModal.Body>
        </BModal>
    )
}

export default Modal;