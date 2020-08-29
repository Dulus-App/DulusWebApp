import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public chatUsers = [];
  public indexSelected: number;
  constructor() { }

  ngOnInit() {

    // ChatUsers exemplo
  this.chatUsers = [
    {
      nome: "John Doe",
      desc: "ultima msg de John Doe",
      img_url: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
    },
    {
      nome: "Jack Sparrow",
      desc: "ultima msg de Jack Sparrow",
      img_url: "https://cdn-ofuxico.akamaized.net/img/upload/noticias/2017/05/20/johnny-depp-so-atende-se-for-chamado-de-jack-sparrow_294577_36.jpg"
    },
    {
      nome: "Spider Man",
      desc: "ultima msg de jaSpider Mane",
      img_url: "https://conteudo.imguol.com.br/c/entretenimento/ba/2018/12/19/cena-do-game-homem-aranha-exclusivo-para-o-playstation-4-1545237822496_v2_450x337.png"
    },
    {
      nome: "Duende Verde",
      desc: "ultima msg de Duende Verde",
      img_url: "https://kanto.legiaodosherois.com.br/w760-h398-gnw-cfill-q80/wp-content/uploads/2020/06/legiao_8Mmc2YxZ9NdT.jpg.jpeg"
    },
    {
      nome: "Vespa",
      desc: "ultima msg de Vespa",
      img_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT80GGLNicJExTy6xcN0kIc6ivhwnabwmfIyg&usqp=CAU"
    },
    {
      nome: "Homem Formiga",
      desc: "ultima msg de Homem Formiga",
      img_url: "https://sm.ign.com/t/ign_br/blogroll/a/ant-man-te/ant-man-teased-for-disney-infinity-30_gmvs.1280.jpg"
    },
    {
      nome: "Atom",
      desc: "ultima msg de Atom",
      img_url: "https://i.pinimg.com/474x/ab/0f/68/ab0f680ccd09667fc8bd865daffbfcc4.jpg"
    },
    {
      nome: "Ciclope",
      desc: "ultima msg de Ciclope",
      img_url: "https://rollingstone.uol.com.br/media/_versions/james_marsden_como_ciclope_em_x-men_foto_divulgacao_widelg.jpg"
    },
    {
      nome: "Mulher Maravilha",
      desc: "ultima msg de Mulher Maravilha",
      img_url: "https://s2.glbimg.com/37GlNULDozeSewHU2FJbzqrf7BU=/e.glbimg.com/og/ed/f/original/2019/12/09/mulher_maravilha_teaser.jpg"
    },
    {
      nome: "Batman",
      desc: "ultima msg de Batman",
      img_url: "https://www.revistabula.com/wp/wp-content/uploads/2019/10/Batman-610x350.jpg"
    },
    {
      nome: "Iron Man",
      desc: "ultima msg de Iron Man",
      img_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRFoSzJGLF_c6E8U3b3BP-bTwsbBo_AZxm-OQ&usqp=CAU"
    },
    {
      nome: "Capitão America",
      desc: "ultima msg de Capitão america",
      img_url: "https://cdn.domestika.org/c_limit,dpr_auto,f_auto,q_auto,w_820/v1447276411/content-items/001/450/057/CapitanAmericaCara-original.jpg?1447276411"
    },
    {
      nome: "John Snow",
      desc: "ultima msg de John Snow",
      img_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT3ldggICzkiudDT6sk_8sGODLajahLpyspnA&usqp=CAU"
    }
]

  }


  startChat(userChat: any, index: number) {

    console.log("userChat: ", userChat);
    console.log("index: ", index);
    this.indexSelected = index;
    
  }

}
