import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { gameActionGroup, GameCreatedAction } from '../../../action/game-action-group';
import { TranslateDirective } from '../../../element/translate.directive';
import { TranslatePipe } from '../../../element/translate.pipe';
import { selectNewGameSettings, selectUsername } from '../../../selector/settings-selector';
import { GameService } from '../../../service/game.service';
import { InitialMoney } from '../../../state/initial-money';
import { PlayerAiLevel } from '../../../state/player-ai-level';
import { applicationActionGroup } from '../../../action/application-action-group';
import { TranslateService } from '../../../service/translate/translate.service';
import { FrameComponent } from "../../../element/frame/frame.component";
import { FrameButtonDirective } from '../../../element/frame-button.directive';

interface PlayerInfo {
  readonly color: string;
}

interface NewGameComponentValue {
  numberOfPlayers: string;
  initialMoney: InitialMoney;
  initialBuildings: string;
  player0: PlayerAiLevel;
  player1: PlayerAiLevel;
  player2: PlayerAiLevel;
  player3: PlayerAiLevel;
}

@Component({
    selector: 'ff-new-game',
    standalone: true,
    templateUrl: './new-game.component.html',
    styleUrl: './new-game.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, TranslateDirective, TranslatePipe, FormsModule, ReactiveFormsModule, CommonModule, FrameComponent, FrameButtonDirective]
})
export class NewGameComponent {

  readonly formGroup: FormGroup;

  readonly username = signal('');

  readonly players: ReadonlyArray<PlayerInfo> = Object.freeze([
    { color: 'red' },
    { color: 'green' },
    { color: 'yellow' },
    { color: 'blue' }
  ]);

  get canStart(): boolean {
    return this.formGroup.valid;
  }

  get numberOfPlayers(): number {
    return Number.parseInt(this.value.numberOfPlayers);
  }

  private get value(): NewGameComponentValue {
    return this.formGroup.value;
  }

  constructor(private readonly router: Router, private readonly gameService: GameService, private readonly store: Store, private readonly translateService: TranslateService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('numberOfPlayers', formBuilder.control(''));
    this.formGroup.addControl('initialMoney', formBuilder.control(''));
    this.formGroup.addControl('initialBuildings', formBuilder.control(''));
    this.formGroup.addControl('player0', formBuilder.control(''));
    this.formGroup.addControl('player1', formBuilder.control(''));
    this.formGroup.addControl('player2', formBuilder.control(''));
    this.formGroup.addControl('player3', formBuilder.control(''));
    store.select(selectUsername).subscribe({ next: username => this.username.set(username) });
    store.select(selectNewGameSettings).subscribe({
      next: settings => {
        const v = this.value;
        v.initialBuildings = String(settings.initialBuildings);
        v.initialMoney = settings.initialMoney;
        v.numberOfPlayers = String(settings.numberOfPlayers);
        v.player0 = settings.players[0].ai;
        v.player1 = settings.players[1].ai;
        v.player2 = settings.players[2].ai;
        v.player3 = settings.players[3].ai;
        this.formGroup.setValue(v);
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/menu');
  }

  start() {
    const v = this.value;
    const playerAiLevels = this.getPlayerAis(v);
    const humanPlayers = playerAiLevels.filter(it => it == undefined).length;
    if (humanPlayers != 1) {
      this.store.dispatch(applicationActionGroup.errorOccurred({error: this.translateService.get('error.exactlyOneHumanPlayer')}));
      return;
    }
    const action: GameCreatedAction = {
      initialBuildings: Number.parseInt(v.initialBuildings),
      initialMoney: v.initialMoney,
      numberOfPlayer: Number.parseInt(v.numberOfPlayers),
      players: [{ ai: v.player0 }, { ai: v.player1 }, { ai: v.player2 }, { ai: v.player3 }]
    };
    this.store.dispatch(gameActionGroup.created(action));
    this.gameService.start({
      initialBuildings: Number.parseInt(v.initialBuildings),
      initialMoney: this.getInitialMoney(v.initialMoney),
      players: playerAiLevels.map((it, i) => ({aiLevel: it, color: this.players[i].color}))
    });
    this.router.navigateByUrl('/game');
  }

  private getInitialMoney(initialMoney: InitialMoney): number {
    switch (initialMoney) {
      case 'little':
        return 10;
      case 'normal':
        return 20;
      case 'plenty':
        return 30;
    }
  }

  private getPlayerAis(value: NewGameComponentValue): Array<number | undefined> {
    const ret: Array<number | undefined> = [];
    const cnt = Number.parseInt(value.numberOfPlayers);
    if (cnt > 0) {
      ret.push(this.getPlayerAi(value.player0));
    }
    if (cnt > 1) {
      ret.push(this.getPlayerAi(value.player1));
    }
    if (cnt > 2) {
      ret.push(this.getPlayerAi(value.player2));
    }
    if (cnt > 3) {
      ret.push(this.getPlayerAi(value.player3));
    }
    return ret;
  }

  private getPlayerAi(value: PlayerAiLevel): number | undefined {
    switch (value) {
      case 'human':
        return undefined;
      case 'aiBeginner':
        return 0;
      case 'aiAmateur':
        return 1;
      case 'aiProfessional':
        return 2;
    }
  }
}
