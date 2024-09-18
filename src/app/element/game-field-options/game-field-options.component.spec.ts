import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFieldOptionsComponent } from './game-field-options.component';

describe('GameFieldOptionsComponent', () => {
  let component: GameFieldOptionsComponent;
  let fixture: ComponentFixture<GameFieldOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameFieldOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameFieldOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
