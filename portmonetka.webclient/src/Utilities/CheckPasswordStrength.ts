import { PasswordStrength } from "../Common/DataTypes";

export default function CheckPasswordStrength(password: string): PasswordStrength | null {
    if (password.length === 0) return null;
    
    const minLength = 8;
    const minUpper = 1;
    const minLower = 1;
    const minDigits = 1;
    const minSpecialChars = 1;

    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-=/\\|]/;

    let strength = 0;

    if (password.length >= minLength)
        strength++;
    else
        return PasswordStrength.WEAK;

    if (password.match(upperRegex)?.length ?? 0 >= minUpper) strength++;

    if (password.match(lowerRegex)?.length ?? 0 >= minLower) strength++;

    if (password.match(digitRegex)?.length ?? 0 >= minDigits) strength++;

    if (password.match(specialCharRegex)?.length ?? 0 >= minSpecialChars) strength++;

    if (strength < 3) return PasswordStrength.WEAK;
    if (strength < 5) return PasswordStrength.MEDIUM;
    return PasswordStrength.STRONG;
}