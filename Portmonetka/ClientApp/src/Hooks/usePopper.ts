import { useState } from "react";
import { usePopper as useReactPopper} from "react-popper";

export default function usePopper() {
    const [popperElement, setPopperElement] = useState(null);
    const [referenceElement, setReferenceElement] = useState(null);

    const popper = useReactPopper(referenceElement, popperElement, {
        placement: "bottom-end"
    });

    return { popper, setPopperElement, referenceElement, setReferenceElement };
}

