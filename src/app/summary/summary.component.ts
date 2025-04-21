import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vulnerabilities } from '../scan/scan.types';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  @Input() vulnerabilities: Vulnerabilities = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  };
}