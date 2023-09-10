import { Component, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatTime } from '../../utils/formatTime';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],
})
export class StopwatchComponent implements OnDestroy {
  public isRunning = false;
  public displayTime = formatTime(0);

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
    this.displayTime = formatTime(elapsed);
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
    if (this.isDoubleClick()) {
      this.pausedTime += Date.now() - this.startTime;
      this.isRunning = false;
    }
  }

  reset() {
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.displayTime = formatTime(0);
    this.isRunning = true;
  }

  private isDoubleClick() {
    if (!this.gotFirstClick) {
      this.gotFirstClick = true;

      setTimeout(() => {
        this.gotFirstClick = false;
      }, this.doubleClickDelayMs);

      return false;
    }

    return true;
  }
}
