import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RechargeService } from 'src/app/services/recharge.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subject, Subscription } from 'rxjs';
import { SocketIOService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-checkout-pix',
  templateUrl: './checkout-pix.component.html',
  styleUrls: ['./checkout-pix.component.scss'],
})
export class CheckoutPixComponent implements OnInit, OnDestroy {
  rechargeUuid: string;
  recharge?: any | undefined;
  clipboardUsed = false;
  leftTime: number;
  pollingSubscription: any;
  stopPolling$ = new Subject<void>();
  subCheckoutRefresh: Subscription;

  constructor(
    private rechargeService: RechargeService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private clipboard: Clipboard,
    private socketIOService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.rechargeUuid = params.get('uuid')!;
      this.retrieve();
    });

    this.subCheckoutRefresh = this.socketIOService
      .onCheckoutRefresh()
      .subscribe(() => {
        setTimeout(() => {
          this.retrieve();
        }, 2000);
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

  ngOnDestroy() {
    this.subCheckoutRefresh.unsubscribe();
  }
}
