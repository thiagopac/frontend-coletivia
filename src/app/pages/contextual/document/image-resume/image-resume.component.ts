import { FeatureService } from '../../../../services/feature.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { ImageAnalysisService } from 'src/app/services/image-analysis.service';
import { ImageService } from 'src/app/services/image.service';
import { InsufficientBalanceService } from 'src/app/services/insufficient-balance.service';

@Component({
  selector: 'app-image-resume',
  templateUrl: './image-resume.component.html',
  styleUrls: ['./image-resume.component.scss'],
})
export class ImageResumeComponent implements OnInit {
  imageUuid: string;
  image?: any;
  features?: any[];
  analyses?: any[];
  mostrarBloqueio: boolean = false;
  subBloqueio: Subscription;

  constructor(
    private imageService: ImageService,
    private imageAnalysisService: ImageAnalysisService,
    private featureService: FeatureService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertMessageService: AlertMessageService,
    private insufficientBalanceService: InsufficientBalanceService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.imageUuid = params.get('uuid')!;
      this.loadImageResources(this.imageUuid);
    });

    this.subBloqueio = this.insufficientBalanceService.bloqueio$
      .asObservable()
      .subscribe((bloqueio) => {
        this.mostrarBloqueio = bloqueio;
      });
  }

  loadImageResources(uuid: string) {
    this.imageService.retrieve(uuid).subscribe((res) => {
      this.image = res;
      this.loadAvailableFeatures();
      this.loadImageAnalyses();
    });
  }

  loadAvailableFeatures() {
    this.featureService
      .listForSuitness('image-recognition')
      .subscribe((res) => {
        this.features = res;
        this.changeDetectorRef.detectChanges();
      });
  }

  loadImageAnalyses() {
    this.imageAnalysisService.listForImage(this.imageUuid).subscribe((res) => {
      this.analyses = res;
      console.log('res: ', res);
      this.changeDetectorRef.detectChanges();
    });
  }

  analysisUsesFeature(uuid: string): any | undefined {
    return this.features!.find((obj) => obj.feature.uuid === uuid);
  }

  action(feature: any) {
    this.confirmAnalyze(feature);
  }

  gotoAnalysis(analysis: any) {
    this.router.navigate(['/contextual/image/analysis/', analysis.uuid]);
  }

  confirmAnalyze(feature: any): void {
    this.alertMessageService.alertWithHandler(
      `Analisar a imagem utilizando <strong>${feature.name}</strong>?`,
      'question',
      () => this.analyze(feature),
      true
    );
  }

  analyze(feature: any) {
    if (this.mostrarBloqueio) {
      this.alertMessageService.insufficientBalanceAlert();
    } else {
      this.imageAnalysisService
        .analyze(this.imageUuid, feature.uuid)
        .subscribe((res) => {
          this.router.navigate(['/contextual/image/analysis/', res.uuid]);
        });
    }
  }
}
