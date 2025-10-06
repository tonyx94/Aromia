import { Component } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiAromia} from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';


@Component({
  selector: 'aromia-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, InputText, FloatLabelModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  loading = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiAromia
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const user = this.forgotPasswordForm.get('email')?.value;
      
      // this.api.auth.forgotPassword(user).subscribe({
      //   next: () => {
      //     this.loading = false;
      //     this.emailSent = true;
      //   },
      //   error: () => {
      //     this.loading = false;
      //     // Mostrar error
      //   }
      // });
    }
  }
}
