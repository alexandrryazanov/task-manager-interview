export enum Permissions {
  // tasks
  TASK_CREATE = 1 << 0, // 000000000001 (1)
  TASK_READ = 1 << 1, // 000000000010 (2)
  TASK_UPDATE = 1 << 2, // 000000000100 (4)
  TASK_DELETE = 1 << 3, // 000000001000 (8)

  // projects
  PROJECT_CREATE = 1 << 4, // 000000010000 (16)
  PROJECT_READ = 1 << 5, // 000000100000 (32)
  PROJECT_UPDATE = 1 << 6, // 000001000000 (64)
  PROJECT_DELETE = 1 << 7, // 000010000000 (128)

  // users
  USER_CREATE = 1 << 8, // 000100000000 (256)
  USER_READ = 1 << 9, // 001000000000 (512)
  USER_UPDATE = 1 << 10, // 010000000000 (1024)
  USER_DELETE = 1 << 11, // 100000000000 (2048)
}
