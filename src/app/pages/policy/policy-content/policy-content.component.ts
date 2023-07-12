import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-policy-content',
  templateUrl: './policy-content.component.html',
  styleUrls: ['./policy-content.component.scss'],
})
export class PolicyContentComponent implements OnInit {
  type: string;
  policy$: Observable<any>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.url[0].path;
    console.log('type: ', this.type);
    this.policy$ = this.policyService.retrievePolicy(this.type);
  }

  replaceNewLinesWithBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
