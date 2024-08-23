import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageAnalysisService } from 'src/app/services/image-analysis.service';

@Component({
  selector: 'app-image-analysis',
  templateUrl: './image-analysis.component.html',
  styleUrls: ['./image-analysis.component.scss'],
})
export class ImageAnalysisComponent implements OnInit, OnDestroy {
  analysisUuid: string;
  analysis?: any;
  analysisContent?: string;
  imageUrl: string;

  constructor(
    private imageAnalysisService: ImageAnalysisService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.analysisUuid = params.get('uuid')!;
      this.loadImageAnalysis(this.analysisUuid);
    });
  }

  loadImageAnalysis(uuid: string) {
    this.imageAnalysisService.retrieve(uuid).subscribe((res) => {
      this.analysis = res;
      this.imageUrl = res.image.url;
      this.analysisContent = res.content;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {}
}
