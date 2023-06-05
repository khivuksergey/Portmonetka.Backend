import { useEffect, useRef } from "react";

interface PopperProps {
    open: boolean
    setOpen: any
    popper: any
    setPopperElement: any
    children: React.ReactNode
}

export default function Popper({ open, setOpen, popper, setPopperElement, children }: PopperProps) {
    //const popperRef = useRef<HTMLElement | null>(null);

    //useEffect(() => {
    //    const handleEscKey = (event: KeyboardEvent) => {
    //        if (event.key === 'Escape') {
    //            setOpen(false);
    //        }
    //    };

    //    const handleClickOutside = (event: MouseEvent) => {
    //        if (popperRef.current && !popperRef.current.contains(event.target as Node)) {
    //            setOpen(false);
    //        }
    //    };

    //    document.addEventListener('keydown', handleEscKey);
    //    document.addEventListener('click', handleClickOutside);

    //    return () => {
    //        document.removeEventListener('keydown', handleEscKey);
    //        document.removeEventListener('click', handleClickOutside);
    //    };
    //}, [setOpen]);

    return (
        open ? (
            <div
                tabIndex={-1}
                style={popper.styles.popper}
                className="popper"
                {...popper.attributes.popper}
                ref={setPopperElement
                //(element) => {
                        //popperRef.current = element;
                    //setPopperElement(element);
                }
                role="dialog"
            >
                {children}
            </div>
        )
            : null
    )
}