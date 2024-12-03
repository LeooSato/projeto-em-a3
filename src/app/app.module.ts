import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatrizComponent } from './components/matriz/matriz.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VisualizarRelatoriosComponent } from './components/visualizar-relatorios/visualizar-relatorios.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // DashboardComponent,
    // VisualizarRelatoriosComponent
    // LoginComponent,
    // RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,MatrizComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
