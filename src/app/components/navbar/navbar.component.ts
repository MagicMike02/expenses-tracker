import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	darkMode = false;

	ngOnInit() {
		// Legge tema salvato
		const savedTheme = localStorage.getItem('theme');
		this.darkMode = savedTheme === 'dark';
		this.setTheme();
	}

	toggleTheme() {
		this.darkMode = !this.darkMode;
		this.setTheme();
		localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
	}

	private setTheme() {
		if (this.darkMode) {
			document.body.classList.add('dark-theme');
		} else {
			document.body.classList.remove('dark-theme');
		}
	}
}
