CREATE TABLE commitments (
    commitment_address VARCHAR(255) UNIQUE NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    tg_user_photo_link TEXT
);

CREATE INDEX idx_wallet_address ON commitments(wallet_address);
CREATE INDEX idx_tg_user_photo_link ON commitments(tg_user_photo_link);
