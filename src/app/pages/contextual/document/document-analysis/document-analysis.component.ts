import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentAnalysisService } from 'src/app/services/document-analysis.service';

@Component({
  selector: 'app-document-analysis',
  templateUrl: './document-analysis.component.html',
  styleUrls: ['./document-analysis.component.scss'],
})
export class DocumentAnalysisComponent implements OnInit {
  analysisUuid: string;
  analysis?: any;
  analysisContent?: any[];

  constructor(
    private documentAnalysisService: DocumentAnalysisService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.analysisUuid = params.get('uuid')!;
      this.loadDocumentAnalysis(this.analysisUuid);
    });
  }

  loadDocumentAnalysis(uuid: string) {
    this.documentAnalysisService.retrieve(uuid).subscribe((res) => {
      this.analysis = res;
      this.analysisContent = res.content;
      this.changeDetectorRef.detectChanges();
    });
  }
}
