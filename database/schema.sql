-- ============================================================
-- CampusConnect — Academic Campus Event & Registration Portal
-- Database Schema for MySQL (XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS campusconnect;
USE campusconnect;

-- -----------------------------------------------------------
-- Users Table
-- Stores admin, faculty, and student accounts
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        ENUM('admin', 'faculty', 'student') NOT NULL DEFAULT 'student',
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Events Table
-- Stores campus events created by admin or faculty
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200)    NOT NULL,
    description TEXT,
    date        DATETIME        NOT NULL,
    venue       VARCHAR(200)    NOT NULL,
    created_by  INT             NOT NULL,
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Registrations Table
-- Tracks which students registered for which events
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT     NOT NULL,
    event_id        INT     NOT NULL,
    registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (user_id, event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
