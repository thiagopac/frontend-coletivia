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

  replace(str: string) {
    return str.replace('_', ' ');
  }

  replaceNewLinesWithBreaks(text: string): string {
    let formattedText = text.replace(/\n/g, '<br>');

    const keywordIndex = formattedText.indexOf('Palavras-chave:');

    if (keywordIndex !== -1) {
      formattedText =
        formattedText.substring(0, keywordIndex) +
        '<p class="mt-5"><strong>' +
        formattedText.substring(keywordIndex) +
        '</strong><p>';
    }

    return formattedText;
  }
}
