import { newUser } from './../auth/auth.page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, MenuController, IonSlides } from '@ionic/angular';

// Validação dos formulários
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Services
import { AlertService } from 'src/app/services/alert/alert.service';
import { ServiceCepService } from 'src/app/services/cep/service-cep.service';

// Firebase
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'Firebase';

// User Model para controle de dados e persistência das informações.
export class User {
  nome:         string;
  email:        string;
  password:     string;
  cnpj:         string;
  cpf:          string;
  rg:           string;
  rz_social:    string;
  nomeEstab:    string;
  telefone:     number;
  telefone2:    number;
  cep:          number;
  rua:          string;
  cidade:       string;
  estado:       string;
  bairro:       string;
  numero:       number;
  complemento:  string;
  plano:        string;
  aceiteTermos: string;
  dataCad:      string;
  userPassword: string;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  // Controle de slides.
  @ViewChild(IonSlides) slides: IonSlides;
  public indexSlide: Number;

  // Controle de tab do campo
  @ViewChild('cnpj') cnpjField;

  // Variáveis para controle dos buttons
  public showBack = false;
  public showContinuar = true;

  // Dados dos planos
  public planos: any;

  selectedRadioGroup:any;
  
  // Validação do formulário
  public formEstab:    FormGroup;
  public formUserData: FormGroup;

  // CNPJ válido
  public cnpjValid: boolean = false;

  // CEP
  //public baseUrl: String = "https://viacep.com.br/ws/";
  private enderecoApi: any = {};
  public cep_valido = false;
  
  // Input para validar a senha
  validaSenha: string;

  public newUserEstab:User = new User();
  public progress: number = 0.2;

