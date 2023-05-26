import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformalToFormalComponent } from './informal-to-formal.component';

describe('InformalToFormalComponent', () => {
  let component: InformalToFormalComponent;
  let fixture: ComponentFixture<InformalToFormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformalToFormalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InformalToFormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
