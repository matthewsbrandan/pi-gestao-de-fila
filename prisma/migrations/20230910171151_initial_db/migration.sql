-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'client'
);

-- CreateTable
CREATE TABLE "queues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_autoincrement" BOOLEAN NOT NULL DEFAULT true,
    "start_in" INTEGER NOT NULL DEFAULT 100,
    "max_length" INTEGER,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "started_at" DATETIME NOT NULL,
    "ended_at" DATETIME,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "queues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "queue_id" INTEGER NOT NULL,
    CONSTRAINT "orders_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "queues" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
