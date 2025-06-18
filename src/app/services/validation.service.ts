import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class ValidationService {

	constructor() { }

	getFieldError(control: AbstractControl | null): string | null {
		if (!control || !control.errors || !control.touched) return null;

		if (control.errors['required']) return 'Campo obbligatorio.';
		if (control.errors['email']) return 'Formato email non valido.';
		if (control.errors['minlength']) {
			const minLength = control.errors['minlength'].requiredLength;
			return `Minimo ${minLength} caratteri richiesti.`;
		}
		if (control.errors['strong']) return 'Password debole: usa almeno una maiuscola, una minuscola e un numero.';

		return null;
	}
}
