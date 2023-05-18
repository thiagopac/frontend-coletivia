import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalToInformalComponent } from './legal-to-informal.component';

describe('LegalToInformalComponent', () => {
  let component: LegalToInformalComponent;
  let fixture: ComponentFixture<LegalToInformalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalToInformalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalToInformalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
