// repository.ts
import axios from 'axios';

interface IGenericApi<T> {
  getAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: number, item: T): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

export class GenericApi<T> implements IGenericApi<T> {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getAll(): Promise<T[]> {
    const response = await axios.get<T[]>(this.url);
    return response.data;
  }


  async create(item: T): Promise<T> {
    const response = await axios.post<T>(this.url, item);
    return response.data;
  }

  async update(id: number, item: T): Promise<T | null> {
    try {
      const response = await axios.put<T>(`${this.url}/${id}`, item);
      return response.data;
    } catch (error) {
      console.error(`Error updating by ID ${id}:`, error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await axios.delete(`${this.url}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting by ID ${id}:`, error);
      return false;
    }
  }
}
