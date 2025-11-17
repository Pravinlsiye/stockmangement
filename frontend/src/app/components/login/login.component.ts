import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <!-- Left Side - Login Form -->
      <div class="login-left">
        <!-- Login Card -->
        <div class="login-card" *ngIf="!showRegister">
        <div class="login-header">
          <h1><i class="fas fa-lock"></i> Login</h1>
          <p>Welcome to Stock Management System</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              placeholder="Enter your email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            />
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-message">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="fas fa-key"></i> Password
            </label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              placeholder="Enter your password"
              autocomplete="current-password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            />
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
              Password is required
            </div>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">
              <i class="fas fa-sign-in-alt"></i> Login
            </span>
            <span *ngIf="isLoading">
              <i class="fas fa-spinner fa-spin"></i> Logging in...
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>Don't have an account? <a (click)="toggleToRegister()" class="link">Register here</a></p>
        </div>
      </div>

      <!-- Register Card -->
      <div class="login-card" *ngIf="showRegister">
        <div class="login-header">
          <h1><i class="fas fa-user-plus"></i> Register</h1>
          <p>Create a new account</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="login-form">
          <div class="form-group">
            <label for="reg-username">
              <i class="fas fa-user"></i> Username
            </label>
            <input
              type="text"
              id="reg-username"
              formControlName="username"
              class="form-control"
              placeholder="Choose a username"
              [class.error]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
            />
            <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="error-message">
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="reg-email">
              <i class="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="reg-email"
              formControlName="email"
              class="form-control"
              placeholder="Enter your email"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            />
            <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
            </div>
          </div>

          <div class="form-group">
            <label for="reg-password">
              <i class="fas fa-key"></i> Password
            </label>
            <input
              type="password"
              id="reg-password"
              formControlName="password"
              class="form-control"
              placeholder="Choose a password"
              autocomplete="new-password"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            />
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
              Password is required (min 6 characters)
            </div>
          </div>

          <div *ngIf="registerErrorMessage" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i> {{ registerErrorMessage }}
          </div>

          <div *ngIf="registerSuccessMessage" class="alert alert-success">
            <i class="fas fa-check-circle"></i> {{ registerSuccessMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="registerForm.invalid || isRegistering"
          >
            <span *ngIf="!isRegistering">
              <i class="fas fa-user-plus"></i> Register
            </span>
            <span *ngIf="isRegistering">
              <i class="fas fa-spinner fa-spin"></i> Registering...
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>Already have an account? <a (click)="toggleToLogin()" class="link">Login here</a></p>
        </div>
      </div>
      </div>

      <!-- Right Side - Promotional Content -->
      <div class="login-right">
        <div class="promo-content">
          <div class="promo-header">
            <h2>Welcome to StockPro</h2>
            <p class="promo-subtitle">Inventory Management System</p>
          </div>
          
          <div class="promo-features">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-boxes"></i>
              </div>
              <div class="feature-text">
                <h3>Product Management</h3>
                <p>Track and manage your inventory with ease</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="feature-text">
                <h3>Analytics & Reports</h3>
                <p>Get insights into your sales and inventory trends</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="feature-text">
                <h3>Sales Management</h3>
                <p>Process sales and generate bills efficiently</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-bell"></i>
              </div>
              <div class="feature-text">
                <h3>Low Stock Alerts</h3>
                <p>Never run out of stock with automated alerts</p>
              </div>
            </div>
          </div>

          <div class="promo-footer">
            <p><i class="fas fa-shield-alt"></i> Secure & Reliable</p>
            <p><i class="fas fa-cloud"></i> Cloud-Ready</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .login-left {
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 30px;
      background: #f8f9fa;
      overflow: hidden;
      height: 100vh;
    }

    .login-right {
      flex: 0 0 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 40px;
      position: relative;
      overflow: hidden;
      height: 100vh;
    }

    .login-right::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 20s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
      position: relative;
      overflow: hidden;
    }

    .login-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    .promo-content {
      position: relative;
      z-index: 1;
      color: white;
      max-width: 500px;
      width: 100%;
    }

    .promo-header {
      margin-bottom: 35px;
    }

    .promo-header h2 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 1.2;
    }

    .promo-subtitle {
      font-size: 18px;
      opacity: 0.9;
      font-weight: 300;
    }

    .promo-features {
      margin-bottom: 30px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 22px;
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .feature-item:nth-child(1) { animation-delay: 0.1s; }
    .feature-item:nth-child(2) { animation-delay: 0.2s; }
    .feature-item:nth-child(3) { animation-delay: 0.3s; }
    .feature-item:nth-child(4) { animation-delay: 0.4s; }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .feature-text h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .feature-text p {
      font-size: 14px;
      opacity: 0.9;
      line-height: 1.4;
      margin: 0;
    }

    .promo-footer {
      display: flex;
      gap: 25px;
      padding-top: 25px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 13px;
      opacity: 0.9;
    }

    .promo-footer p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    .promo-footer i {
      font-size: 16px;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 25px;
    }

    .login-header h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 26px;
      font-weight: 700;
    }

    .login-header h1 i {
      margin-right: 10px;
      color: #667eea;
    }

    .login-header p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .login-form {
      margin-top: 15px;
    }

    .form-group {
      margin-bottom: 18px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
      font-size: 14px;
    }

    .form-group label i {
      margin-right: 8px;
      color: #667eea;
    }

    .form-control {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
    }

    .btn-block {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 10px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-footer {
      text-align: center;
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid #e0e0e0;
    }

    .login-footer p {
      color: #666;
      font-size: 14px;
    }

    .link {
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    .alert {
      padding: 12px 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 14px;
    }

    .alert-error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    .alert-success {
      background-color: #efe;
      color: #3c3;
      border: 1px solid #cfc;
    }

    .alert i {
      margin-right: 8px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .login-container {
        flex-direction: column;
      }

      .login-left {
        flex: none;
        min-height: auto;
        padding: 30px 20px;
      }

      .login-right {
        flex: none;
        padding: 40px 30px;
        min-height: auto;
      }

      .promo-header h2 {
        font-size: 32px;
      }

      .promo-subtitle {
        font-size: 18px;
      }

      .feature-item {
        margin-bottom: 25px;
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        font-size: 20px;
      }

      .feature-text h3 {
        font-size: 18px;
      }

      .feature-text p {
        font-size: 14px;
      }
    }

    @media (max-width: 768px) {
      .login-left {
        padding: 20px 15px;
      }

      .login-right {
        padding: 30px 20px;
      }

      .login-card {
        padding: 30px 25px;
        border-radius: 12px;
        max-width: 100%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      }

      .promo-header {
        margin-bottom: 30px;
      }

      .promo-header h2 {
        font-size: 28px;
      }

      .promo-subtitle {
        font-size: 16px;
      }

      .promo-features {
        margin-bottom: 30px;
      }

      .feature-item {
        margin-bottom: 20px;
        gap: 15px;
      }

      .feature-icon {
        width: 44px;
        height: 44px;
        font-size: 18px;
      }

      .promo-footer {
        flex-direction: column;
        gap: 15px;
        padding-top: 20px;
      }

      .login-header h1 {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .login-header p {
        font-size: 13px;
      }

      .form-group {
        margin-bottom: 18px;
      }

      .form-group label {
        font-size: 13px;
        margin-bottom: 6px;
      }

      .form-control {
        padding: 14px 15px;
        font-size: 16px; /* Prevents zoom on iOS */
        border-radius: 10px;
      }

      .btn-block {
        padding: 16px;
        font-size: 16px;
        border-radius: 10px;
        margin-top: 15px;
      }

      .login-footer {
        margin-top: 25px;
        padding-top: 20px;
      }

      .login-footer p {
        font-size: 13px;
        line-height: 1.6;
      }

      .alert {
        padding: 14px 15px;
        font-size: 13px;
        border-radius: 10px;
      }
    }

    @media (max-width: 480px) {
      .login-left {
        padding: 15px 10px;
      }

      .login-right {
        padding: 25px 15px;
      }

      .login-card {
        padding: 25px 20px;
      }

      .login-header h1 {
        font-size: 22px;
      }

      .form-control {
        padding: 12px 14px;
      }

      .btn-block {
        padding: 14px;
      }

      .promo-header h2 {
        font-size: 24px;
      }

      .promo-subtitle {
        font-size: 14px;
      }

      .feature-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .feature-icon {
        margin: 0 auto;
      }
    }

    /* Large screens */
    @media (min-width: 1440px) {
      .login-left {
        padding: 40px 50px;
      }

      .login-right {
        padding: 50px 60px;
      }

      .login-card {
        max-width: 450px;
        padding: 40px;
      }

      .promo-content {
        max-width: 550px;
      }

      .promo-header h2 {
        font-size: 40px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  showRegister = false;
  isLoading = false;
  isRegistering = false;
  errorMessage = '';
  registerErrorMessage = '';
  registerSuccessMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.message === 'Login successful') {
            // Get return URL from route parameters or default to dashboard
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigateByUrl(returnUrl);
          } else {
            this.errorMessage = response.message || 'Login failed';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Invalid email or password';
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isRegistering = true;
      this.registerErrorMessage = '';
      this.registerSuccessMessage = '';

      const registerData = this.registerForm.value;
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isRegistering = false;
          if (response.id) {
            this.registerSuccessMessage = 'Registration successful! You can now login.';
            // Switch to login form after 2 seconds
            setTimeout(() => {
              this.toggleToLogin();
              this.registerForm.reset();
            }, 2000);
          } else {
            this.registerErrorMessage = response.message || 'Registration failed';
          }
        },
        error: (error) => {
          this.isRegistering = false;
          this.registerErrorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  toggleToRegister(): void {
    this.showRegister = true;
    this.errorMessage = '';
    this.registerErrorMessage = '';
    this.registerSuccessMessage = '';
    this.loginForm.reset();
  }

  toggleToLogin(): void {
    this.showRegister = false;
    this.errorMessage = '';
    this.registerErrorMessage = '';
    this.registerSuccessMessage = '';
    this.registerForm.reset();
  }
}

