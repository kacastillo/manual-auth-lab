USE campus_club_hub;

-- Passwords are pre-hashed with bcrypt (cost 12) so seeded accounts can log in:
--   alex   / password123  (role: user)
--   morgan / adminpass     (role: admin)
INSERT INTO users (username, password, role)
VALUES
('alex',   '$2b$12$dGHEieCW9hMqX5zzSDq9ZuoTyFmVq24t1h3S2pMZ2JcEIphqRSZYK', 'user'),
('morgan', '$2b$12$Hhdgr3cb599tSZK46yCBseWnlMP2J8DI446UAgyQyE/OB7nxdUzou', 'admin');