import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RechargeService } from 'src/app/services/recharge.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-checkout-pix',
  templateUrl: './checkout-pix.component.html',
  styleUrls: ['./checkout-pix.component.scss'],
})
export class CheckoutPixComponent implements OnInit {
  rechargeUuid: string;
  recharge?: any | undefined;
  clipboardUsed = false;
  leftTime: number;

  constructor(
    private rechargeService: RechargeService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.rechargeUuid = params.get('uuid')!;
      this.retrieve();
    });
  }

  retrieve() {
    this.rechargeService.retrieve(this.rechargeUuid).subscribe((res) => {
      this.recharge = res;
      this.calculateLeftTime();
      this.changeDetectorRef.detectChanges();
    });
  }

  copyToClipboard() {
    this.clipboard.copy(this.recharge.qr_code);
    this.clipboardUsed = true;
  }

  calculateLeftTime() {
    const createdAt = new Date(this.recharge.created_at);

    const now = new Date();
    const timeDiffInSeconds = Math.floor(
      (now.getTime() - createdAt.getTime()) / 1000
    );

    this.leftTime = 1800 - timeDiffInSeconds;
  }
}
