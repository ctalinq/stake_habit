CREATE TABLE visitors (
  tg_user_id BIGINT NOT NULL,
  tg_user_full_name TEXT NOT NULL,
  tg_user_photo_link TEXT,
  commitment_address VARCHAR(255) NOT NULL,

  UNIQUE (commitment_address, tg_user_id)
);
