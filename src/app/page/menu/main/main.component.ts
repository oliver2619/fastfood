import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateDirective } from '../../../element/translate.directive';
import { version } from '../../../../../package.json';
import { TranslatePipe } from "../../../element/translate.pipe";
import { GameService } from '../../../service/game.service';
import { CommonModule } from '@angular/common';
import { FrameComponent } from "../../../element/frame/frame.component";
import { FrameButtonDirective } from '../../../element/frame-button.directive';

@Component({
  selector: 'ff-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, TranslateDirective, TranslatePipe, FrameComponent, FrameButtonDirective]
})
export class MainComponent {

  get canContinueGame(): boolean {
    return this.gameService.canContinue;
  }

  get version(): string {
    return version;
  }

  constructor(private readonly router: Router, private readonly gameService: GameService) { }

  continueGame() {
    this.gameService.continueGame();
    this.router.navigateByUrl('/game');
  }

  newGame() {
    this.router.navigateByUrl('/menu/newGame');
  }

  settings() {
    this.router.navigateByUrl('/menu/settings');
  }
}
