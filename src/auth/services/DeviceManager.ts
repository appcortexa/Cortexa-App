import { LocalStorageService } from '../storage/LocalStorageService';

const DEVICE_ID_KEY = 'cortexa_device_id_v1';

const localStorageService = new LocalStorageService();

export class DeviceManager {
  public async getDeviceId(): Promise<string> {
    const existing = localStorageService.get<string>(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }

    const deviceId = crypto.randomUUID();
    localStorageService.set(DEVICE_ID_KEY, deviceId);
    return deviceId;
  }

  public async hasDeviceId(): Promise<boolean> {
    const existing = localStorageService.get<string>(DEVICE_ID_KEY);
    return typeof existing === 'string' && existing.length > 0;
  }

  public async clearDeviceId(): Promise<void> {
    localStorageService.remove(DEVICE_ID_KEY);
  }
}

export const deviceManager = new DeviceManager();
