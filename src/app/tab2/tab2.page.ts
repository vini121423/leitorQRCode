import { Component } from '@angular/core';
import { Historico } from '../models/historico';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { HistoricoService } from '../services/historico.service';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	public listaHistoricos: Historico[] = [];

	constructor(private historicoService: HistoricoService) {
		registerLocaleData(localePtBr);
	}

	public buscarHistorico() {
		this.listaHistoricos = [];

		this.historicoService.getAll().subscribe(dados => {
			this.listaHistoricos = dados.map(registro => {
				return {
					$key: registro.payload.doc.id,
					leitura: registro.payload.doc.data()['leitura'],
					dataHora: new Date(registro.payload.doc.data()['dataHora']['seconds'] * 1000)
				} as Historico;
			});
		});
	}

	async ionViewWillEnter() {
		await this.buscarHistorico();
	}

	public deletarHistorico(key: string) {
		this.historicoService.delete(key);
		this.buscarHistorico();
	}
}
