interface PopperProps {
    open: boolean
    setOpen: any
    popper: any
    setPopperElement: any
    children: React.ReactNode
}

export default function Popper({ open, setOpen, popper, setPopperElement, children }: PopperProps) {
    return (
        open ? (
            <div
                tabIndex={-1}
                style={popper.styles.popper}
                className="popper"
                {...popper.attributes.popper}
                ref={setPopperElement}
                role="dialog"
            >
                {children}
            </div>
        )
            : null
    )
}