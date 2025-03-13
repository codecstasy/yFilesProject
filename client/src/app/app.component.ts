import { Component } from '@angular/core';
import licenseData from 'src/assets/yfiles-2.6/license/license';


import {
  License} from 'yfiles';
import { GraphManipulationComponent } from "./graph-manipulation/graph-manipulation.component";

License.value = licenseData;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GraphManipulationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}