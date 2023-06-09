import { useState, useEffect } from "react";
import { usePopper as useReactPopper } from "react-popper";

export default function usePopper(setIsPopperOpen: React.Dispatch<React.SetStateAction<boolean>>) {
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

    const popper = useReactPopper(referenceElement, popperElement, {
        placement: "bottom-end"
    });

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                referenceElement &&
                popperElement &&
                !referenceElement.contains(event.target as Node) &&
                !popperElement.contains(event.target as Node)
            ) {
                setIsPopperOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [popper, referenceElement, popperElement]);

    return { popper, setPopperElement, referenceElement, setReferenceElement };
}

