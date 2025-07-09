import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordValidator } from '../../validators/password.validator';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../services/validation.service';

@Component({
	selector: 'app-login',
	imports: [CommonModule, CardModule, RouterLink, ReactiveFormsModule, ButtonModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {

	loginForm: FormGroup;
	private formBuilder = inject(FormBuilder);
	private router = inject(Router);

	constructor(public validationService: ValidationService) {
		this.loginForm = this.formBuilder.group({
			email: new FormControl('', [
				Validators.required,
				// Validators.email
			]),
			password: new FormControl('', [
				Validators.required,
				Validators.min(8),
				PasswordValidator.strong
			]),
		});
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			// Salva autenticazione fittizia per la navbar
			localStorage.setItem('isAuthenticated', 'true');
			localStorage.setItem('userName', this.loginForm.value.email || 'Utente');
			console.log('Login success (mock)', this.loginForm.value);
			this.router.navigate(['/home']); 
		} else {
			console.warn('Login form is invalid');
		}
	}
}
