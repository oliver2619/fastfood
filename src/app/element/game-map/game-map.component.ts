import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { selectBuildings,  selectPestilence} from '../../selector/game-selector';
import { selectFields, selectPlayerColors } from '../../selector/game-setup-selector';
import { selectSelectedBuilding, selectSelectedField } from '../../selector/selection-selector';
import { FieldState } from '../../state/game-setup-state';
import { BuildingState } from '../../state/game-state';
import { TileImages } from './tile-images';

const ZOOM = 0.667;
const TILE_WIDTH = 226 * ZOOM;
const TILE_HEIGHT = 258 * ZOOM;
const GRID_X = TILE_WIDTH / 2;
const GRID_Y = TILE_HEIGHT / 4;
const PESTILENCE_SIZE = 64 * 1.8;

const TEXT_COLOR_BY_RATING: string[] = ['#404040', '#ff4040', '#ff8000', '#ffc000', '#a0c000', '#00c080'];
const COLOR_BY_NAME: { [key: string]: string } = { red: '#ff0000', green: '#00c080', yellow: '#ffd000', blue: '#0080ff' };

@Component({
  selector: 'ff-game-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-map.component.html',
  styleUrl: './game-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameMapComponent implements AfterViewInit {

  readonly width = TILE_WIDTH * 6;
  readonly height = TILE_HEIGHT * 4;
  readonly padding = TILE_WIDTH;

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> | undefined;

  context: CanvasRenderingContext2D | undefined;

  private readonly images: TileImages = new TileImages();

  private pestilence: { x: number, y: number } | undefined;
  private fields: FieldState[][] = [];
  private buildings: BuildingState[] = [];
  private playerColors: string[] = [];
  private selectedField: { x: number, y: number } | undefined;
  private selectedBuilding: { x: number, y: number } | undefined;

  constructor(private readonly store: Store) {
    this.images.onLoaded.subscribe({
      next: _ => this.render()
    });
    store.select(selectPestilence).subscribe({
      next: p => {
        this.pestilence = p;
        this.render();
      }
    });
    store.select(selectFields).subscribe({
      next: f => {
        this.fields = f;
        this.render();
      }
    });
    store.select(selectPlayerColors).subscribe({
      next: c => {
        this.playerColors = c.map(it => COLOR_BY_NAME[it]);
        this.render();
      }
    });
    store.select(selectBuildings).subscribe({
      next: b => {
        this.buildings = b;
        this.render();
      }
    });
    store.select(selectSelectedBuilding).subscribe({
      next: f => {
        this.selectedBuilding = f;
        this.render();
      }
    });
    store.select(selectSelectedField).subscribe({
      next: f => {
        this.selectedField = f;
        this.render();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.canvas != undefined) {
      const ctx = this.canvas.nativeElement.getContext('2d', { alpha: true });
      if (ctx != null) {
        this.context = ctx;
        this.render();
      } else {
        setTimeout(() => {
          throw new Error('Failed to create CanvasRenderingContext2D');
        });
      }
    }
  }

  onClick(ev: MouseEvent) {
    this.click(ev.offsetX, ev.offsetY);
  }

  private click(px: number, py: number) {
    const x = Math.floor((px - this.padding) / GRID_X + 0.5) | 0;
    const y = Math.floor((py - this.padding) / GRID_Y + 0.5) | 0;
    if (x < 0 || y < 0 || x > 12 || y > 16) {
      return;
    }
    this.store.dispatch(gameActionGroup.selectPointOnMap({x, y}));
  }

  private render() {
    if (this.context != undefined && this.images.isLoaded) {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.renderFields(this.context);
      this.renderBuildings(this.context);
      this.renderPestilence(this.context);
      this.renderSelection(this.context);
    }
  }

  private renderSelection(context: CanvasRenderingContext2D) {
    context.save();
    context.strokeStyle = '#ffffff';
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
    try {
      if (this.selectedField != undefined) {
        const x = ((this.selectedField.y & 1) === 0 ? this.selectedField.x * GRID_X * 2 : ((this.selectedField.x * 2 + 1) * GRID_X)) + this.padding;
        const y = this.selectedField.y * GRID_Y * 3 + this.padding;
        context.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
        context.strokeRect(x, y, TILE_WIDTH, TILE_HEIGHT);
      }
      if (this.selectedBuilding != undefined) {
        const s = TILE_WIDTH / 6;
        const x = this.selectedBuilding.x * GRID_X - s + this.padding;
        let y = this.selectedBuilding.y * GRID_Y * 3 - s + this.padding;
        if ((this.selectedBuilding.x & 1) === 0) {
          if ((this.selectedBuilding.y & 1) === 0) {
            y += GRID_Y;
          }
        } else {
          if ((this.selectedBuilding.y & 1) === 1) {
            y += GRID_Y;
          }
        }
        context.fillRect(x, y, s * 2, s * 2);
        context.strokeRect(x, y, s * 2, s * 2);
      }
    } finally {
      context.restore();
    }
  }

  private renderFields(context: CanvasRenderingContext2D) {
    context.save();
    context.shadowColor = '#000000';
    try {
      this.fields.forEach((fields, y) => {
        fields.forEach((f, x) => {
          const rx = (y & 1) === 0 ? x * GRID_X * 2 : ((x * 2 + 1) * GRID_X);
          context.shadowBlur = 4;
          context.drawImage(this.images.getField(f.fieldType), rx + this.padding, y * GRID_Y * 3 + this.padding, TILE_WIDTH, TILE_HEIGHT);
          const fontSize = (f.productivity + 5) * TILE_HEIGHT / 40;
          const txt = f.productivity.toString();
          context.font = `${fontSize}px lobster`;
          const sz = context.measureText(txt);
          const h = sz.actualBoundingBoxAscent - sz.actualBoundingBoxDescent;
          context.fillStyle = TEXT_COLOR_BY_RATING[f.productivity];
          context.shadowBlur = 3;
          context.fillText(txt, rx + GRID_X - sz.width / 2 + this.padding, y * GRID_Y * 3 + TILE_HEIGHT / 2 + h / 2 + this.padding);
        });
      });
    } finally {
      this.context!.restore();
    }
  }

  private renderBuildings(context: CanvasRenderingContext2D) {
    context.save();
    try {
      this.buildings.forEach(b => {
        const x = b.x * GRID_X + this.padding;
        let y = b.y * GRID_Y * 3 + this.padding;
        if ((b.x & 1) === 0) {
          if ((b.y & 1) === 0) {
            y += GRID_Y;
          }
        } else {
          if ((b.y & 1) === 1) {
            y += GRID_Y;
          }
        }
        const r = b.size > 1 ? TILE_WIDTH / 6 : TILE_WIDTH / 8;
        context.beginPath();
        context.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = this.playerColors[b.player];
        context.fill();
        context.strokeStyle = '#000000';
        context.shadowBlur = 3;
        context.shadowColor = '#000000';
        context.lineWidth = 3;
        context.stroke();
        if (b.size > 1) {
          context.beginPath();
          context.ellipse(x, y, r * .5, r * .5, 0, 0, Math.PI * 2);
          context.closePath();
          context.shadowBlur = 2;
          context.lineWidth = 2;
          context.stroke();
        }
      });
    } finally {
      context.restore();
    }
  }

  private renderPestilence(context: CanvasRenderingContext2D) {
    if (this.pestilence != undefined) {
      context.save();
      context.shadowBlur = 8;
      context.shadowColor = '#000000';
      try {
        const x = (this.pestilence.y & 1) === 0 ? this.pestilence.x * 2 + 1 : (this.pestilence.x * 2 + 2);
        context.drawImage(this.images.get('biohazard'), x * GRID_X - PESTILENCE_SIZE * 0.5 + this.padding, (this.pestilence.y * 3 + 2) * GRID_Y - PESTILENCE_SIZE * 0.5 + this.padding, PESTILENCE_SIZE, PESTILENCE_SIZE);
      } finally {
        context.restore();
      }
    }
  }
}
