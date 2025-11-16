import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe módulos do Material se houver botões/ícones complexos, mas por enquanto, mantemos simples.

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Você pode adicionar inputs aqui para mudar o título ou adicionar navegação se necessário
  title: string = "CAIXA Investimentos";
}