import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface MixedStorage {
  getItem(key: string): any | Promise<any>;
  removeItem?(key: string): any | Promise<any>;
  remove?(key: string): Promise<any>;
  setItem(key: string, value: any): any | Promise<any>;
}

export enum StorageKey {
  User = "user",
  Token = "token",
  CurrentModule = 'current-module'
}

export enum StorageError {
  NullData = "Null data"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageValueList: { [key: string]: any } = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get storage(): MixedStorage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  async set<T>(preference: string, value: T): Promise<T> {
    const storage = this.storage;
    if (storage) {
      await storage.setItem(preference, JSON.stringify(value));
    }
    this.storageValueList[preference] = value;
    return value;
  }

  async get<T>(preference: string, returnNull: boolean = false): Promise<T | null> {
    if (this.storageValueList[preference]) {
      return this.storageValueList[preference];
    }

    const storage = this.storage;
    if (!storage) {
      return returnNull ? null : undefined as any;
    }

    const data = await storage.getItem(preference);
    const parsed = data ? JSON.parse(data) : null;

    if (!parsed && returnNull) {
      return null;
    }

    this.storageValueList[preference] = parsed;
    return parsed;
  }

  async remove(preference: string): Promise<void> {
    const storage = this.storage;
    if (storage) {
      if (storage.removeItem) {
        storage.removeItem(preference);
      }
      if (storage.remove) {
        await storage.remove(preference);
      }
    }
    this.storageValueList[preference] = null;
  }

  async removeAll(): Promise<void> {
    const storage = this.storage;
    if (!storage) return;

    for (const preference of Object.values(StorageKey)) {
      if (storage.removeItem) {
        storage.removeItem(preference);
      }
      if (storage.remove) {
        await storage.remove(preference);
      }
      this.storageValueList[preference] = null;
    }
  }
}