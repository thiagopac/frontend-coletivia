import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  calculateMenuItemCssClass(url: string): string {
    return this.checkIsActive(this.router.url, url) ? 'active' : '';
  }

  checkIsActive(currentUrl: string, menuUrl: string): boolean {
    const current = this.getCurrentUrl(currentUrl);
    return current === menuUrl || current.startsWith(menuUrl + '/');
  }

  getCurrentUrl(pathname: string): string {
    return pathname.split(/[?#]/)[0];
  }
}
