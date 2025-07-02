import { envService } from '@/services/env.service.ts';
import { useFetch } from '@vueuse/core';

class HttpService {
  private withBase(url: string): string {
    return `${envService.VITE_API_BASE_URL}${url}`;
  }

  private getHeaders(headers = {}, contentType = 'application/json') {
    return {
      'Content-Type': contentType,
      ...headers,
    };
  }

  public async get<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const { data, error, response } = await useFetch<T>(this.withBase(url), {
      ...options,
      method: 'GET',
    }).json();

    if (error.value || !response.value?.ok) {
      const status = response.value?.status ?? 500;
      const message = error.value?.message ?? 'Unknown error';
      throw { status, message };
    }
    return data.value as T;
  }

  public async post<T = unknown>(url: string, body: any, options: RequestInit = {}): Promise<T> {
    const { data, error } = await useFetch<T>(this.withBase(url), {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.getHeaders(options.headers),
    }).json();

    if (error.value) throw error.value;
    return data.value as T;
  }

  public async put<T = unknown>(url: string, body: any, options: RequestInit = {}): Promise<T> {
    const { data, error } = await useFetch<T>(this.withBase(url), {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: this.getHeaders(options.headers),
    }).json();

    if (error.value) throw error.value;
    return data.value as T;
  }

  public async delete(url: string, options: RequestInit = {}): Promise<void> {
    const { error, response } = await useFetch(this.withBase(url), {
      ...options,
      method: 'DELETE',
    });

    if (error.value) throw error.value;

    if (response.value?.status !== 204 && response.value?.status !== 200) {
      throw new Error(`Unexpected response status: ${response.value?.status}`);
    }
  }
}

export const httpService = new HttpService();
