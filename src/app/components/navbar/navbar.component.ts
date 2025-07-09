import { Component, OnInit, DoCheck } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
	standalone: true,
	imports: [RouterLink, CommonModule]
})
export class NavbarComponent implements OnInit, DoCheck {
	darkMode = false;
	isAuthenticated = false; // auth fittizio
	userName = 'Utente';
	currentUrl = '';

	constructor(private router: Router) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.currentUrl = event.urlAfterRedirects;
			}
		});
	}

	ngOnInit() {
		// Legge tema salvato
		const savedTheme = localStorage.getItem('theme');
		this.darkMode = savedTheme === 'dark';
		this.setTheme();
		// auth fittizio: controlla localStorage
		this.syncAuthFromStorage();
		window.addEventListener('storage', () => this.syncAuthFromStorage());
		window.addEventListener('focus', () => this.syncAuthFromStorage());
	}

	ngDoCheck() {
		this.syncAuthFromStorage();
	}

	private syncAuthFromStorage() {
		this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
		this.userName = localStorage.getItem('userName') || 'Utente';
	}

	toggleTheme() {
		this.darkMode = !this.darkMode;
		this.setTheme();
		localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
	}

	login() {
		this.isAuthenticated = true;
		localStorage.setItem('isAuthenticated', 'true');
		localStorage.setItem('userName', this.userName);
	}

	logout() {
		this.isAuthenticated = false;
		localStorage.setItem('isAuthenticated', 'false');
		this.router.navigate(['/login']);
	}

	clearStorage() {
		localStorage.clear();
		this.isAuthenticated = false;
		this.userName = 'Utente';
	}

	private setTheme() {
		if (this.darkMode) {
			document.body.classList.add('dark-theme');
		} else {
			document.body.classList.remove('dark-theme');
		}
	}
}
