import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordValidator } from '../../validators/password.validator';
import { ValidationService } from '../../services/validation.service';

@Component({
	selector: 'app-signup',
	imports: [CommonModule, CardModule, RouterLink, ReactiveFormsModule, ButtonModule],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.css'
})
export class SignupComponent {

	signupForm: FormGroup;
	private formBuilder = inject(FormBuilder);
	private router = inject(Router);


	constructor(public validationService: ValidationService) {
		this.signupForm = this.formBuilder.group({
			username: new FormControl('', [Validators.required, Validators.minLength(3)]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
				PasswordValidator.strong
			]),
			confirmPassword: new FormControl('', Validators.required)
		}, 
		{
			validators: [this.passwordsMatchValidator]
		});
	}

	private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
		const password = group.get('password')?.value;
		const confirmPassword = group.get('confirmPassword')?.value;
		return password === confirmPassword ? null : { passwordMismatch: true };
	}

	onSubmit(): void {
		if (this.signupForm.valid) {
			console.log('Signup success (mock)', this.signupForm.value);
			this.router.navigate(['/login']); 
		} else {
			console.warn('Signup form is invalid');
		}
	}
}
