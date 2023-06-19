import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../../shared/_validators/must-match.validator';
import { AuthService } from 'src/app/_services/auth.service';
import { catchError, first, throwError } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

    public form!: FormGroup;
    public submitted: boolean = false;
    public error!: string;
    public get f() { return this.form.controls; };

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: this.formBuilder.control(null, { validators: [Validators.required, Validators.email] }),
            password: this.formBuilder.control(null, { validators: Validators.required }),
            confirmPassword: this.formBuilder.control(null, { validators: Validators.required }),
        },
        {
            validators: [
                MustMatch(
                    'password',
                    'confirmPassword',
                    false
                )
            ]
        });
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/products']);
        }
    }

    public register(): void {
        if (!this.form.valid) {
            this.submitted = true;
            return;
        }
        const body = {
            email: this.f['email'].value,
            password: this.f['password'].value
        };
        this.authService.register(body).pipe(
            first(),
            catchError(error => {
                this.error = error.error;
                console.log(error)
                return throwError(error);
            })
        ).subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
