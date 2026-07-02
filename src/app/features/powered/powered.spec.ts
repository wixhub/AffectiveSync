import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Powered } from './powered';

describe('Powered', () => {
  let component: Powered;
  let fixture: ComponentFixture<Powered>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Powered]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Powered);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
