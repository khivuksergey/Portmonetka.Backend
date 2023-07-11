import { MouseEventHandler } from "react";

interface ModalFooterProps {
    children?: JSX.Element
    hasReset?: boolean
    resetText?: JSX.Element
    onReset?: MouseEventHandler<HTMLButtonElement>
    submitText?: JSX.Element | string
}
export default function ModalFooter(
    {
        children,
        hasReset,
        resetText,
        onReset,
        submitText
    }: ModalFooterProps) {
    return (
        <div className="modal-footer">

            {children ?? null}

            {(hasReset ?? true) ?
                <button type="reset" className="button--dark" onClick={onReset}>
                    {resetText ?? "Cancel"}
                </button>
                :
                null
            }

            <button type="submit" className="button--dark">
                {submitText ?? "Save"}
            </button>
        </div>
    )
}