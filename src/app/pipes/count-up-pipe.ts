import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countUp',
  pure: false // indispensable pour rafraîchir pendant l'animation
})
export class CountUpPipe implements PipeTransform {
  private currentValue = 0;
  private startTime: number | null = null;
  private lastTarget: number | null = null;
  private duration = 1500; // 1.5 s par défaut

  transform(target: number, duration: number = 1500): string {
    // Si la cible change, on réinitialise l'animation
    if (this.lastTarget !== target) {
      this.lastTarget = target;
      this.startTime = null;
      this.currentValue = 0;
      this.duration = duration;
      this.animate();
    }
    return this.currentValue.toLocaleString('fr-FR');
  }

  private animate() {
    const step = (timestamp: number) => {
      if (this.startTime === null) {
        this.startTime = timestamp;
      }
      const progress = Math.min((timestamp - this.startTime) / this.duration, 1);
      this.currentValue = Math.floor(progress * (this.lastTarget ?? 0));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }
}
