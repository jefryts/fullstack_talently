import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../interfaces/Task';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  tasks = signal<Task[]>([]);

  getTasks(): void {
    this.http
      .get<Task[]>(this.apiUrl)
      .subscribe((tasks) => this.tasks.set(tasks));
  }

  addTask({ title, description }: Task) {
    const newTask: Partial<Task> = {
      title,
      description,
    };

    this.http.post<Task>(this.apiUrl, newTask).subscribe((newTask) => {
      this.tasks.set([...this.tasks(), newTask]);
    });
  }

  updateTask(id: string, task: Task) {
    this.http
      .put<Task>(`${this.apiUrl}/${id}`, task)
      .subscribe((updatedTask) => {
        this.tasks.set(
          this.tasks().map((t) => (t.id === id ? updatedTask : t))
        );
      });
  }

  deleteTask(id: string) {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(() => {
      this.tasks.set(this.tasks().filter((t) => t.id !== id));
    });
  }

  toggleTaskCompletion(id: string) {
    this.http
      .put<Task>(`${this.apiUrl}/${id}/changeState`, {})
      .subscribe((updatedTask) => {
        this.tasks.set(
          this.tasks().map((t) => (t.id === id ? updatedTask : t))
        );
      });
  }
}
