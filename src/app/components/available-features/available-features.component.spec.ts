import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableFeaturesComponent } from './available-features.component';

describe('AvailableFeaturesComponent', () => {
  let component: AvailableFeaturesComponent;
  let fixture: ComponentFixture<AvailableFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableFeaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
