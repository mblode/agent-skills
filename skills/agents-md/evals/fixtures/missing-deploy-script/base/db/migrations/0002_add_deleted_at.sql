ALTER TABLE notes ADD COLUMN deleted_at TEXT;
CREATE INDEX notes_berth_live ON notes (berth) WHERE deleted_at IS NULL;
