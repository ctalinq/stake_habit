ALTER TABLE commitments
ADD COLUMN tg_user_photo_link TEXT;

CREATE INDEX idx_tg_user_photo_link ON commitments(tg_user_photo_link);
