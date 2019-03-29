<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>POC Honda</title>
    <link rel="shortcut icon" href="dist/images/favicon_2.ico" type="image/vnd.microsoft.icon" />
    <!-- CSS -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">
    <link rel="stylesheet" href="dist/css/lib/plugins/jquery.signaturepad.css">
    <link rel="stylesheet" href="dist/css/poc-honda.min.css">
  </head>
  <body>

    <header>
      <h1>
        <a href="#">
          <img src="dist/images/hondalogo.svg" width="205px">
        </a>
      </h1>
    </header>

    <section>
      <form action="" method="post" enctype="multipart/form-data">
        <div class="poc-honda-container">

          <h2>Contrato de seguro</h2>

          <div class="poc-honda-steps">
            <ul>
              <li data-step="1">
                <span class="poc-honda-steps-number">1</span>
                <span class="poc-honda-steps-text">Foto da CNH</span>
              </li>
              <li data-step="2">
                <span class="poc-honda-steps-number">2</span>
                <span class="poc-honda-steps-text">Verificar e-mail</span>
              </li>
              <li data-step="3">
                <span class="poc-honda-steps-number">3</span>
                <span class="poc-honda-steps-text">Dados pessoais</span>
              </li>
              <li data-step="4">
                <span class="poc-honda-steps-number">4</span>
                <span class="poc-honda-steps-text">Contrato</span>
              </li>
            </ul>
          </div>

          <div class="poc-honda-steps-content" data-step-content="1">
            
            <div class="select-file">
              <div class="select-file-img-preview"></div>
              <span class="select-file-name">Nenhum arquivo selecionado...</span>
              <div class="ipt-file">
                <span>
                  <input type="file" name="fileCNH" id="fileCNH" title="">
                  <b>Escolher arquivo</b>
                </span>
              </div>
            </div>
            <div class="poc-honda-steps-button">
              <a href="javascript:changeStep('2');" class="bt">Próximo</a>
            </div>
          </div>

          <div class="poc-honda-steps-content" data-step-content="2">
            <div class="bt-email">
              <p>
                Seu documento está sendo processado, em breve você receberá um e-mail para acesso ao seu contrato.
              </p>
              <!-- <a href="javascript:changeStep('3');" class="bt">Reenviar e-mail de confirmação</a> -->
              <a href="#" class="bt">Reenviar e-mail de confirmação</a>
            </div>
          </div>

          <div class="poc-honda-steps-content" data-step-content="3">

            <div class="loading"><img src="dist/images/loading.gif" width="100px" alt="" style="margin: 50px 0;"></div>

            <div class="form-display">
              <div class="form-group">
                <label>Nome</label>
                <input type="text" name="name" id="name" onfocus="$(this).removeClass('error');">
              </div>
              <div class="form-group">
                <label>RG</label>
                <input type="text" name="rg" id="rg" onfocus="$(this).removeClass('error');">
              </div>
              <div class="form-group">
                <label>CPF</label>
                <input type="text" name="cpf" id="cpf" onfocus="$(this).removeClass('error');">
              </div>
              <div class="form-group">
                <label>Data de nascimento</label>
                <input type="text" name="datanasc" id="datanasc" onfocus="$(this).removeClass('error');">
              </div>
              <div class="form-group">
                <label>Endereço</label>
                <textarea name="address" id="address" rows="5" onfocus="$(this).removeClass('error');"></textarea>
              </div>
              <div class="form-assinatura">
                <label>Assinatura</label>
                <div class="ipt">
                  <div class="sigPad" id="smoothed">
                    <div class="sig sigWrapper">
                      <div class="typed"></div>
                      <canvas class="pad" id="canvas" width="616" height="200"></canvas>
                      <input type="hidden" name="output" class="output">
                    </div>
                    <ul class="sigNav">
                      <li class="clearButton"><span>Limpar</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="poc-honda-steps-button">
                <a href="javascript:changeStep('2');" class="bt back">Voltar</a>
                <a href="javascript:changeStep('4');" class="bt">Cadastrar</a>
              </div>
            </div>
          </div>

          <div class="poc-honda-steps-content" data-step-content="4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p class="desktop">
              <b>Abaixo está disponível o seu contrato, você pode imprimir ou fazer o download.</b>
            </p>
            <p class="mobile">
              <b>Seu contrato está disponível para download, se o download não iniciar <a id="lnk-pdf-mobile">clique aqui</a>.</b>
            </p>
            <div id="poc-honda-dados-pdf">
              <div style='text-align: center' class="title"><b>CONTRATO DE SEGURO</b></div>
              <div id="poc-honda-dados-pdf-xml"></div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo:
              </p>
              <div class="list-contrato">
                <p>
                  <b>1. laboris nisi</b><br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  <b>2. laboris nisi</b><br>
                  Lorem ipsum dolor sit <b>amet, consectetur</b> adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  <b>3. laboris nisi</b><br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  <b>4. laboris nisi</b><br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.
                </p>
                <h1 style='page-break-before: always; margin-top:100px;color: #ffffff;'>.</h1> <!-- quebra de página -->
                <p>
                  <b>5. laboris nisi</b><br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
                <p>
                  <b>6. laboris nisi</b><br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  <b>7. laboris nisi</b><br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod,
                  consequat. Duis aute irure dolor in <b>reprehenderit</b> in voluptate velit esse
                </p>
                <p>
                  <b>8. laboris nisi</b><br>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut <b>labore</b> et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                </p>
              </div>
              <div class="assinatura-contrato"></div>
            </div>
            <div id="poc-honda-steps-success"></div>
          </div>
            
        </div>
      </form>
    </section>

   <!--  <footer>
      <div class="container">
        <div class="row">
          <div class="col-md-5">
            <div class="info">
              <img src="https://www.honda.com.br/sites/cbw/themes/custom/honda/dist/img/ibama_logo.svg" alt="Ibama">
              <span>No trânsito, dê sentido à vida.</span>
            </div>
          </div>
          <div class="col-md-7">
            <div class="legal">
              <span>2019 © Honda - Todos os direitos Reservados</span> | <a href="/politica-de-privacidade">Política de Privacidade</a> |
              <a href="/termos-de-uso">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer> -->

    <!-- JS -->
    <script src="dist/js/jquery.min.js"></script>
    <script src="dist/js/numeric-1.2.6.min.js"></script> 
    <script src="dist/js/bezier.js"></script> 
    <script src="dist/js/jquery.signaturepad.js"></script> 
    <script>
      $(document).ready(function() {
        $('#smoothed').signaturePad({
          drawOnly:true,
          drawBezierCurves:true,
          lineWidth : 0,
          lineMargin : 0
        });
      });
    </script> 
    <script src="dist/js/json2.min.js"></script>

    <script src='dist/js/jspdf.min.js'></script>

    <script src="dist/js/poc-honda.js"></script>

  </body>
</html>