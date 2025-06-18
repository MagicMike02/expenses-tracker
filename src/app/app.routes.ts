import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignUpComponent },
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: '**', redirectTo: '/login' }
];
