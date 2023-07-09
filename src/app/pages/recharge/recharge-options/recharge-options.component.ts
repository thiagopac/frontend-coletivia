import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RechargeService } from 'src/app/services/recharge.service';

@Component({
  selector: 'app-recharge-options',
  templateUrl: './recharge-options.component.html',
  styleUrls: ['./recharge-options.component.scss'],
})
export class RechargeOptionsComponent implements OnInit {
  items$: Observable<any[]>;
  selectedOption: any;
  constructor(
    private rechargeService: RechargeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listOptions();
  }

  listOptions() {
    this.items$ = this.rechargeService.listOptions();
  }

  selectValue(option: any) {
    this.selectedOption = option;
  }

  checkout() {
    this.rechargeService.checkout(this.selectedOption.uuid).subscribe((res) => {
      this.router.navigate(['/recharge/checkout-pix', res.uuid]);
    });
  }
}
