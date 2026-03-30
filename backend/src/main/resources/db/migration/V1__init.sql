CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carrier_profile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    company_name VARCHAR(200),
    license_number VARCHAR(100) NOT NULL,
    license_doc_path VARCHAR(500),
    insurance_doc_path VARCHAR(500),
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    max_load_kg INTEGER NOT NULL,
    operating_regions TEXT[],
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    rating_avg DECIMAL(3,2),
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE freight_listing (
    id BIGSERIAL PRIMARY KEY,
    posted_by BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    pickup_address VARCHAR(500) NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    pickup_country VARCHAR(2) DEFAULT 'EE',
    delivery_address VARCHAR(500) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_country VARCHAR(2) DEFAULT 'EE',
    pickup_date DATE NOT NULL,
    delivery_date DATE,
    flexible_dates BOOLEAN DEFAULT FALSE,
    cargo_description VARCHAR(300),
    cargo_weight_kg INTEGER,
    cargo_volume_m3 DECIMAL(8,2),
    vehicle_type_required VARCHAR(50),
    special_requirements TEXT,
    budget_eur DECIMAL(10,2),
    accepted_price_eur DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'OPEN',
    stripe_payment_intent_id VARCHAR(300),
    service_fee_paid BOOLEAN DEFAULT FALSE,
    accepted_carrier_id BIGINT REFERENCES carrier_profile(id),
    accepted_at TIMESTAMPTZ,
    payment_deadline TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE freight_offer (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES freight_listing(id) ON DELETE CASCADE,
    carrier_id BIGINT NOT NULL REFERENCES carrier_profile(id),
    price_eur DECIMAL(10,2) NOT NULL,
    message TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(listing_id, carrier_id)
);

CREATE TABLE freight_rating (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES freight_listing(id),
    rated_by BIGINT NOT NULL REFERENCES users(id),
    carrier_id BIGINT NOT NULL REFERENCES carrier_profile(id),
    stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(listing_id, rated_by)
);

CREATE INDEX idx_listing_status ON freight_listing(status);
CREATE INDEX idx_listing_pickup_city ON freight_listing(pickup_city);
CREATE INDEX idx_listing_pickup_date ON freight_listing(pickup_date);
CREATE INDEX idx_offer_listing ON freight_offer(listing_id);
CREATE INDEX idx_offer_carrier ON freight_offer(carrier_id);
