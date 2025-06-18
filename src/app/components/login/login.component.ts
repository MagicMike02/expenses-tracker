import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
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

	constructor(public validationService: ValidationService) {
		this.loginForm = this.formBuilder.group({
			email: new FormControl('', [
				Validators.required,
				Validators.email
			]),
			password: new FormControl('', [
				Validators.required,
				Validators.min(8),
				PasswordValidator.strong
			]),
		});
	}


	submittedData: any = null;

	onSubmit(): void {

	}







}
