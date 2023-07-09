import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { InstagramService } from 'src/app/services/instagram.service';

@Component({
  selector: 'app-instagram-generate',
  templateUrl: './instagram-generate.component.html',
  styleUrls: ['./instagram-generate.component.scss'],
})
export class InstagramGenerateComponent implements OnInit, AfterViewInit {
  fgPage1: FormGroup;
  fgPage2: FormGroup;
  fgPage3: FormGroup;
  fgPage4: FormGroup;
  generationUuid: string;
  midjourneyImageGeneration?: any;
  instagramPost: any;
  public fullSizeImageUrl: SafeUrl | undefined;

  @ViewChild(MatStepper) stepper: MatStepper;
  @ViewChild('postElement', { static: false }) postElement: Element;
  @ViewChild('textareaPrompt', { read: ElementRef })
  textareaPrompt: ElementRef<HTMLTextAreaElement>;
  @ViewChild('textareaResult', { read: ElementRef })
  textareaResult: ElementRef<HTMLTextAreaElement>;
  @ViewChild('textareaImagine', { read: ElementRef })
  textareaImagine: ElementRef<HTMLTextAreaElement>;

  constructor(
    private formBuilder: FormBuilder,
    private instagramService: InstagramService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.fgPage1 = this.formBuilder.group({
      prompt: ['', [Validators.required, Validators.minLength(50)]],
    });
    this.fgPage2 = this.formBuilder.group({
      text: ['', Validators.required],
    });
    this.fgPage3 = this.formBuilder.group({
      imagine: ['', Validators.required],
      translate: [true, Validators.required],
      postType: ['square', Validators.required],
    });
    this.fgPage4 = this.formBuilder.group({
      upscale: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = () => 'number';
  }

  validateForm(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  getTextareaHeight(element: ElementRef<HTMLTextAreaElement>): string {
    element.nativeElement.style.height = '100px';
    const scrollHeight = element.nativeElement.scrollHeight;
    return `${scrollHeight}px`;
  }

  setTextareaHeight(element: string) {
    let textarea: ElementRef<HTMLTextAreaElement>;

    switch (element) {
      case 'textareaPrompt':
        textarea = this.textareaPrompt;
        break;
      case 'textareaResult':
        textarea = this.textareaResult;
        break;
      case 'textareaImagine':
        textarea = this.textareaImagine;
        break;
      default:
        return;
    }

    textarea.nativeElement.style.height = '100px';
    const scrollHeight = textarea.nativeElement.scrollHeight;
    textarea.nativeElement.style.height = `${scrollHeight}px`;
  }

  handleError(errorMessage: string, error: any): void {
    console.error(errorMessage, error);
  }

  updatePostType(type: string): void {
    this.fgPage3.controls.postType.setValue(type);
  }

  sendPage1(): void {
    this.validateForm(this.fgPage1);
    if (this.fgPage1.invalid) {
      return;
    }

    this.instagramService
      .createInstagramPost()
      .pipe(
        switchMap((res: any) => {
          this.generationUuid = res.uuid;
          return this.instagramService.generateTextInstagramPost(
            this.generationUuid,
            this.fgPage1.controls.prompt.value!
          );
        }),
        catchError((error) => {
          this.handleError(
            'Ocorreu um erro ao gerar o texto do post do Instagram:',
            error
          );
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.fgPage2.controls.text.setValue(res.aiWriting.text);
          this.setTextareaHeight('textareaResult');
          this.stepper.next();
        }
      });
  }

  sendPage2(): void {
    this.validateForm(this.fgPage2);
    if (this.fgPage2.invalid) {
      return;
    }

    this.instagramService
      .generateTextImagineInstagramPost(
        this.generationUuid,
        this.fgPage2.controls.text.value!
      )
      .pipe(
        catchError((error) => {
          this.handleError(
            'Ocorreu um erro ao gerar o texto para descrição da imagem:',
            error
          );
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.fgPage3.controls.imagine.setValue(res.imagine);
          this.setTextareaHeight('textareaImagine');
          this.stepper.next();
        }
      });
  }

  sendPage3(): void {
    this.validateForm(this.fgPage3);
    if (this.fgPage3.invalid) {
      return;
    }

    this.instagramService
      .generateImageInstagramPost(
        this.generationUuid,
        this.fgPage3.controls.imagine.value!,
        this.fgPage3.controls.translate.value!,
        this.fgPage3.controls.postType.value!
      )
      .pipe(
        catchError((error) => {
          this.handleError(
            'Ocorreu um erro ao gerar a imagem do post do Instagram:',
            error
          );
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.midjourneyImageGeneration = res.midjourneyImageGeneration;
          this.retrieveInstagramPost();
          this.stepper.next();
        }
      });
  }

  sendPage4(): void {
    this.validateForm(this.fgPage4);
    if (this.fgPage4.invalid) {
      return;
    }

    this.retrieveInstagramPost();
    this.stepper.next();
  }

  finish(): void {
    this.router.navigate(['/contextual/instagram/list']);
  }

  regenerate(): void {
    this.validateForm(this.fgPage1);
    if (this.fgPage1.invalid) {
      return;
    }

    this.instagramService
      .generateTextInstagramPost(
        this.generationUuid,
        this.fgPage1.controls.prompt.value!
      )
      .pipe(
        catchError((error) => {
          this.handleError(
            'Ocorreu um erro ao gerar o texto do post do Instagram:',
            error
          );
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.fgPage2.controls.text.setValue(res.aiWriting.text);
          this.setTextareaHeight('textareaResult');
        }
      });
  }

  retrieveInstagramPost(): void {
    this.instagramService
      .retrieveInstagramPost(this.generationUuid!)
      .pipe(
        catchError((error) => {
          this.handleError(
            'Ocorreu um erro ao recuperar o post do Instagram:',
            error
          );
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.instagramPost = res;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  confirmUpscale(option: number, index: number): void {
    if (confirm(`Criar versão em alta resolução da opção ${index}?`)) {
      this.upscale(option, index);
    }
  }

  upscale(option: number, index: number): void {
    this.instagramService
      .upscaleImageInstagramPost(this.generationUuid!, option, index)
      .pipe(
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.fgPage4.controls.upscale.setValue(true);
          this.midjourneyImageGeneration = res.midjourneyImageGeneration;
          this.changeDetectorRef.detectChanges();
          const element = document.getElementById('hd-images');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
  }

  showFullSizeImage(url: string): void {
    this.fullSizeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }

  closeFullSizeImage(): void {
    this.fullSizeImageUrl = undefined;
  }
}
