import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuBarComponent } from './game-menu-bar.component';

describe('GameMenuBarComponent', () => {
  let component: GameMenuBarComponent;
  let fixture: ComponentFixture<GameMenuBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMenuBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
