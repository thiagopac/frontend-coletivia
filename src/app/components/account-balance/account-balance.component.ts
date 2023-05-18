import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-balance-component',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss'],
})
export class AccountBalanceComponent implements OnInit {
  @Input() fiatAssetValue: number;

  constructor() {}

  ngOnInit(): void {}
}
