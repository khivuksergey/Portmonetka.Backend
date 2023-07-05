import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";

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
                <Button type="reset" className="btn-dark" onClick={onReset}>
                    {resetText ?? "Cancel"}
                </Button>
                :
                null
            }

            <Button type="submit" className="btn-dark">
                {submitText ?? "Save"}
            </Button>
        </div>
    )
}