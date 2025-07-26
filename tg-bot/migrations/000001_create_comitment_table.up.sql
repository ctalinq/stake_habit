CREATE TABLE commitments (
    commitment_address VARCHAR(255) UNIQUE,
    wallet_id VARCHAR(255)
);

CREATE INDEX idx_wallet_id ON commitments(wallet_id);
