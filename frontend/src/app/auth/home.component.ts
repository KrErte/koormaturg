import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <!-- Hero -->
    <section class="hero">
      <h1>Tea oma veose hinda enne, kui ütled jah</h1>
      <p class="hero-sub">
        Eesti ja Baltikumi veoste vahendusplatvorm. Postita vedu tasuta, saa pakkumisi sertifitseeritud vedajatelt.
      </p>
      <div class="hero-badge">Postita tasuta — teenustasu ainult 12€ kui vedaja leitud</div>
      <div class="hero-actions">
        <a routerLink="/register" class="btn-dark">Alusta tasuta</a>
        <a routerLink="/login" class="btn-outline">Logi sisse</a>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="feature-grid">
        <div class="feature-item">
          <div class="feature-icon"><mat-icon>edit_note</mat-icon></div>
          <h3>Tasuta postitus</h3>
          <p>Kirjelda oma veose vajadust — marsruut, kuupäev, kauba info. Täiesti tasuta.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><mat-icon>verified_user</mat-icon></div>
          <h3>Kontrollitud vedajad</h3>
          <p>Kõik vedajad on verifitseeritud, omavad litsentse ja kindlustust.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><mat-icon>payments</mat-icon></div>
          <h3>Turvaline makse</h3>
          <p>Stripe kaudu turvaline makse. Teenustasu ainult 12€ kui vedaja leitud.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><mat-icon>speed</mat-icon></div>
          <h3>Kiired pakkumised</h3>
          <p>Pakkumised tulevad kiiresti. Vali parim hind ja vedaja.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><mat-icon>star_rate</mat-icon></div>
          <h3>Hinnangud</h3>
          <p>Vaata vedajate hinnanguid ja arvustusi enne otsustamist.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><mat-icon>schedule</mat-icon></div>
          <h3>24/7 platvorm</h3>
          <p>Postita vedu igal ajal. Vedajad näevad kuulutust koheselt.</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="steps-section">
      <h2>Kuidas see töötab?</h2>
      <div class="steps">
        <div class="step">
          <div class="step-badge">1 <mat-icon>local_shipping</mat-icon></div>
          <h3>Postita vedu</h3>
          <p>Sisesta lähte- ja sihtkoht, kauba info ja soovitud kuupäev.</p>
        </div>
        <div class="step">
          <div class="step-badge">2 <mat-icon>handshake</mat-icon></div>
          <h3>Saa pakkumisi</h3>
          <p>Vedajad näevad sinu kuulutust ja teevad hinnapakkumisi.</p>
        </div>
        <div class="step">
          <div class="step-badge">3 <mat-icon>trending_up</mat-icon></div>
          <h3>Vali parim</h3>
          <p>Vali sobiv vedaja, maksa 12€ teenustasu ja vedu on kinnitatud.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <h2>Mida meie kliendid ütlevad</h2>
      <div class="testimonial-grid">
        <div class="testimonial">
          <p class="quote">"Koormaturg on muutnud veoste leidmise palju lihtsamaks. Varem pidin helistama kümneid firmasid."</p>
          <div class="author"><strong>Andres K.</strong><br><span>Trans Express OÜ</span></div>
        </div>
        <div class="testimonial">
          <p class="quote">"Vedajana saan nüüd ise valida millised veosed mulle sobivad. Väga mugav platvorm."</p>
          <div class="author"><strong>Maris T.</strong><br><span>Nordic Logistics OÜ</span></div>
        </div>
        <div class="testimonial">
          <p class="quote">"12€ teenustasu on väga mõistlik. Kokkuhoid võrreldes traditsioonilise vahendusega on suur."</p>
          <div class="author"><strong>Peeter V.</strong><br><span>Balti Veod OÜ</span></div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>Valmis alustama?</h2>
      <p>Loo konto ja postita oma esimene vedu juba täna — tasuta.</p>
      <a routerLink="/register" class="btn-accent">Alusta tasuta</a>
    </section>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 72px 24px 56px;
      max-width: 700px;
      margin: 0 auto;

      h1 {
        font-size: 40px;
        font-weight: 800;
        line-height: 1.15;
        margin: 0 0 16px;
        color: #1a1a2e;
        letter-spacing: -0.5px;
      }
    }

    .hero-sub {
      font-size: 17px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 24px;
    }

    .hero-badge {
      display: inline-block;
      background: #eef2ff;
      color: #1a3b6e;
      padding: 10px 24px;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 28px;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn-dark {
      background: #1a3b6e;
      color: white;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s;
      &:hover { background: #2557a7; }
    }

    .btn-outline {
      color: #1a3b6e;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      border: 1.5px solid #d1d5db;
      transition: all 0.15s;
      &:hover { border-color: #1a3b6e; background: #f9fafb; }
    }

    .btn-accent {
      display: inline-block;
      background: #e8600a;
      color: white;
      padding: 12px 32px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s;
      &:hover { background: #d4560a; }
    }

    // Features
    .features {
      padding: 56px 24px;
      background: #f7f8fa;
    }

    .feature-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .feature-item {
      text-align: center;
      padding: 28px 20px;

      h3 { font-size: 15px; font-weight: 700; margin: 0 0 6px; color: #1a1a2e; }
      p { font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0; }
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);

      mat-icon { font-size: 24px; width: 24px; height: 24px; color: #1a3b6e; }
    }

    // Steps
    .steps-section {
      padding: 64px 24px;
      text-align: center;
      max-width: 900px;
      margin: 0 auto;

      h2 { font-size: 28px; font-weight: 700; margin: 0 0 40px; color: #1a1a2e; }
    }

    .steps {
      display: flex;
      gap: 32px;
      justify-content: center;
    }

    .step {
      flex: 1;
      max-width: 260px;
      text-align: center;

      h3 { font-size: 16px; font-weight: 700; margin: 0 0 6px; }
      p { font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0; }
    }

    .step-badge {
      width: 56px;
      height: 56px;
      background: #eef2ff;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 14px;
      font-weight: 800;
      font-size: 16px;
      color: #1a3b6e;
      gap: 4px;

      mat-icon { font-size: 22px; width: 22px; height: 22px; color: #1a3b6e; }
    }

    // Testimonials
    .testimonials {
      padding: 64px 24px;
      background: #f7f8fa;
      text-align: center;

      h2 { font-size: 28px; font-weight: 700; margin: 0 0 36px; color: #1a1a2e; }
    }

    .testimonial-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .testimonial {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      text-align: left;

      .quote {
        font-size: 14px;
        color: #374151;
        line-height: 1.6;
        font-style: italic;
        margin: 0 0 16px;
      }

      .author {
        font-size: 13px;
        strong { color: #1a1a2e; }
        span { color: #9ca3af; font-size: 12px; }
      }
    }

    // CTA
    .cta {
      text-align: center;
      padding: 64px 24px;

      h2 { font-size: 28px; font-weight: 700; margin: 0 0 8px; color: #1a1a2e; }
      p { font-size: 16px; color: #6b7280; margin: 0 0 28px; }
    }

    @media (max-width: 768px) {
      .hero h1 { font-size: 28px; }
      .feature-grid { grid-template-columns: 1fr 1fr; }
      .steps { flex-direction: column; align-items: center; }
      .testimonial-grid { grid-template-columns: 1fr; }
      .hero-actions { flex-direction: column; align-items: center; }
    }
  `],
})
export class HomeComponent {}
