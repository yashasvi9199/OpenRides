-- Migration: Create Users and Rides Tables
-- Created: 2026-08-20

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'rider',
  qr_token TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rides (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  host_id TEXT NOT NULL,
  host_name TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  distance_km REAL NOT NULL DEFAULT 0.0,
  max_speed_kmh REAL NOT NULL DEFAULT 0.0,
  avg_speed_kmh REAL NOT NULL DEFAULT 0.0,
  battery_pct INTEGER NOT NULL DEFAULT 100,
  current_lean_angle REAL NOT NULL DEFAULT 0.0,
  last_updated INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
