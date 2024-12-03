import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatrizComponent } from './components/matriz/matriz.component';
import { GerarRelatorioComponent } from './components/gerar-relatorio/gerar-relatorio.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { VisualizarRelatoriosComponent } from './components/visualizar-relatorios/visualizar-relatorios.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [{
  path:'login',component:LoginComponent
},
{
  path:'register',component:RegisterComponent
},
{ path: 'dashboard', component: DashboardComponent },

{
  path:'matriz',component:MatrizComponent
},
{
  path:'gerar-relatorio',component:GerarRelatorioComponent
},
{
  path:'relatorio',component:RelatorioComponent
},
{path:'visualizar',component:VisualizarRelatoriosComponent},
{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
