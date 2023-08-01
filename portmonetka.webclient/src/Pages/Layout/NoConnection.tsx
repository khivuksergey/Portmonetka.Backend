import { IconServerOff } from "../../Common/Icons";

export default function NoConnection() {
    return(
        <div className="d-flex flex-column align-items-center mt-5">
            <IconServerOff
                size={128}
                fill="transparent"
                className="mb-4"
                style={{opacity: "0.5"}}
            />
            <h3
                style={{
                    color: "var(--placeholder-grey)",
                    textAlign: "center"
                }}
            >
                Unfortunately, there are some problems with the server.<br></br>
                Please, try later.
            </h3>
        </div>
    )
}