import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api/api.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonicModule,ReactiveFormsModule],
})
export class LoginPage implements OnInit {

  reactiveForm_login_login !: FormGroup;
  submitted: boolean = false
  loading_login_login: boolean = false
  showPassword: boolean = false;
  constructor(private formBuilder: FormBuilder, public api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.init_form()
  }
  init_form() {
    this.reactiveForm_login_login = this.formBuilder.group({
      email: ["saloumfall45@gmail.com", Validators.required],
      password: ["Stock_Admin_Facile", Validators.required]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_login_login.controls; }
  // validation du formulaire
  onSubmit_login_login() {
    this.submitted = true;
    console.log(this.reactiveForm_login_login.value)
    // stop here if form is invalid
    if (this.reactiveForm_login_login.invalid) {
      return;
    }
    var login = this.reactiveForm_login_login.value
    this.login_login(login)
  }
  // vider le formulaire
  onReset_login_login() {
    this.submitted = false;
    this.reactiveForm_login_login.reset();
  }
  login_login(login: any) {
    this.loading_login_login = true;
    this.api.taf_post("login", login, async (reponse: any) => {
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table login. Réponse= ", reponse);
        this.onReset_login_login()
        await this.api.save_on_local_storage("token", reponse)

        this.api.id_current_entreprise = reponse.entreprises[0].id
        localStorage.setItem("id_current_entreprise", this.api.id_current_entreprise);
        this.api.id_current_privilege = reponse.entreprises[0].id_privilege
        localStorage.setItem("id_current_privilege", this.api.id_current_privilege);

        await this.api.update_data_from_token();
        this.api.Swal_success("Opération éffectuée avec succés")
        this.router.navigate(['tabs']);
      } else {
        console.log("L'opération sur la table login a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_login_login = false;
    }, (error: any) => {
      this.loading_login_login = false;
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
