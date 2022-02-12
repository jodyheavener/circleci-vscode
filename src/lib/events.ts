import { Events as EventTypes } from './types';

class Events {
  events: { [key: string]: ((data: any) => void)[] } = {};

  on<TData>(event: EventTypes, callback: (data: TData) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  off(event: EventTypes): void {
    if (this.events[event]) {
      this.events[event] = [];
    }
  }

  fire<TData>(event: EventTypes, data?: TData): void {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }
}

export const events = new Events();
