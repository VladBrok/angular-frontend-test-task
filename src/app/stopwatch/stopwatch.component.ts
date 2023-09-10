import { Component, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// TODO: extract functions
@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],
})
export class StopwatchComponent implements OnDestroy {
  public isRunning = false;
  public displayTime = '00:00:00';

  private destroy$ = new Subject<void>();
  private doubleClickDelayMs = 300;
  private startTime: number = Date.now();
  private pausedTime = 0;
  private timer$ = timer(0, 1000).pipe(takeUntil(this.destroy$));
  private gotFirstClick = false;

  constructor() {
    this.timer$.subscribe(() => this.updateTime());
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
    if (!this.gotFirstClick) {
      this.gotFirstClick = true;
      setTimeout(() => {
        this.gotFirstClick = false;
      }, this.doubleClickDelayMs);
      return;
    }

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
