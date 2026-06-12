export class UploadQueue {
  private queue: (() => Promise<void>)[] =
    [];

  private running = 0;

  constructor(
    private concurrency = 2
  ) {}

  add(task: () => Promise<void>) {
    this.queue.push(task);

    this.next();
  }

  private next() {
    if (
      this.running >=
      this.concurrency
    ) {
      return;
    }

    const task =
      this.queue.shift();

    if (!task) {
      return;
    }

    this.running++;

    task().finally(() => {
      this.running--;

      this.next();
    });
  }
}

export const uploadQueue =
  new UploadQueue(2);