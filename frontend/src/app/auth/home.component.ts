import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1>Veose vahendus<br>lihtsaks tehtud</h1>
        <p>Eesti ja Baltikumi suurim veoste turg. Postita vedu tasuta, maksa ainult siis kui vedaja leitud.</p>
        <div class="hero-actions">
          <a routerLink="/veod" class="btn-hero-primary">Vaata veoseid</a>
          <a routerLink="/register" class="btn-hero-secondary">Alusta tasuta</a>
        </div>
        <div class="hero-stats">
          <div class="stat"><strong>12€</strong><span>teenustasu</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><strong>0€</strong><span>postitus</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><strong>24/7</strong><span>platvorm</span></div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how-it-works">
      <h2>Kuidas see töötab?</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-icon"><mat-icon>edit_note</mat-icon></div>
          <h3>Postita vedu</h3>
          <p>Kirjelda oma veose vajadust — kuhu, millal ja mis kaup. Täiesti tasuta.</p>
        </div>
        <div class="step-connector"><mat-icon>arrow_forward</mat-icon></div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-icon"><mat-icon>handshake</mat-icon></div>
          <h3>Saa pakkumisi</h3>
          <p>Sertifitseeritud vedajad näevad sinu kuulutust ja teevad hinnapakkumisi.</p>
        </div>
        <div class="step-connector"><mat-icon>arrow_forward</mat-icon></div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-icon"><mat-icon>verified</mat-icon></div>
          <h3>Vali ja maksa</h3>
          <p>Vali parim pakkumine. Teenustasu 12€ ainult siis, kui juht leitud.</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="feature-grid">
        <div class="feature">
          <mat-icon>shield</mat-icon>
          <h3>Kontrollitud vedajad</h3>
          <p>Kõik vedajad on verifitseeritud ja omavad vajalikke litsentse.</p>
        </div>
        <div class="feature">
          <mat-icon>payments</mat-icon>
          <h3>Turvaline makse</h3>
          <p>Stripe kaudu turvaline makse, raha liigub alles kinnituse järel.</p>
        </div>
        <div class="feature">
          <mat-icon>star</mat-icon>
          <h3>Hinnangud</h3>
          <p>Vaata vedajate hinnanguid ja vali usaldusväärne partner.</p>
        </div>
        <div class="feature">
          <mat-icon>speed</mat-icon>
          <h3>Kiire ja lihtne</h3>
          <p>Veo postitus võtab alla 2 minuti, pakkumised tulevad kiiresti.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>Valmis alustama?</h2>
      <p>Loo konto ja postita oma esimene vedu juba täna.</p>
      <a routerLink="/register" class="btn-hero-primary">Registreeru tasuta</a>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 60%, #1e3a5f 100%);
      color: white;
      padding: 80px 20px 100px;
      text-align: center;
    }

    .hero-content {
      max-width: 700px;
      margin: 0 auto;

      h1 {
        font-size: 52px;
        font-weight: 800;
        line-height: 1.1;
        margin: 0 0 20px;
        letter-spacing: -1px;
      }

      p {
        font-size: 19px;
        opacity: 0.85;
        line-height: 1.6;
        margin: 0 0 36px;
      }
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }

    .btn-hero-primary {
      background: #ff6b35;
      color: white;
      padding: 14px 36px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
      &:hover { background: #ff8c5e; transform: translateY(-2px); }
    }

    .btn-hero-secondary {
      background: rgba(255,255,255,0.15);
      color: white;
      padding: 14px 36px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      border: 2px solid rgba(255,255,255,0.3);
      transition: all 0.2s;
      &:hover { background: rgba(255,255,255,0.25); }
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      align-items: center;
    }

    .stat {
      strong {
        display: block;
        font-size: 28px;
        font-weight: 800;
      }
      span {
        font-size: 14px;
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.2);
    }

    .how-it-works {
      padding: 80px 20px;
      text-align: center;
      max-width: 1000px;
      margin: 0 auto;

      h2 {
        font-size: 36px;
        font-weight: 700;
        margin: 0 0 48px;
        color: #1a1a2e;
      }
    }

    .steps {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 16px;
    }

    .step {
      flex: 1;
      max-width: 280px;
      position: relative;
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: #ff6b35;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      margin: 0 auto 16px;
    }

    .step-icon {
      width: 72px;
      height: 72px;
      background: #f0f4ff;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: #1e3a5f;
      }
    }

    .step h3 {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #1a1a2e;
    }

    .step p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
    }

    .step-connector {
      padding-top: 80px;
      color: #cbd5e1;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }

    .features {
      background: #f0f4ff;
      padding: 80px 20px;
    }

    .feature-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 32px;
    }

    .feature {
      text-align: center;
      padding: 32px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);

      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #1e3a5f;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 8px;
        color: #1a1a2e;
      }

      p {
        font-size: 14px;
        color: #64748b;
        line-height: 1.5;
        margin: 0;
      }
    }

    .cta {
      text-align: center;
      padding: 80px 20px;

      h2 {
        font-size: 36px;
        font-weight: 700;
        margin: 0 0 12px;
        color: #1a1a2e;
      }
      p {
        font-size: 18px;
        color: #64748b;
        margin: 0 0 32px;
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 { font-size: 36px; }
      .steps { flex-direction: column; align-items: center; }
      .step-connector { padding-top: 0; transform: rotate(90deg); }
      .hero-stats { gap: 20px; }
      .stat strong { font-size: 22px; }
    }
  `],
})
export class HomeComponent {}
