import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HERO } from '../../data/content';
import { BlueShape } from '../../ui/blue-shape/blue-shape';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-hero',
  imports: [BlueShape, Button],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly hero = HERO;
}
