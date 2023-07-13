import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RechargeService } from 'src/app/services/recharge.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { interval, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

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
      if (this.recharge.status !== 'paid' && this.leftTime > 0) {
        this.startPolling();
      }
    });
  }

  startPolling() {
    this.pollingSubscription = interval(10000)
      .pipe(
        switchMap(() => this.rechargeService.retrieve(this.rechargeUuid)),
        takeUntil(this.stopPolling$)
      )
      .subscribe((res) => {
        this.recharge = res;
        this.calculateLeftTime();
        this.changeDetectorRef.detectChanges();
        if (this.recharge.status === 'paid' || this.leftTime <= 0) {
          this.stopPolling();
        }
      });
  }

  stopPolling() {
    this.stopPolling$.next();
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
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
    this.stopPolling();
  }
}
