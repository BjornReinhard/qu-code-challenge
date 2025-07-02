export class EnvService {
  public readonly VITE_API_BASE_URL: string;
  public readonly TOTAL_JOKES_NUMBER: number | string;

  constructor() {
    this.VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    this.TOTAL_JOKES_NUMBER = import.meta.env.VITE_TOTAL_JOKES_NUMBER || 250;
  }
}

export const envService = new EnvService();
