import { Component, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { buffer, debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],
})
export class StopwatchComponent implements OnDestroy {
  public isRunning = false;

  private destroy$ = new Subject<void>();
  private click$ = new Subject<void>();
  private doubleClickDelayMs = 250;
  private startTime: number = Date.now();
  private pausedTime = 0;
  private timer$ = interval(1000).pipe(takeUntil(this.destroy$));

  displayTime = '00:00:00';

  constructor() {
    this.timer$.subscribe(() => this.updateTime());
    this.click$
      .pipe(
        takeUntil(this.destroy$),
        buffer(this.click$.pipe(debounceTime(this.doubleClickDelayMs)))
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
    if (!this.isRunning) {
      return;
    }

    const now = Date.now();
    const elapsed = now - this.startTime + this.pausedTime;
    this.displayTime = this.formatTime(elapsed);
  }

  private formatTime(milliseconds: number) {
    const date = new Date(milliseconds);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  start() {
    this.startTime = Date.now();
    this.isRunning = true;
  }

  stop() {
    this.reset();
    this.isRunning = false;
  }

  wait() {
    this.pausedTime += Date.now() - this.startTime;
    this.isRunning = false;
  }

  reset() {
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.displayTime = '00:00:00';
    this.isRunning = true;
  }
}
