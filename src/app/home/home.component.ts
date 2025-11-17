import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RiskProfileDisplayComponent } from "../profile/risk-profile-display/risk-profile-display.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent, RiskProfileDisplayComponent],
  templateUrl: './home.component.html', // <--- AGORA USA ARQUIVO HTML SEPARADO
  styleUrls: ['./home.component.scss'] // <--- ADICIONANDO REFERÊNCIA AO STYLE
})
export class HomeComponent {
  // Lógica de Home, se necessário
}