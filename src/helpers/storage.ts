export class StorageManager {
    private dbName: string;
  
    constructor() {
      this.dbName = "normal";
    }
  
    private async getDB(): Promise<IDBDatabase> {
      return new Promise((res, rej) => {
        const request = indexedDB.open(this.dbName, 1);
  
        request.onupgradeneeded = () => {
          const db = request.result;
  
          if (!db.objectStoreNames.contains('keyBindings')) {
            db.createObjectStore('keyBindings', { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains('sharedData')) {
            db.createObjectStore('sharedData', { keyPath: 'key' });
          }
        };
  
        request.onsuccess = () => res(request.result);
        request.onerror = () => rej(request.error);
      });
    }
  
    async set(storeName: string, key: string, value: any): Promise<void> {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put({ key, value });
  
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  
    async get(storeName: string, key: string): Promise<any> {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(key);
  
        request.onsuccess = () => resolve(request.result?.value);
        request.onerror = () => reject(request.error);
      });
    }
  
    async getAll(storeName: string): Promise<any[]> {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async delete(storeName: string, key: string): Promise<void> {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(key);
  
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  }