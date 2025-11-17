import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
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
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 450px;
      animation: slideIn 0.3s ease-out;
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
      margin-bottom: 30px;
    }

    .login-header h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 28px;
    }

    .login-header p {
      color: #666;
      font-size: 14px;
    }

    .login-form {
      margin-top: 20px;
    }

    .form-group {
      margin-bottom: 20px;
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
      margin-top: 20px;
      padding-top: 20px;
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

