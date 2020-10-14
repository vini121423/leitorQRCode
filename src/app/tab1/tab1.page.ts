import { Component, ChangeDetectorRef } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HistoricoService } from '../services/historico.service';
import { Historico } from '../models/historico';


@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	public leitorQRCode: any;
	public content: HTMLElement;
	public imgLogo: HTMLElement;
	public footer: HTMLElement;

	public leitura: string;
	public link = false;

	constructor(private qrScanner: QRScanner,
		public alertController: AlertController,
		public platform: Platform,
		private scOrientation: ScreenOrientation,
		private cdRef: ChangeDetectorRef,
		private hsService: HistoricoService) {

		this.scOrientation.lock(this.scOrientation.ORIENTATIONS.PORTRAIT);

		this.platform.backButton.subscribeWithPriority(0, () => {
			this.content.style.opacity = "1";
			this.imgLogo.style.opacity = "1";

			this.leitura = null;
			this.link = false;
			this.qrScanner.hide();
			this.leitorQRCode.unsubscribe(); // Stop Scanning
		});

	}

	public async lerQrCode() {

		this.qrScanner.prepare()
			.then((status: QRScannerStatus) => {
				if (status.authorized) {
					this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement;
					this.imgLogo = document.getElementById('logo') as HTMLElement;
					this.footer = document.getElementById('footer') as HTMLElement;

					this.content.style.opacity = "0";
					this.imgLogo.style.opacity = "0";
					this.footer.style.opacity = "0";

					this.qrScanner.show(); // Show camera preview

					this.leitorQRCode = this.qrScanner.scan().subscribe(async (text: string) => {

						this.leitura = (text['result']) ? text['result'] : text;

						this.content.style.opacity = "1";
						this.imgLogo.style.opacity = "1";
						this.footer.style.opacity = "1";

						this.qrScanner.hide();
						this.leitorQRCode.unsubscribe(); // Stop Scanning

						// this.presentAlert('LEITURA:', this.leitura);
						this.verificaLink(this.leitura);
						this.cdRef.detectChanges();

						const historico = new Historico();
						historico.leitura = this.leitura;
						historico.dataHora = new Date();

						await this.hsService.create(historico).then(resposta => {
							console.log(resposta);
						}).catch(erro => {
							this.presentAlert('Erro!', 'Erro ao salvar os dados');
							console.log(erro);
						})

					});

				} else if (status.denied) {

				} else {

				}
			})
			.catch((e: any) => console.log('Erro na aplicação', e));
	}

	async presentAlert(title: string, msg: string) {
		const alert = await this.alertController.create({
			header: title,
			message: msg,
			buttons: ['OK']
		});

		await alert.present();
	}

	public verificaLink(texto: string) {
		const inicio = texto.substring(0, 4);
		if (inicio == 'www.' || inicio == 'http') {
			this.link = true;
		} else {
			this.link = false;
		}
	}
}
