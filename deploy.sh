#!/bin/bash
set -e

echo "=== Koormaturg Deploy ==="

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

# Install docker-compose if not present
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin
fi

cd /opt/koormaturg

# Create .env if not exists
if [ ! -f .env ]; then
    cat > .env << 'ENVEOF'
DB_PASSWORD=koormaturg_prod_2026
JWT_SECRET=koormaturg-jwt-secret-production-key-must-be-at-least-256-bits-long-change-me!!
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
RESEND_API_KEY=re_placeholder
ENVEOF
fi

echo "Building and starting services..."
docker compose down 2>/dev/null || true
docker compose up --build -d

echo "Waiting for services to start..."
sleep 15

echo "Checking services..."
docker compose ps
echo ""
echo "=== Deploy complete ==="
echo "Backend: http://37.60.225.35:8080"
echo "Frontend: http://37.60.225.35"
