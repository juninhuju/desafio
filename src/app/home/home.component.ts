import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RiskProfileComponent } from "../risk-profile/risk-profile.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent, RiskProfileComponent],
  templateUrl: './home.component.html', // <--- AGORA USA ARQUIVO HTML SEPARADO
  styleUrls: ['./home.component.scss'] // <--- ADICIONANDO REFERÊNCIA AO STYLE
})
export class HomeComponent {
  // Lógica de Home, se necessário
}