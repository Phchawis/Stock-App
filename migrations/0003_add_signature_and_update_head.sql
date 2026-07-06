-- Migration: Add signature column and update head of unit
ALTER TABLE users ADD COLUMN signature TEXT;

-- Update supervisor name and initials
UPDATE users SET name = 'ทนพญ.เบญจวรรณ รุ่งเรือง', initials = 'บว' WHERE username = 'supervisor';
