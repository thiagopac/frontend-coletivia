import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-wrapper',
  templateUrl: './loading-wrapper.component.html',
  styleUrls: ['./loading-wrapper.component.scss'],
})
export class LoadingWrapperComponent implements OnInit {
  loadingDots: string = '';
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.animateLoadingDots();
  }

  animateLoadingDots(): void {
    setInterval(() => {
      this.loadingDots += '.';
      if (this.loadingDots.length > 3) {
        this.loadingDots = '';
      }
      this.changeDetectorRef.detectChanges();
    }, 500);
  }
}
