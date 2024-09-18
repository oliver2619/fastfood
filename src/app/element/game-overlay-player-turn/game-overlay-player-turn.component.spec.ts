import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverlayPlayerTurnComponent } from './game-overlay-player-turn.component';

describe('GameOverlayPlayerTurnComponent', () => {
  let component: GameOverlayPlayerTurnComponent;
  let fixture: ComponentFixture<GameOverlayPlayerTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverlayPlayerTurnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOverlayPlayerTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
