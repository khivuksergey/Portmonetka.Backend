import { MdConstruction } from "react-icons/md";

interface PageUnderConstructionProps {
    page: string
}

export default function PageUnderConstruction({ page }: PageUnderConstructionProps) {
    const message = `Sorry, ${page} page is currently under construction`;

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <MdConstruction
                size={128}
                fill="var(--placeholder-gray)"
                className="mb-4"
            />
            <h3
                style={{
                    color: "var(--placeholder-gray",
                    textAlign: "center"
                }}
            >
                {message}
            </h3>
        </div>
    )
}