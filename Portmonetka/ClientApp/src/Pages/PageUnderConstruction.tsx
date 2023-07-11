import { IconUnderConstruction } from "../Common/Icons";

interface PageUnderConstructionProps {
    page: string
}

export default function PageUnderConstruction({ page }: PageUnderConstructionProps) {
    const message = `Sorry, ${page} page is currently under construction`;

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <IconUnderConstruction
                size={128}
                fill="var(--placeholder-grey)"
                className="mb-4"
            />
            <h3
                style={{
                    color: "var(--placeholder-grey",
                    textAlign: "center"
                }}
            >
                {message}
            </h3>
        </div>
    )
}