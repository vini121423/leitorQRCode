import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	public leitorQRCode: any;
	public content: HTMLElement;
	public imgLogo: HTMLElement;
	
	public leitura: string;

  constructor(private qrScanner: QRScanner,
              public alertController: AlertController) {}
   
   public lerQrCode(){
	   
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
     if (status.authorized) {
		 this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement;
		 this.imgLogo = document.getElementById('logo') as HTMLElement;
		 this.content.style.opacity = "0";
		 this.imgLogo.style.opacity = "0";
		 
		 this.qrScanner.show(); // Show camera preview
		 
       this.leitorQRCode = this.qrScanner.scan().subscribe((text: string) => {
      
	    this.leitura = (text['result']) ? text['result'] : text;
 
         this.content.style.opacity = "1";
		 this.imgLogo.style.opacity = "1";
		 
		 
         this.qrScanner.hide();
         this.leitorQRCode.unsubscribe(); // Stop Scanning
		 
		 this.presentAlert('LEITURA:', this.leitura);
       });

     } else if (status.denied) {
		 
     } else {
		 
     }
  })
  .catch((e: any) => console.log('Erro na aplicação', e));
   }
   
    async presentAlert(title:string,msg:string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
