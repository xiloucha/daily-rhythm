import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type RecordItem = {
  id: number;
  date: string;
  time: string;
  sukkiri: number;
  showDetail: boolean;
  type: number | null;
};

type CalendarDay = {
  key: string;
  day: number;
};

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  theme = localStorage.getItem('theme') || 'day';

  changeTheme(theme: string) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }


  sukkiri = 50;

  records: RecordItem[] = [];


  /* カレンダー */

  calendarVisible = false;

  weekdays = [
    '日',
    '月',
    '火',
    '水',
    '木',
    '金',
    '土'
  ];

  calendarDate = new Date();

  calendarDays: CalendarDay[] = [];

  selectedDate = '';

  todayKey = this.dateToKey(new Date());


  constructor() {

    const savedRecords =
      localStorage.getItem('records');

    if (savedRecords) {
      this.records = JSON.parse(savedRecords);
    }

    this.selectedDate = this.todayKey;

    this.createCalendar();
  }


  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
  }


  get calendarTitle(): string {

    return `${this.calendarDate.getFullYear()}年 ${
      this.calendarDate.getMonth() + 1
    }月`;

  }


  get selectedDateLabel(): string {

    const date = this.keyToDate(this.selectedDate);

    return `${date.getFullYear()}年 ${
      date.getMonth() + 1
    }月 ${
      date.getDate()
    }日`;

  }


  get selectedRecords(): RecordItem[] {

    return this.records.filter(
      record =>
        this.recordDateKey(record) === this.selectedDate
    );

  }


  createCalendar() {

    this.calendarDays = [];

    const year =
      this.calendarDate.getFullYear();

    const month =
      this.calendarDate.getMonth();

    const firstDay =
      new Date(year, month, 1).getDay();

    const daysInMonth =
      new Date(year, month + 1, 0).getDate();


    for (let i = 0; i < firstDay; i++) {

      const previousDate =
        new Date(
          year,
          month,
          i - firstDay + 1
        );

      this.calendarDays.push({
        key: this.dateToKey(previousDate),
        day: previousDate.getDate()
      });

    }


    for (let day = 1; day <= daysInMonth; day++) {

      const date =
        new Date(year, month, day);

      this.calendarDays.push({
        key: this.dateToKey(date),
        day
      });

    }


    let nextDay = 1;

    while (this.calendarDays.length < 42) {

      const date =
        new Date(
          year,
          month + 1,
          nextDay
        );

      this.calendarDays.push({
        key: this.dateToKey(date),
        day: nextDay
      });

      nextDay++;
    }

  }


  previousMonth() {

    this.calendarDate =
      new Date(
        this.calendarDate.getFullYear(),
        this.calendarDate.getMonth() - 1,
        1
      );

    this.createCalendar();

  }


  nextMonth() {

    this.calendarDate =
      new Date(
        this.calendarDate.getFullYear(),
        this.calendarDate.getMonth() + 1,
        1
      );

    this.createCalendar();

  }


  selectDate(key: string) {

    this.selectedDate = key;

  }


  hasRecord(key: string): boolean {

    return this.records.some(
      record =>
        this.recordDateKey(record) === key
    );

  }


  dateToKey(date: Date): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  recordDateKey(record: RecordItem): string {

    const parts =
      record.date.match(/\d+/g);

    if (!parts || parts.length < 3) {
      return '';
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    return this.dateToKey(
      new Date(year, month - 1, day)
    );

  }


  keyToDate(key: string): Date {

    const parts =
      key.split('-').map(Number);

    return new Date(
      parts[0],
      parts[1] - 1,
      parts[2]
    );

  }


  record() {

    const now = new Date();

    const date =
      now.toLocaleDateString('ja-JP');

    const time =
      now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });


    this.records.push({

      id: Date.now(),

      date,

      time,

      sukkiri: this.sukkiri,

      showDetail: false,

      type: null

    });


    this.saveRecords();

    this.selectedDate =
      this.dateToKey(now);

    this.calendarDate =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    this.createCalendar();

  }


  saveRecords() {

    localStorage.setItem(
      'records',
      JSON.stringify(this.records)
    );

  }


  deleteRecord(
    recordToDelete: RecordItem
  ) {

    this.records =
      this.records.filter(
        record =>
          record.id !== recordToDelete.id
      );

    this.saveRecords();

  }

}