import { Component, HostListener, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesComponent } from "./element/messages/messages.component";

@Component({
  selector: 'ff-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, MessagesComponent]
})
export class AppComponent {

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: Event) {
    if (!isDevMode()) {
      event.preventDefault();
    }
  }
}
