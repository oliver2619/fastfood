import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { applicationActionGroup } from '../../action/application-action-group';
import { selectMessagesSorted } from '../../selector/messages-selector';
import { MessageType } from '../../state/messages-state';

interface Element {
  readonly id: number;
  readonly message: string;
  readonly type: 'info' | 'error'
}

@Component({
  selector: 'ff-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {

  readonly elements: WritableSignal<Element[]> = signal([]);

  constructor(private readonly store: Store) {
    store.select(selectMessagesSorted)
      .pipe(
        map(messages => messages.map(m => {
          const ret: Element = {
            id: m.id,
            message: m.message,
            type: m.type === MessageType.INFO ? 'info' : 'error'
          };
          return ret;
        }))
      )
      .subscribe({
        next: v => this.elements.set(v)
      });
  }

  close(id: number) {
    this.store.dispatch(applicationActionGroup.messageClosed({id}));
  }
}
