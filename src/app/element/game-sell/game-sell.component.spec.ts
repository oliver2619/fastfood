import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSellComponent } from './game-sell.component';

describe('GameSellComponent', () => {
  let component: GameSellComponent;
  let fixture: ComponentFixture<GameSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
