import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LogoVariant = 'dark' | 'light' | 'inverted';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  readonly variant = input<LogoVariant>('dark');
}
