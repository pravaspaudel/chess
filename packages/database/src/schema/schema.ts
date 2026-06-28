import {
  pgTable,
  text,
  uuid,
  pgEnum,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const friendStatus = pgEnum("friendstatus", ["pending", "accepted"]);

export const friends = pgTable("friends", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id),
  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => users.id),
  status: friendStatus("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const winnerEnum = pgEnum("winner", ["w", "b", "draw"]);
export const gameStatus = pgEnum("status", ["completed", "ongoing"]);

export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  whiteId: uuid("white_id")
    .notNull()
    .references(() => users.id),
  blackId: uuid("black_id")
    .notNull()
    .references(() => users.id),
  currentFen: text("current_fen").notNull(),
  pgn: text("pgn").notNull(),
  winner: winnerEnum("winner"),
  status: gameStatus("status").default("ongoing").notNull(),
  whiteTimeMs: integer("white_time_ms").notNull(),
  blackTimeMs: integer("black_time_ms").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moves = pgTable("moves", {
  moveId: uuid("move_id").defaultRandom().primaryKey(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id),
  move: text("move").notNull(), //single moves like e4
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
