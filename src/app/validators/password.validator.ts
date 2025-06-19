import { FormControl } from '@angular/forms';

export interface ValidationResult {
	[key: string]: boolean;
}

export class PasswordValidator {

	public static strong(control: FormControl): ValidationResult | null {
		const value = control.value;

		if (!value) return { strong: true };

		const hasNumber = /\d/.test(value);
		const hasUpper = /[A-Z]/.test(value);
		const hasLower = /[a-z]/.test(value);
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

		const valid = hasNumber && hasUpper && hasLower && hasSpecial;

		return valid ? null : { strong: true };
	}
}
