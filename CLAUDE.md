# Koormaturg.ee — Freight Marketplace

Eesti/Baltikumi veoste vahendusplatvorm. Veofirmad postitavad üksikuid veoseid,
sertifitseeritud vedajad (oma sõidukiga) teevad pakkumisi. GoWorkaBit-analoog veondusele.

## Ärimudel

**"Maksa kui juht leitud"** — postitus tasuta, kinnituse hetkel võetakse kliendilt
**12€ teenustasu** Stripe kaudu. Vedaja ei maksa midagi.

---

## Stack

- **Backend:** Spring Boot 3.x, Java 21, Maven
- **Frontend:** Angular 18+, standalone components, Angular Material
- **DB:** PostgreSQL 16
- **Auth:** JWT (Spring Security) — access token 15min, refresh token 7d
- **Makse:** Stripe (Payment Intents)
- **Email:** Resend API
- **Failid:** lokaalne `/uploads/` kaust, teenindatakse Spring kaudu
- **Deploy:** Docker Compose + Caddy reverse proxy
- **Migrations:** Flyway

---

## Projekti struktuur

```
koormaturg/
├── backend/
│   ├── src/main/java/ee/koormaturg/
│   │   ├── auth/          — JWT, login, register, refresh
│   │   ├── user/          — User entity + UserService
│   │   ├── carrier/       — CarrierProfile + dokumendid
│   │   ├── listing/       — FreightListing + otsing
│   │   ├── offer/         — FreightOffer + aktsepteerimine
│   │   ├── payment/       — Stripe PI + webhook
│   │   ├── rating/        — Hinnangud
│   │   ├── notification/  — Resend email teavitused
│   │   ├── admin/         — Admin endpointid
│   │   └── config/        — Security, CORS, Stripe, Resend
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/  — Flyway SQL failid
│   └── Dockerfile
├── frontend/
│   ├── src/app/
│   │   ├── core/          — auth, interceptors, guards
│   │   ├── shared/        — komponendid, pipe'id
│   │   ├── marketplace/   — avalik nimekiri
│   │   ├── listing/       — postitus + detailvaade
│   │   ├── carrier/       — vedaja profiil + registreerimine
│   │   ├── dashboard/     — minu veod / pakkumised
│   │   ├── auth/          — login / register lehed
│   │   └── admin/         — admin paneel
│   └── Dockerfile
├── docker-compose.yml
└── Caddyfile
```

---

## Andmebaas

