import { Button } from "react-bootstrap";

interface SubmitButtonProps {
    onSubmit?: (event: any) => void//Promise<void>
    text: string
}
export default function SubmitButton({ onSubmit, text }: SubmitButtonProps) {
    if (!onSubmit) {
        return (
            <Button variant="primary" type="submit" size="lg">
                {text}
            </Button>
        )
    } else {
        return (
            <Button variant="primary" onSubmit={onSubmit} size="lg">
                {text}
            </Button>
        )
    }
    
}