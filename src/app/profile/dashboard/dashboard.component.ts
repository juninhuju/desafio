// src/app/profile/dashboard/dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Mantenha CommonModule se usar NgIf, NgFor, etc.
import { RiskProfileComponent } from '../../risk-profile/risk-profile.component';
import { PortfolioComponent } from "../portfolio/portfolio.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RiskProfileComponent // Incluído se você usar diretivas comuns (NgIf, NgFor)
    // AsyncPipe removido, pois não está sendo usado no template.
    ,
    PortfolioComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // ...
}