  constructor(
              public navCtrl:      NavController,
              public menuCtrl:     MenuController,
              public alertCtrl:    AlertService,
              private formBuilder: FormBuilder,
              private route:       ActivatedRoute, 
              private router:      Router,
              private viaCep:      ServiceCepService,
              private afAuth:      AngularFireAuth,
              private afDatabase:  AngularFireDatabase) { 

    // Validação dos campos do formulário do estabelecimento
    this.formEstab = this.formBuilder.group({
      'cnpj':        [null, Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(18)])],
      'rz_social':   [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      'nomeEstab':   [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      'telefone':    [null, Validators.compose([Validators.required, Validators.minLength(9)])],
      'telefone2':   [null, Validators.compose([Validators.required, Validators.minLength(9)])],
      'cep':         [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(9)])],
      'cidade':      [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'estado':      [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'rua':         [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      'bairro':      [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      'numero':      [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      'complemento': [null, Validators.compose([Validators.required, Validators.minLength(1)])],
    });

    // Validação dos campos de dados do usuário
    this.formUserData = this.formBuilder.group({
      'username':     [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'cpf':          [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'rg':           [null, Validators.compose([Validators.required, Validators.minLength(9)])], 
      'userPassword': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'validaSenha':  [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

  }
  
  ngOnInit() {
    
    // Desabilita a exibição do sidemenu.
    this.menuCtrl.enable(false);
    this.selectPlan();

    // Recebendo dados da pagina anterior de cadastro
    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.state) {
        this.newUserEstab = this.router.getCurrentNavigation().extras.state.userData;
      }
    });
  }


  // Sair do foco do campo complemento
  returnTabIndex() {
    this.cnpjField.setFocus();
    console.log("campo complemento");
  }

  // Controle do botão avançar slide no cadastro
  continuarCad(event: any) {

    // Verificar se os campos obrigatórios foram preenchidos
    if(!this.formEstab.valid) {
      console.log(this.formEstab.valid);
      this.alertCtrl.showAlertwithMessage("Erro", "", "O formulário contem campos não preenchidos corretamente. Por favor verifique para continuar.");
    }
    else {
      // Verifica se CNPJ OK
      this.validaCnpj();
      
      if(this.indexSlide == 0 || this.indexSlide == null){
        console.log("slide 0");

        if(this.cnpjValid){
          erroForm = false;
        }
        else {
          // Libera mudança de slide do cadastro.
          erroForm = true;
        }
      }
      

    // Verifica se escolheu um plano
    if(this.indexSlide == 1){
      if(!this.newUserEstab.plano) {
        var erroForm = true;
        this.alertCtrl.showAlertwithMessage("Erro", "Verifique", "Escolha um plano para continuar");
      }
      else {
        // Não há erro na escolha do plano.
        erroForm = false;
      }
    }

    if(this.indexSlide == 2) {
      if(!this.formUserData.valid){
        this.alertCtrl.showAlertwithMessage("Erro", "Verificar", "O formulário contem campos não preenchidos corretamente. Por favor verifique para continuar.");
        erroForm = true;
      }
      else {
        // Não há erro no preenchimento dos dados do usuário
        erroForm = false;
      }
    }

    // Valida senhas digitadas no formulão se são iguais
    if(this.indexSlide == 2) {

      if(this.newUserEstab.userPassword == this.validaSenha) {
        // Se iguais, libera mudar de slide. 
        erroForm = false;
      }
      else {
        // Senha diferentes, bloqueia o slide do formulário
        erroForm = true;
        // Exibe alerta de erro.
        this.alertCtrl.showAlertwithMessage("Erro", "Verificar", "As senhas devem ser iguais.");
      }

      if(!this.formUserData.valid) {
        erroForm = true;
      }
    }

    // Validação o CEP
    if(this.indexSlide == 0 || this.indexSlide == null) {
      // Controle do slide para o CEP
      if(this.cep_valido) {
        // Libera transição de tela do CEP
      }
      else {
        // Bloqueia
       erroForm = true;
       this.newUserEstab.cep = null;
      }
    }

    // Controle de transição dos slides
    if(!erroForm){
      // Adiciona valor ao marcador de progresso do cadastro.
      this.progress = this.progress + 0.2;
      // Próximo slide
      this.slides.slideNext();
  
      // Verifica index do slide
      this.slides.getActiveIndex().then(i => {
        this.indexSlide = i;
        
  
        // Habilita exibição do botão voltar ao iniciar o slide.
        this.showBack = true;
  
        // Verifica exibição do botão continuar
        if(this.indexSlide === 4) {
          this.showContinuar = false;
        }
      });
    } 
  }
}

  // Controle do botão voltar dentro dos slides.
  voltarCad(event: any) {
    // Slide anterior
    this.slides.slidePrev();

    // Verifica index do slide
    this.slides.getActiveIndex().then(i => {
      this.indexSlide = i;
    });

    // Verificação de index para exibição do button.
    if(this.indexSlide == 1) {
      this.showBack = false;
    }

    // Verifica exibição do botão continuar
    if(this.indexSlide == 4) {
      this.showContinuar = true;
    }
    this.progress = this.progress - 0.2;
  }

  radioGroupChange(event) {
    this.selectedRadioGroup = event.detail;
  }

  // Seleção dos planos cadastrados no Firebase
  selectPlan() {
    // Buscar no firebase todos os planos
    this.afDatabase.list('planos/').valueChanges().subscribe(data => {
      this.planos = data;
      console.log(data);
    });
  }

  // Lógica para validação dos digitos contidos no campo CNPJ
  validaCnpj() {
   
    // Variável com CNPJ digitado pelo usuário
    let cnpj = this.newUserEstab.cnpj;
    // Variáveis de controle dos validadores
    let tamanho, numeros, digitos, soma, resultado, pos, i;

    // Retira caracteres especiais da string
    cnpj = cnpj.replace(/[^\d]+/g,'');
  
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999") {
          
        this.cnpjValid = false;
        // Exibe mensaagem de erro
        this.alertCtrl.presentAlert();
    }
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    
    soma = 0;
    pos = tamanho - 7;
    
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
    if (resultado != digitos.charAt(0)){
      // Ocorreu erro na validação
      this.cnpjValid = false;
    }
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
    if (resultado != digitos.charAt(1)) {
      this.cnpjValid = false;
      this.alertCtrl.showAlertwithMessage("Erro", "Verifique", `O campo do CNPJ ${this.newUserEstab.cnpj} não é um numero válido.`);
    }
    else {
      // não há erro na validação do CNPJ digitado.
      this.cnpjValid = true;
    }
  }

  // Finalização do cadastro
  finalizarCadastro() {

    // Atribuir data ao cadastro realizado.
    this.newUserEstab.dataCad = new Date().toISOString();

    // Instância do Cloud Firestore
    let firestore = firebase.firestore();

    // Cria usuário e senha no authentication do Firebase
    this.afAuth.auth.createUserWithEmailAndPassword(this.newUserEstab.email, this.newUserEstab.userPassword)
      .then((data => {
        // Set displayName
        let uid_currentUser = this.afAuth.auth.currentUser.uid;
        data.user.updateProfile({
          displayName: this.newUserEstab.nome
      });

      // Salvar cadastro no Cloud Firestore
      firestore.collection("estabelecimentos")
      .doc(uid_currentUser)
      .set({
        // Sobre o estabelecimento
        cnpj:        this.newUserEstab.cnpj,
        rz_social:   this.newUserEstab.rz_social,
        nome_estab:  this.newUserEstab.nomeEstab,
        telefone:    this.newUserEstab.telefone,
        telefone2:   this.newUserEstab.telefone2,
        rua:         this.newUserEstab.rua,
        cidade:      this.newUserEstab.cidade,
        estado:      this.newUserEstab.estado,
        cep:         this.newUserEstab.cep,
        numero:      this.newUserEstab.numero,
        complemento: this.newUserEstab.complemento,

        // Plano escolhido
        plano:       this.newUserEstab.plano,

        // Sobre o dono do estabelecimento e login
        username:    this.newUserEstab.nome,
        email:       this.newUserEstab.email,
        cpf:         this.newUserEstab.cpf,
        rg:          this.newUserEstab.rg,

        // Dados bancários

        // Dados de controle da aplicação
        dataCad:     this.newUserEstab.dataCad

      })
      .then(() => {

        // Exibe mensagem de sucesso
        this.alertCtrl.showAlertwithMessage("Sucesso", "", "Usuário cadastrado com sucesso. Entre com seu e-mail e senha.");

        // Limpa campos utilizados no formulário
        this.limparCamposCad();
        // Redireciona para página de login
        this.navCtrl.navigateBack('auth');

      })


      }), (erro) => {
        console.error(erro);
      })

  }

  // Limpa campo do formulário
  limparCamposCad() {
    this.newUserEstab.cnpj        = null;
    this.newUserEstab.rz_social   = null;
    this.newUserEstab.nomeEstab   = null;
    this.newUserEstab.telefone    = null;
    this.newUserEstab.telefone2   = null;
    this.newUserEstab.rua         = null;
    this.newUserEstab.cidade      = null;
    this.newUserEstab.estado      = null;
    this.newUserEstab.cep         = null;
    this.newUserEstab.numero      = null;
    this.newUserEstab.complemento = null;
    this.newUserEstab.plano       = null;
    this.newUserEstab.nome        = null;
    this.newUserEstab.email       = null;
    this.newUserEstab.cpf         = null;
    this.newUserEstab.rg          = null;
    this.newUserEstab.dataCad     = null;
  }

  // Busca CEP
  buscaCEP() {

    // Recebe valor digitado no campo
    let cep_recebido: string = this.newUserEstab.cep.toString();
    //Nova variável "cep" somente com dígitos.
    var newCep = cep_recebido.replace(/\D/g, '');

    this.viaCep.getServiceCep(newCep)
    .subscribe(data => {
      this.enderecoApi = data;

        console.log("passei no 1 callback");
        console.log(this.enderecoApi);
      
        if(data.erro){
          // Bloqueia a transição de tela por erro no CEP
          this.cep_valido = false;
          this.alertCtrl.showAlertwithMessage("Erro", "", "CEP não encontrado");
        }
        else {
          // Atribuição aos campos no formulário
          this.newUserEstab.rua    = this.enderecoApi.logradouro;
          this.newUserEstab.cidade = this.enderecoApi.localidade;
          this.newUserEstab.estado = this.enderecoApi.uf;
          this.newUserEstab.bairro = this.enderecoApi.bairro;

          // Valida a transição de tela
          this.cep_valido = true;
        }

    }, erro => {
      // Bloqueia a transição de tela por erro no CEP
      this.cep_valido = false;

      // Exibe mensagem de erro por estrutura de CEP errada
      this.alertCtrl.showAlertwithMessage("Erro", "", "CEP inválido");
      
    });
  }

}