### V1__init.sql

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL DEFAULT 'USER', -- USER, ADMIN
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vedaja profiil (juht oma sõidukiga)
CREATE TABLE carrier_profile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    company_name VARCHAR(200),
    license_number VARCHAR(100) NOT NULL,
    license_doc_path VARCHAR(500),
    insurance_doc_path VARCHAR(500),
    vehicle_type VARCHAR(50) NOT NULL,  -- CURTAIN, REFRIGERATED, FLATBED, VAN, TANKER
    vehicle_plate VARCHAR(20) NOT NULL,
    max_load_kg INTEGER NOT NULL,
    operating_regions TEXT[],           -- ['EE', 'LV', 'LT']
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    rating_avg DECIMAL(3,2),
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Veotellimus
CREATE TABLE freight_listing (
    id BIGSERIAL PRIMARY KEY,
    posted_by BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,

    -- Marsruut
    pickup_address VARCHAR(500) NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    pickup_country CHAR(2) DEFAULT 'EE',
    delivery_address VARCHAR(500) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_country CHAR(2) DEFAULT 'EE',

    -- Aeg
    pickup_date DATE NOT NULL,
    delivery_date DATE,
    flexible_dates BOOLEAN DEFAULT FALSE,

    -- Kaup
    cargo_description VARCHAR(300),
    cargo_weight_kg INTEGER,
    cargo_volume_m3 DECIMAL(8,2),
    vehicle_type_required VARCHAR(50),
    special_requirements TEXT,

    -- Hind
    budget_eur DECIMAL(10,2),           -- valikuline, kliendi soov
    accepted_price_eur DECIMAL(10,2),   -- kinnitatud hind (vedaja pakkumine)

    -- Olek
    status VARCHAR(30) DEFAULT 'OPEN',
    -- OPEN → MATCHED → IN_TRANSIT → COMPLETED | CANCELLED

    -- Stripe
    stripe_payment_intent_id VARCHAR(300),
    service_fee_paid BOOLEAN DEFAULT FALSE,

    -- Aktsepteeritud vedaja
    accepted_carrier_id BIGINT REFERENCES carrier_profile(id),
    accepted_at TIMESTAMPTZ,
    payment_deadline TIMESTAMPTZ,       -- accepted_at + 24h

    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vedaja pakkumine
CREATE TABLE freight_offer (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES freight_listing(id) ON DELETE CASCADE,
    carrier_id BIGINT NOT NULL REFERENCES carrier_profile(id),
    price_eur DECIMAL(10,2) NOT NULL,
    message TEXT,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED, EXPIRED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(listing_id, carrier_id)        -- üks pakkumine per vedaja per vedu
);

-- Hinnangud
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

-- Indeksid
CREATE INDEX idx_listing_status ON freight_listing(status);
CREATE INDEX idx_listing_pickup_city ON freight_listing(pickup_city);
CREATE INDEX idx_listing_pickup_date ON freight_listing(pickup_date);
CREATE INDEX idx_offer_listing ON freight_offer(listing_id);
CREATE INDEX idx_offer_carrier ON freight_offer(carrier_id);
```

---

## Backend API

### Auth `/api/auth`
```
POST /api/auth/register          — {email, password, fullName, phone}
POST /api/auth/login             — {email, password} → {accessToken, refreshToken}
POST /api/auth/refresh           — {refreshToken} → {accessToken}
POST /api/auth/logout            — kustuta refresh token
GET  /api/auth/me                — oma kasutajainfo
```

### Carrier `/api/carriers`
```
POST   /api/carriers/register            — loo carrier profiil (auth required)
GET    /api/carriers/me                  — oma carrier profiil
PUT    /api/carriers/me                  — uuenda profiili
POST   /api/carriers/me/license          — upload litsents (multipart, max 5MB, PDF/JPG)
POST   /api/carriers/me/insurance        — upload kindlustus (multipart, max 5MB, PDF/JPG)
GET    /api/carriers/{id}                — avalik profiil + hinnangud
```

### Listings `/api/listings`
```
POST   /api/listings                     — postita vedu (auth required)
GET    /api/listings                     — avalik nimekiri
  ?pickup_city=Tallinn
  ?delivery_city=Riga
  ?vehicle_type=CURTAIN
  ?date_from=2025-06-01
  ?date_to=2025-06-30
  ?page=0&size=20
GET    /api/listings/{id}                — detailvaade (avalik)
PUT    /api/listings/{id}                — muuda (ainult poster, ainult OPEN)
PUT    /api/listings/{id}/cancel         — tühista (ainult poster)
PUT    /api/listings/{id}/complete       — märgi lõpetatuks (ainult poster)
GET    /api/listings/my                  — minu postitused (auth required)
```

### Offers `/api/listings/{listingId}/offers`
```
POST   /api/listings/{listingId}/offers              — tee pakkumine (carrier, verified)
GET    /api/listings/{listingId}/offers              — pakkumiste nimekiri (ainult poster)
PUT    /api/listings/{listingId}/offers/{id}/accept  — aktsepteeri → loob Stripe PI
PUT    /api/listings/{listingId}/offers/{id}/reject  — lükka tagasi
GET    /api/carriers/me/offers                       — minu pakkumised (carrier)
```

### Payment `/api/payment`
```
POST   /api/payment/listings/{listingId}/create-intent  — loo/tagasta Stripe PI
POST   /api/payment/webhook                             — Stripe webhook (public)
```

### Ratings `/api/ratings`
```
POST   /api/ratings/listings/{listingId}   — anna hinnang (auth, listing COMPLETED)
GET    /api/carriers/{id}/ratings          — vedaja hinnangud
```

### Admin `/api/admin`
```
GET    /api/admin/carriers                 — kõik vedajad (filter: verified)
PUT    /api/admin/carriers/{id}/verify     — kinnita vedaja
PUT    /api/admin/carriers/{id}/reject     — lükka tagasi (koos põhjendusega)
GET    /api/admin/listings                 — kõik postitused
GET    /api/admin/stats                    — põhistatistikad
```

---

## Stripe loogika

```java
// 1. Poster aktsepteerib pakkumise → salvestame offer accepted, loome PI
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setAmount(1200L)  // 12.00 EUR
    .setCurrency("eur")
    .setDescription("Koormaturg teenustasu — vedu #" + listingId)
    .putMetadata("listing_id", String.valueOf(listingId))
    .putMetadata("offer_id", String.valueOf(offerId))
    .putMetadata("user_id", String.valueOf(userId))
    .build();

// 2. Frontend kinnitab makse Stripe.js abil
// 3. Webhook: payment_intent.succeeded
//    → listing.service_fee_paid = true
//    → listing.status = MATCHED
//    → email mõlemale poolele
// 4. Kui makse ei tule 24h jooksul:
//    → scheduled job: offer tagasi PENDING, listing tagasi OPEN
```

---

## Ärireeglid (service kihti)

1. Pakkumise tegemiseks peab `carrier.verified = true`
2. `UNIQUE(listing_id, carrier_id)` — üks pakkumine per vedaja
3. Ainult `status = OPEN` listing saab pakkumisi vastu võtta
4. Pärast aktsepteerimist on 24h makse tähtaeg, siis offer aegub
5. Poster ei näe teiste carriers pakkumiste hindu enne oma aktsepteerimist
6. Hinnangut saab anda ainult `status = COMPLETED` listingule
7. Admin peab vedaja kinnitama enne kui ta pakkumisi teha saab

---

## Email teavitused (Resend)

```
CARRIER_NEW_OFFER     → posterile: "Uus pakkumine sinu veole #{id}"
OFFER_ACCEPTED        → carrierile: "Sinu pakkumine aktsepteeriti! Poster kontakt: {email}"
PAYMENT_CONFIRMED     → mõlemale: "Makse kinnitatud, vedu kinnitatud"
PAYMENT_DEADLINE      → posterile: "Makse tähtaeg 2h pärast"
LISTING_COMPLETED     → mõlemale: "Palun anna hinnang"
CARRIER_VERIFIED      → carrierile: "Profiil kinnitatud, saad pakkumisi teha"
```

---

## Frontend route'id

```typescript
const routes = [
  { path: '', component: HomeComponent },
  { path: 'veod', component: MarketplaceComponent },
  { path: 'veod/uus', component: NewListingComponent, canActivate: [AuthGuard] },
  { path: 'veod/:id', component: ListingDetailComponent },
  { path: 'vedaja/:id', component: CarrierPublicProfileComponent },
  { path: 'minu-veod', component: MyListingsComponent, canActivate: [AuthGuard] },
  { path: 'minu-pakkumised', component: MyOffersComponent, canActivate: [AuthGuard] },
  { path: 'vedaja-profiil', component: CarrierProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
];
```

---

## Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: koormaturg
      POSTGRES_USER: koormaturg
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/koormaturg
      SPRING_DATASOURCE_USERNAME: koormaturg
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      RESEND_API_KEY: ${RESEND_API_KEY}
      APP_UPLOAD_DIR: /uploads
    volumes:
      - uploads_data:/uploads
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    depends_on:
      - backend

volumes:
  postgres_data:
  uploads_data:
```

## Caddyfile

```
koormaturg.ee {
    handle /api/* {
        reverse_proxy backend:8080
    }
    handle {
        reverse_proxy frontend:80
    }
}
```

---

## application.yml

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  flyway:
    enabled: true
    locations: classpath:db/migration

jwt:
  secret: ${JWT_SECRET}
  access-token-expiry: 900       # 15 min
  refresh-token-expiry: 604800   # 7 päeva

stripe:
  secret-key: ${STRIPE_SECRET_KEY}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET}
  service-fee-cents: 1200        # 12.00 EUR

resend:
  api-key: ${RESEND_API_KEY}
  from: noreply@koormaturg.ee

app:
  upload-dir: ${APP_UPLOAD_DIR:/uploads}
  upload-max-size-mb: 5
  payment-deadline-hours: 24
  listing-expiry-days: 30
```

---

## Ülesannete järjekord

### Faas 1 — Backend alus
- [ ] Spring Boot projekt + Maven setup
- [ ] PostgreSQL + Flyway migration (V1__init.sql)
- [ ] User entity + UserRepository
- [ ] JWT auth (register, login, refresh, logout)
- [ ] Spring Security config (CORS, JWT filter)

### Faas 2 — Core backend
- [ ] CarrierProfile entity + service + controller
- [ ] Faili upload (litsents, kindlustus) — multipart endpoint
- [ ] FreightListing entity + service + controller + otsing/filter
- [ ] FreightOffer entity + service + controller
- [ ] Aktsepteerimise loogika + payment deadline

### Faas 3 — Makse + email
- [ ] Stripe PI loomine aktsepteerimisel
- [ ] Stripe webhook handler
- [ ] Scheduled job: aegunud payment deadline'id
- [ ] Resend email service + kõik template'id

### Faas 4 — Frontend alus
- [ ] Angular projekt + routing + Angular Material theme
- [ ] AuthService + interceptor + guards
- [ ] Login + Register lehed
- [ ] Home leht (marketing + CTA)

### Faas 5 — Frontend core
- [ ] MarketplaceComponent (nimekiri + filterid)
- [ ] NewListingComponent (postitusvorm)
- [ ] ListingDetailComponent (detailid + pakkumised + Stripe Elements)
- [ ] CarrierProfileComponent (registreerimine + dokumendi upload)
- [ ] MyListingsComponent + MyOffersComponent

### Faas 6 — Polish
- [ ] Admin paneel (vedajate kinnitamine)
- [ ] RatingComponent
- [ ] CarrierPublicProfileComponent (hinnangud, statistika)
- [ ] Loading states, error handling, toasts
- [ ] Mobile responsive
- [ ] Docker Compose + Caddyfile

---

## Testimine

```bash
# Backend unit testid
./mvnw test

# Stripe test kaart
4242 4242 4242 4242  exp: 12/34  cvc: 123

# Täielik flow:
# 1. Registreeri 2 kasutajat: poster + carrier
# 2. Carrier: täida profiil, laadi üles dokumendid
# 3. Admin: kinnita carrier
# 4. Poster: postita veotellimus
# 5. Carrier: tee pakkumine
# 6. Poster: aktsepteeri pakkumine
# 7. Poster: maksa 12€ (Stripe test)
# 8. Kontrolli webhook → status MATCHED
# 9. Poster: märgi COMPLETED
# 10. Mõlemad: anna hinnang
```

---

## MVP skoobist väljas (hilisem)

- GPS/live tracking
- In-app chat
- Dokumendi automaatne kehtivuse kontroll (API)
- Rahvusvaheline vedu (esialgu EE + LV + LT)
- Mobiiliapp
- Vedajate otsingukaart
- Kindlustuspartneri integratsioon
