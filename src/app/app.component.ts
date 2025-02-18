import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = ':::';

  navItems: { path: string; text: string }[] = [
    { path: '/dashboard', text: 'Painel' },
    { path: '/heroes', text: 'Elementos' },
  ];

  constructor() {
    const token = localStorage.getItem('token');

    if (!token) {
      const randomToken = Math.random().toString(36).substr(-10);
      localStorage.setItem('token', randomToken);
    }
  }
}
