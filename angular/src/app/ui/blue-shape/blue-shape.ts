import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-blue-shape',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      position: absolute;
      z-index: 0;
      background: hsl(231, 69%, 60%);
      pointer-events: none;
    }

    :host(.blue-shape--left) {
      left: 0;
      border-bottom-right-radius: 200px;
    }

    :host(.blue-shape--right) {
      right: 0;
      border-bottom-left-radius: 200px;
    }
  `,
  host: {
    class: 'blue-shape',
    'aria-hidden': 'true',
    '[class.blue-shape--left]': "side() === 'left'",
    '[class.blue-shape--right]': "side() === 'right'",
  },
})
export class BlueShape {
  readonly side = input.required<'left' | 'right'>();
}
