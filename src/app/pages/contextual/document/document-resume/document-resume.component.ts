import { FeatureService } from './../../../../services/feature.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentAnalysisService } from 'src/app/services/document-analysis.service';
import { DocumentService } from 'src/app/services/document.service';
import { InsufficientBalanceService } from 'src/app/services/insufficient-balance.service';

@Component({
  selector: 'app-document-resume',
  templateUrl: './document-resume.component.html',
  styleUrls: ['./document-resume.component.scss'],
})
export class DocumentResumeComponent implements OnInit {
  documentUuid: string;
  document?: any;
  features?: any[];
  analyses?: any[];
  mostrarBloqueio: boolean = false;
  subBloqueio: Subscription;

  constructor(
    private documentService: DocumentService,
    private documentAnalysisService: DocumentAnalysisService,
    private featureService: FeatureService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertMessageService: AlertMessageService,
    private insufficientBalanceService: InsufficientBalanceService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.documentUuid = params.get('uuid')!;
      this.loadDocumentResources(this.documentUuid);
    });

    this.subBloqueio = this.insufficientBalanceService.bloqueio$
      .asObservable()
      .subscribe((bloqueio) => {
        this.mostrarBloqueio = bloqueio;
      });
  }

  loadDocumentResources(uuid: string) {
    this.documentService.retrieve(uuid).subscribe((res) => {
      this.document = res;
      this.loadAvailableFeatures();
    });
  }

  loadAvailableFeatures() {
    this.featureService
      .listFeatoresForDocument(this.documentUuid)
      .subscribe((res) => {
        this.features = res;
        this.loadDocumentAnalyses();
      });
  }

  loadDocumentAnalyses() {
    this.documentAnalysisService.list().subscribe((res) => {
      this.analyses = res;
      this.changeDetectorRef.detectChanges();
    });
  }

  AnalysisUsesFeature(uuid: string): any | undefined {
    return this.features!.find((obj) => obj.feature.uuid === uuid);
  }

  action(feature: any) {
    if (feature.analyses.length > 0) {
      this.router.navigate([
        '/contextual/document/analysis/',
        feature.analyses[0].uuid,
      ]);
    } else {
      this.confirmAnalyze(feature);
    }
  }

  confirmAnalyze(feature: any): void {
    this.alertMessageService.alertWithHandler(
      `Analisar o documento utilizando <strong>${feature.name}</strong>?`,
      'question',
      () => this.analyze(feature),
      true
    );
  }

  analyze(feature: any) {
    if (this.mostrarBloqueio) {
      this.alertMessageService.insufficientBalanceAlert();
    } else {
      this.documentAnalysisService
        .analyze(this.documentUuid, feature.uuid)
        .subscribe((res) => {
          this.router.navigate(['/contextual/document/analysis/', res.uuid]);
        });
    }
  }
}
