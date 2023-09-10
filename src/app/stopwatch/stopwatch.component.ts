import { Component, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { buffer, debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],
})
export class StopwatchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private click$ = new Subject<void>();
  private doubleClickTimeMs = 250;
  private isRunning = false;
  private startTime: number = Date.now();
  private pausedTime = 0;
  private timer$ = interval(1000).pipe(takeUntil(this.destroy$));

  displayTime = '00:00:00';

  constructor() {
    this.timer$.subscribe(() => this.updateTime());
    this.click$
      .pipe(
        takeUntil(this.destroy$),
        buffer(this.click$.pipe(debounceTime(this.doubleClickTimeMs)))
      )
      .subscribe((clicks: any) => {
        if (clicks.length === 2) {
          this.wait();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateTime() {
    if (this.isRunning) {
      const now = Date.now();
      if (this.startTime === null) {
        throw new Error('Expected startTime to be defined');
      }
      const elapsed = now - this.startTime + this.pausedTime;
      this.displayTime = this.formatTime(elapsed);
    }
  }

  private formatTime(milliseconds: number) {
    const date = new Date(milliseconds);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  startStop() {
    if (this.isRunning) {
      this.pausedTime += Date.now() - this.startTime;
    } else {
      this.startTime = Date.now();
    }
    this.isRunning = !this.isRunning;
  }

  wait() {
    this.startStop();
  }

  reset() {
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.displayTime = '00:00:00';
  }
}
