$(document).ready(function (){

	$('input[type="file"]').change(function(e){

	  $('.select-file-name').text('Nenhum arquivo selecionado...');
	  $('.select-file-img-preview').html('');

		$('.select-file').removeClass('error');
		$('.select-file-name').removeClass('success error');

    var fp = $(this);
    var lg = fp[0].files.length; // get length
    var items = fp[0].files;
    var fragment = "";
    
    if (lg > 0) {
      for (var i = 0; i < lg; i++) {
        var fileName = items[i].name; // get file name
        var fileSize = items[i].size; // get file size 
        var fileType = items[i].type; // get file type
      }

      if(fileType == 'image/png' || fileType == 'image/jpeg') {
	      // if(fileSize < 16319844) {

	      	$('.select-file-img-preview').html('<img src="dist/images/loading.gif" width="100px" alt="" style="margin: 50px 0;">');

	      	var fd = new FormData();
	        var files = $('#fileCNH')[0].files[0];
	        fd.append('file',files);

	        $.ajax({
	            url: 'upload.php',
	            type: 'post',
	            data: fd,
	            contentType: false,
	            processData: false,
	            success: function(response){
	                if(response != 0){
                    $('.select-file-img-preview').html('<img src="'+ response +'" alt="">');
	                }else{
	                  alert('Arquivo não enviado...');
	                }
	            },
	        });

	      	$('.select-file-name').text('Arquivo selecionado').addClass('success');
	      // } else {
	      // 	$('#fileCNH').val('');
	      // 	$('.select-file-name').text('Arquivo excede o limite de tamanho. Tamanho máximo 5MB').addClass('error');
	      // }
      } else {
      	$('#fileCNH').val('');
      	$('.select-file-name').text('Por favor escolha arquivos com extensão .jpg e .png').addClass('error');
      }
    }
  });
  
	$('body').on('click', function() {
	  $('.sigWrapper.current').removeClass('error');
	});	

});

var xmlName = '';

window.onload = function loadSteps(){
	var baseUrl = window.location.hash;
	if (baseUrl == ''){
		changeStep('1');
	} else {
		var idXml = (baseUrl.substring(baseUrl.lastIndexOf('#') + 1));	
		if (idXml != ''){
			xmlName = idXml + '.xml';
			changeStep('3');
		}
	}
}

var canvasAssinatura = document.getElementById('canvas');
var dataAssinaturaURL = '';

function changeStep(step) {
	var status = false;
	if(step == '1') {
		status = true;
	}
	if(step == '2') {
		if($('#fileCNH').val() != '') {
			status = true;
		} else {
			$('.select-file').addClass('error');
		}
	}
	if(step == '3') {
		loadXMLDoc("dist/xml/" + xmlName);
		status = true;
	}
	if(step == '4') {
		var campovazio = false;
		if($('#name').val() == '') {
			campovazio = true;
			$('#name').addClass('error');
		}
		if($('#rg').val() == '') {
			campovazio = true;
			$('#rg').addClass('error');
		}
		if($('#cpf').val() == '') {
			campovazio = true;
			$('#cpf').addClass('error');
		}
		if($('#datanasc').val() == '') {
			campovazio = true;
			$('#datanasc').addClass('error');
		}
		if($('#address').val() == '') {
			campovazio = true;
			$('#address').addClass('error');
		}
		if($('.output').val() == '') {
			campovazio = true;
			$('.sigWrapper.current').addClass('error');
		}
		if(campovazio) {
			$('html, body').animate({scrollTop: 0}, 800);
		} else {
			$('html, body').animate({scrollTop: 0}, 800);
			dataAssinaturaURL = canvas.toDataURL('image/jpeg', 1.0);
			status = true;
			generate();
		}
	}
	if(status) {
		$('.poc-honda-steps ul li, .poc-honda-steps-content').removeClass('active');
		$('.poc-honda-steps ul li[data-step="'+step+'"]').addClass('active');
		$('.poc-honda-steps-content[data-step-content="'+step+'"]').addClass('active');
	}
}

// lendo xml

function loadXMLDoc(urlXml) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
    }
  };
  xmlhttp.open("GET", urlXml, true);
  xmlhttp.send();
}

var atribNome = "";

function myFunction(xml) {
  var x, i, xmlDoc, txt;
  xmlDoc = xml.responseXML;
  txt = "<p>";
  atrib = "";
  x = xmlDoc.getElementsByTagName("Attribute");
  for (i = 0; i< x.length; i++) {

  	var valueXML = '';

  	if(x[i].childNodes[0] != undefined) {
  		valueXML = x[i].childNodes[0].nodeValue;
  	}

  	// CPF
  	if(i==0){
  		$('#cpf').val(valueXML);
  		atrib = "CPF:";
  	}
  	// Nome
  	if(i==1){
  		$('#name').val(valueXML);
  		atrib = "Nome:";
  		atribNome = valueXML;
  	}
  	// Data nascimento
  	if(i==2){
  		$('#datanasc').val(valueXML);
  		atrib = "Data nascimento:";
  	}
  	// RG
  	if(i==3){
  		$('#rg').val(valueXML);
  		atrib = "RG:";
  	}
		// Documento Identificação
		if(i==4){
  		atrib = "Documento Identificação:";
		}
		// Validade
		if(i==5){
  		atrib = "Validade:";
		}

    txt += "<b>" + atrib + "</b> " + valueXML + "<br>";
  }
   txt += "</p>";
  document.getElementById("poc-honda-dados-pdf-xml").innerHTML = txt;

  setTimeout(function(){
	  $('.loading').html('').hide();
	  $('.form-display').fadeIn('slow');
	}, 500);
  
}

// PDF

var base64Img, base64ImgAssinatura = null;
imgToBase64('dist/images/logo-honda.jpg', function(base64) {
  base64Img = base64; 
});

margins = {
  top: 70,
  bottom: 40,
  left: 30,
  width: 550
};

generate = function() {
	var pdf = new jsPDF('p', 'pt', 'a4');
	pdf.setFontSize(18);
	pdf.fromHTML(document.getElementById('poc-honda-dados-pdf'), 
		margins.left, // x coord
		margins.top,
		{
			// y coord
			width: margins.width// max width of content on PDF
		},function(dispose) {
			headerFooterFormatting(pdf, pdf.internal.getNumberOfPages());
		}, 
		margins);

	var linkPDF = pdf.output('datauristring');
	    linkPDF = linkPDF.split(',');

	if($(window).width() >= 992){
		var iframe = document.createElement('iframe');
		iframe.setAttribute('frameborder','0');
		document.getElementById('poc-honda-steps-success').appendChild(iframe);
		iframe.src = pdf.output('datauristring');
	} else {
		downloadPDF(linkPDF[1]);
		$("#lnk-pdf-mobile").attr("onclick", "downloadPDF('"+linkPDF[1]+"');");
	}

	var namePDF = 'HONDA - CONTRATO DE SEGURO - ' + atribNome + '.pdf';
	var lnkPDFExport = linkPDF[1];

	var pdfpart0 = lnkPDFExport.substring(0,500);
	var pdfpart1 = lnkPDFExport.substring(500,1000);
	var pdfpart2 = lnkPDFExport.substring(1000,1500);
	var pdfpart3 = lnkPDFExport.substring(1500,2000);
	var pdfpart4 = lnkPDFExport.substring(2000,2500);
	var pdfpart5 = lnkPDFExport.substring(2500,3000);
	var pdfpart6 = lnkPDFExport.substring(3000,3500);
	var pdfpart7 = lnkPDFExport.substring(3500,4000);
	var pdfpart8 = lnkPDFExport.substring(4000,4500);
	var pdfpart9 = lnkPDFExport.substring(4500,5000);
	var pdfpart10 = lnkPDFExport.substring(5000,5500);
	var pdfpart11 = lnkPDFExport.substring(5500,6000);
	var pdfpart12 = lnkPDFExport.substring(6000,6500);
	var pdfpart13 = lnkPDFExport.substring(6500,7000);
	var pdfpart14 = lnkPDFExport.substring(7000,7500);
	var pdfpart15 = lnkPDFExport.substring(7500,8000);
	var pdfpart16 = lnkPDFExport.substring(8000,8500);
	var pdfpart17 = lnkPDFExport.substring(8500,9000);
	var pdfpart18 = lnkPDFExport.substring(9000,9500);
	var pdfpart19 = lnkPDFExport.substring(9500,10000);
	var pdfpart20 = lnkPDFExport.substring(10000,10500);
	var pdfpart21 = lnkPDFExport.substring(10500,11000);
	var pdfpart22 = lnkPDFExport.substring(11000,11500);
	var pdfpart23 = lnkPDFExport.substring(11500,12000);
	var pdfpart24 = lnkPDFExport.substring(12000,12500);
	var pdfpart25 = lnkPDFExport.substring(12500,13000);
	var pdfpart26 = lnkPDFExport.substring(13000,13500);
	var pdfpart27 = lnkPDFExport.substring(13500,14000);
	var pdfpart28 = lnkPDFExport.substring(14000,14500);
	var pdfpart29 = lnkPDFExport.substring(14500,15000);
	var pdfpart30 = lnkPDFExport.substring(15000,15500);
	var pdfpart31 = lnkPDFExport.substring(15500,16000);
	var pdfpart32 = lnkPDFExport.substring(16000,16500);
	var pdfpart33 = lnkPDFExport.substring(16500,17000);
	var pdfpart34 = lnkPDFExport.substring(17000,17500);
	var pdfpart35 = lnkPDFExport.substring(17500,18000);
	var pdfpart36 = lnkPDFExport.substring(18000,18500);
	var pdfpart37 = lnkPDFExport.substring(18500,19000);
	var pdfpart38 = lnkPDFExport.substring(19000,19500);
	var pdfpart39 = lnkPDFExport.substring(19500,20000);
	var pdfpart40 = lnkPDFExport.substring(20000,20500);
	var pdfpart41 = lnkPDFExport.substring(20500,21000);
	var pdfpart42 = lnkPDFExport.substring(21000,21500);
	var pdfpart43 = lnkPDFExport.substring(21500,22000);
	var pdfpart44 = lnkPDFExport.substring(22000,22500);
	var pdfpart45 = lnkPDFExport.substring(22500,23000);
	var pdfpart46 = lnkPDFExport.substring(23000,23500);
	var pdfpart47 = lnkPDFExport.substring(23500,24000);
	var pdfpart48 = lnkPDFExport.substring(24000,24500);
	var pdfpart49 = lnkPDFExport.substring(24500,25000);
	var pdfpart50 = lnkPDFExport.substring(25000,25500);
	var pdfpart51 = lnkPDFExport.substring(25500,26000);
	var pdfpart52 = lnkPDFExport.substring(26000,26500);
	var pdfpart53 = lnkPDFExport.substring(26500,27000);
	var pdfpart54 = lnkPDFExport.substring(27000,27500);
	var pdfpart55 = lnkPDFExport.substring(27500,28000);
	var pdfpart56 = lnkPDFExport.substring(28000,28500);
	var pdfpart57 = lnkPDFExport.substring(28500,29000);
	var pdfpart58 = lnkPDFExport.substring(29000,29500);
	var pdfpart59 = lnkPDFExport.substring(29500,30000);
	var pdfpart60 = lnkPDFExport.substring(30000,30500);
	var pdfpart61 = lnkPDFExport.substring(30500,31000);
	var pdfpart62 = lnkPDFExport.substring(31000,31500);
	var pdfpart63 = lnkPDFExport.substring(31500,32000);
	var pdfpart64 = lnkPDFExport.substring(32000,32500);
	var pdfpart65 = lnkPDFExport.substring(32500,33000);
	var pdfpart66 = lnkPDFExport.substring(33000,33500);
	var pdfpart67 = lnkPDFExport.substring(33500,34000);
	var pdfpart68 = lnkPDFExport.substring(34000,34500);
	var pdfpart69 = lnkPDFExport.substring(34500,35000);
	var pdfpart70 = lnkPDFExport.substring(35000,35500);
	var pdfpart71 = lnkPDFExport.substring(35500,36000);
	var pdfpart72 = lnkPDFExport.substring(36000,36500);
	var pdfpart73 = lnkPDFExport.substring(36500,37000);
	var pdfpart74 = lnkPDFExport.substring(37000,37500);
	var pdfpart75 = lnkPDFExport.substring(37500,38000);
	var pdfpart76 = lnkPDFExport.substring(38000,38500);
	var pdfpart77 = lnkPDFExport.substring(38500,39000);
	var pdfpart78 = lnkPDFExport.substring(39000,39500);
	var pdfpart79 = lnkPDFExport.substring(39500,40000);
	var pdfpart80 = lnkPDFExport.substring(40000,40500);
	var pdfpart81 = lnkPDFExport.substring(40500,41000);
	var pdfpart82 = lnkPDFExport.substring(41000,41500);
	var pdfpart83 = lnkPDFExport.substring(41500,42000);
	var pdfpart84 = lnkPDFExport.substring(42000,42500);
	var pdfpart85 = lnkPDFExport.substring(42500,43000);
	var pdfpart86 = lnkPDFExport.substring(43000,43500);
	var pdfpart87 = lnkPDFExport.substring(43500,44000);
	var pdfpart88 = lnkPDFExport.substring(44000,44500);
	var pdfpart89 = lnkPDFExport.substring(44500,45000);
	var pdfpart90 = lnkPDFExport.substring(45000,45500);
	var pdfpart91 = lnkPDFExport.substring(45500,46000);
	var pdfpart92 = lnkPDFExport.substring(46000,46500);
	var pdfpart93 = lnkPDFExport.substring(46500,47000);
	var pdfpart94 = lnkPDFExport.substring(47000,47500);
	var pdfpart95 = lnkPDFExport.substring(47500,48000);
	var pdfpart96 = lnkPDFExport.substring(48000,48500);
	var pdfpart97 = lnkPDFExport.substring(48500,49000);
	var pdfpart98 = lnkPDFExport.substring(49000,49500);
	var pdfpart99 = lnkPDFExport.substring(49500,50000);
	var pdfpart100 = lnkPDFExport.substring(50000,50500);
	var pdfpart101 = lnkPDFExport.substring(50500,51000);
	var pdfpart102 = lnkPDFExport.substring(51000,51500);
	var pdfpart103 = lnkPDFExport.substring(51500,52000);
	var pdfpart104 = lnkPDFExport.substring(52000,52500);
	var pdfpart105 = lnkPDFExport.substring(52500,53000);
	var pdfpart106 = lnkPDFExport.substring(53000,53500);
	var pdfpart107 = lnkPDFExport.substring(53500,54000);
	var pdfpart108 = lnkPDFExport.substring(54000,54500);
	var pdfpart109 = lnkPDFExport.substring(54500,55000);
	var pdfpart110 = lnkPDFExport.substring(55000,55500);
	var pdfpart111 = lnkPDFExport.substring(55500,56000);
	var pdfpart112 = lnkPDFExport.substring(56000,56500);
	var pdfpart113 = lnkPDFExport.substring(56500,57000);
	var pdfpart114 = lnkPDFExport.substring(57000,57500);
	var pdfpart115 = lnkPDFExport.substring(57500,58000);
	var pdfpart116 = lnkPDFExport.substring(58000,58500);
	var pdfpart117 = lnkPDFExport.substring(58500,59000);
	var pdfpart118 = lnkPDFExport.substring(59000,59500);
	var pdfpart119 = lnkPDFExport.substring(59500,60000);
	var pdfpart120 = lnkPDFExport.substring(60000,60500);
	var pdfpart121 = lnkPDFExport.substring(60500,61000);
	var pdfpart122 = lnkPDFExport.substring(61000,61500);
	var pdfpart123 = lnkPDFExport.substring(61500,62000);
	var pdfpart124 = lnkPDFExport.substring(62000,62500);
	var pdfpart125 = lnkPDFExport.substring(62500,63000);
	var pdfpart126 = lnkPDFExport.substring(63000,63500);
	var pdfpart127 = lnkPDFExport.substring(63500,64000);
	var pdfpart128 = lnkPDFExport.substring(64000,64500);
	var pdfpart129 = lnkPDFExport.substring(64500,65000);
	var pdfpart130 = lnkPDFExport.substring(65000,65500);
	var pdfpart131 = lnkPDFExport.substring(65500,66000);
	var pdfpart132 = lnkPDFExport.substring(66000,66500);
	var pdfpart133 = lnkPDFExport.substring(66500,67000);
	var pdfpart134 = lnkPDFExport.substring(67000,67500);
	var pdfpart135 = lnkPDFExport.substring(67500,68000);
	var pdfpart136 = lnkPDFExport.substring(68000,68500);
	var pdfpart137 = lnkPDFExport.substring(68500,69000);
	var pdfpart138 = lnkPDFExport.substring(69000,69500);
	var pdfpart139 = lnkPDFExport.substring(69500,70000);
	var pdfpart140 = lnkPDFExport.substring(70000,70500);
	var pdfpart141 = lnkPDFExport.substring(70500,71000);
	var pdfpart142 = lnkPDFExport.substring(71000,71500);
	var pdfpart143 = lnkPDFExport.substring(71500,72000);
	var pdfpart144 = lnkPDFExport.substring(72000,72500);
	var pdfpart145 = lnkPDFExport.substring(72500,73000);
	var pdfpart146 = lnkPDFExport.substring(73000,73500);
	var pdfpart147 = lnkPDFExport.substring(73500,74000);
	var pdfpart148 = lnkPDFExport.substring(74000,74500);
	var pdfpart149 = lnkPDFExport.substring(74500,75000);
	var pdfpart150 = lnkPDFExport.substring(75000,75500);
	var pdfpart151 = lnkPDFExport.substring(75500,76000);
	var pdfpart152 = lnkPDFExport.substring(76000,76500);
	var pdfpart153 = lnkPDFExport.substring(76500,77000);
	var pdfpart154 = lnkPDFExport.substring(77000,77500);
	var pdfpart155 = lnkPDFExport.substring(77500,78000);
	var pdfpart156 = lnkPDFExport.substring(78000,78500);
	var pdfpart157 = lnkPDFExport.substring(78500,79000);
	var pdfpart158 = lnkPDFExport.substring(79000,79500);
	var pdfpart159 = lnkPDFExport.substring(79500,80000);
	var pdfpart160 = lnkPDFExport.substring(80000,80500);
	var pdfpart161 = lnkPDFExport.substring(80500,81000);
	var pdfpart162 = lnkPDFExport.substring(81000,81500);
	var pdfpart163 = lnkPDFExport.substring(81500,82000);
	var pdfpart164 = lnkPDFExport.substring(82000,82500);
	var pdfpart165 = lnkPDFExport.substring(82500,83000);
	var pdfpart166 = lnkPDFExport.substring(83000,83500);
	var pdfpart167 = lnkPDFExport.substring(83500,84000);
	var pdfpart168 = lnkPDFExport.substring(84000,84500);
	var pdfpart169 = lnkPDFExport.substring(84500,85000);
	var pdfpart170 = lnkPDFExport.substring(85000,85500);
	var pdfpart171 = lnkPDFExport.substring(85500,86000);
	var pdfpart172 = lnkPDFExport.substring(86000,86500);
	var pdfpart173 = lnkPDFExport.substring(86500,87000);
	var pdfpart174 = lnkPDFExport.substring(87000,87500);
	var pdfpart175 = lnkPDFExport.substring(87500,88000);
	var pdfpart176 = lnkPDFExport.substring(88000,88500);
	var pdfpart177 = lnkPDFExport.substring(88500,89000);
	var pdfpart178 = lnkPDFExport.substring(89000,89500);
	var pdfpart179 = lnkPDFExport.substring(89500,90000);
	var pdfpart180 = lnkPDFExport.substring(90000,90500);
	var pdfpart181 = lnkPDFExport.substring(90500,91000);
	var pdfpart182 = lnkPDFExport.substring(91000,91500);
	var pdfpart183 = lnkPDFExport.substring(91500,92000);
	var pdfpart184 = lnkPDFExport.substring(92000,92500);
	var pdfpart185 = lnkPDFExport.substring(92500,93000);
	var pdfpart186 = lnkPDFExport.substring(93000,93500);
	var pdfpart187 = lnkPDFExport.substring(93500,94000);
	var pdfpart188 = lnkPDFExport.substring(94000,94500);
	var pdfpart189 = lnkPDFExport.substring(94500,95000);
	var pdfpart190 = lnkPDFExport.substring(95000,95500);
	var pdfpart191 = lnkPDFExport.substring(95500,96000);
	var pdfpart192 = lnkPDFExport.substring(96000,96500);
	var pdfpart193 = lnkPDFExport.substring(96500,97000);
	var pdfpart194 = lnkPDFExport.substring(97000,97500);
	var pdfpart195 = lnkPDFExport.substring(97500,98000);
	var pdfpart196 = lnkPDFExport.substring(98000,98500);
	var pdfpart197 = lnkPDFExport.substring(98500,99000);
	var pdfpart198 = lnkPDFExport.substring(99000,99500);
	var pdfpart199 = lnkPDFExport.substring(99500,100000);
	var pdfpart200 = lnkPDFExport.substring(100000,100500);
	var pdfpart201 = lnkPDFExport.substring(100500,101000);
	var pdfpart202 = lnkPDFExport.substring(101000,101500);
	var pdfpart203 = lnkPDFExport.substring(101500,102000);
	var pdfpart204 = lnkPDFExport.substring(102000,102500);
	var pdfpart205 = lnkPDFExport.substring(102500,103000);
	var pdfpart206 = lnkPDFExport.substring(103000,103500);
	var pdfpart207 = lnkPDFExport.substring(103500,104000);
	var pdfpart208 = lnkPDFExport.substring(104000,104500);
	var pdfpart209 = lnkPDFExport.substring(104500,105000);
	var pdfpart210 = lnkPDFExport.substring(105000,105500);
	var pdfpart211 = lnkPDFExport.substring(105500,106000);
	var pdfpart212 = lnkPDFExport.substring(106000,106500);
	var pdfpart213 = lnkPDFExport.substring(106500,107000);
	var pdfpart214 = lnkPDFExport.substring(107000,107500);
	var pdfpart215 = lnkPDFExport.substring(107500,108000);
	var pdfpart216 = lnkPDFExport.substring(108000,108500);
	var pdfpart217 = lnkPDFExport.substring(108500,109000);
	var pdfpart218 = lnkPDFExport.substring(109000,109500);
	var pdfpart219 = lnkPDFExport.substring(109500,110000);
	var pdfpart220 = lnkPDFExport.substring(110000,110500);
	var pdfpart221 = lnkPDFExport.substring(110500,111000);
	var pdfpart222 = lnkPDFExport.substring(111000,111500);
	var pdfpart223 = lnkPDFExport.substring(111500,112000);
	var pdfpart224 = lnkPDFExport.substring(112000,112500);
	var pdfpart225 = lnkPDFExport.substring(112500,113000);
	var pdfpart226 = lnkPDFExport.substring(113000,113500);
	var pdfpart227 = lnkPDFExport.substring(113500,114000);
	var pdfpart228 = lnkPDFExport.substring(114000,114500);
	var pdfpart229 = lnkPDFExport.substring(114500,115000);
	var pdfpart230 = lnkPDFExport.substring(115000,115500);
	var pdfpart231 = lnkPDFExport.substring(115500,116000);
	var pdfpart232 = lnkPDFExport.substring(116000,116500);
	var pdfpart233 = lnkPDFExport.substring(116500,117000);
	var pdfpart234 = lnkPDFExport.substring(117000,117500);
	var pdfpart235 = lnkPDFExport.substring(117500,118000);
	var pdfpart236 = lnkPDFExport.substring(118000,118500);
	var pdfpart237 = lnkPDFExport.substring(118500,119000);
	var pdfpart238 = lnkPDFExport.substring(119000,119500);
	var pdfpart239 = lnkPDFExport.substring(119500,120000);
	var pdfpart240 = lnkPDFExport.substring(120000,120500);
	var pdfpart241 = lnkPDFExport.substring(120500,121000);
	var pdfpart242 = lnkPDFExport.substring(121000,121500);
	var pdfpart243 = lnkPDFExport.substring(121500,122000);
	var pdfpart244 = lnkPDFExport.substring(122000,122500);
	var pdfpart245 = lnkPDFExport.substring(122500,123000);
	var pdfpart246 = lnkPDFExport.substring(123000,123500);
	var pdfpart247 = lnkPDFExport.substring(123500,124000);
	var pdfpart248 = lnkPDFExport.substring(124000,124500);
	var pdfpart249 = lnkPDFExport.substring(124500,125000);
	var pdfpart250 = lnkPDFExport.substring(125000,125500);
	var pdfpart251 = lnkPDFExport.substring(125500,126000);
	var pdfpart252 = lnkPDFExport.substring(126000,126500);
	var pdfpart253 = lnkPDFExport.substring(126500,127000);
	var pdfpart254 = lnkPDFExport.substring(127000,127500);
	var pdfpart255 = lnkPDFExport.substring(127500,128000);
	var pdfpart256 = lnkPDFExport.substring(128000,128500);
	var pdfpart257 = lnkPDFExport.substring(128500,129000);
	var pdfpart258 = lnkPDFExport.substring(129000,129500);
	var pdfpart259 = lnkPDFExport.substring(129500,130000);
	var pdfpart260 = lnkPDFExport.substring(130000,130500);
	var pdfpart261 = lnkPDFExport.substring(130500,131000);
	var pdfpart262 = lnkPDFExport.substring(131000,131500);
	var pdfpart263 = lnkPDFExport.substring(131500,132000);
	var pdfpart264 = lnkPDFExport.substring(132000,132500);
	var pdfpart265 = lnkPDFExport.substring(132500,133000);
	var pdfpart266 = lnkPDFExport.substring(133000,133500);
	var pdfpart267 = lnkPDFExport.substring(133500,134000);
	var pdfpart268 = lnkPDFExport.substring(134000,134500);
	var pdfpart269 = lnkPDFExport.substring(134500,135000);
	var pdfpart270 = lnkPDFExport.substring(135000,135500);
	var pdfpart271 = lnkPDFExport.substring(135500,136000);
	var pdfpart272 = lnkPDFExport.substring(136000,136500);
	var pdfpart273 = lnkPDFExport.substring(136500,137000);
	var pdfpart274 = lnkPDFExport.substring(137000,137500);
	var pdfpart275 = lnkPDFExport.substring(137500,138000);
	var pdfpart276 = lnkPDFExport.substring(138000,138500);
	var pdfpart277 = lnkPDFExport.substring(138500,139000);
	var pdfpart278 = lnkPDFExport.substring(139000,139500);
	var pdfpart279 = lnkPDFExport.substring(139500,140000);
	var pdfpart280 = lnkPDFExport.substring(140000,140500);
	var pdfpart281 = lnkPDFExport.substring(140500,141000);
	var pdfpart282 = lnkPDFExport.substring(141000,141500);
	var pdfpart283 = lnkPDFExport.substring(141500,142000);
	var pdfpart284 = lnkPDFExport.substring(142000,142500);
	var pdfpart285 = lnkPDFExport.substring(142500,143000);
	var pdfpart286 = lnkPDFExport.substring(143000,143500);
	var pdfpart287 = lnkPDFExport.substring(143500,144000);
	var pdfpart288 = lnkPDFExport.substring(144000,144500);
	var pdfpart289 = lnkPDFExport.substring(144500,145000);
	var pdfpart290 = lnkPDFExport.substring(145000,145500);
	var pdfpart291 = lnkPDFExport.substring(145500,146000);
	var pdfpart292 = lnkPDFExport.substring(146000,146500);
	var pdfpart293 = lnkPDFExport.substring(146500,147000);
	var pdfpart294 = lnkPDFExport.substring(147000,147500);
	var pdfpart295 = lnkPDFExport.substring(147500,148000);
	var pdfpart296 = lnkPDFExport.substring(148000,148500);
	var pdfpart297 = lnkPDFExport.substring(148500,149000);
	var pdfpart298 = lnkPDFExport.substring(149000,149500);
	var pdfpart299 = lnkPDFExport.substring(149500,150000);
	var pdfpart300 = lnkPDFExport.substring(150000,150500);
	var pdfpart301 = lnkPDFExport.substring(150500,151000);
	var pdfpart302 = lnkPDFExport.substring(151000,151500);
	var pdfpart303 = lnkPDFExport.substring(151500,152000);
	var pdfpart304 = lnkPDFExport.substring(152000,152500);
	var pdfpart305 = lnkPDFExport.substring(152500,153000);
	var pdfpart306 = lnkPDFExport.substring(153000,153500);
	var pdfpart307 = lnkPDFExport.substring(153500,154000);
	var pdfpart308 = lnkPDFExport.substring(154000,154500);
	var pdfpart309 = lnkPDFExport.substring(154500,155000);
	var pdfpart310 = lnkPDFExport.substring(155000,155500);
	var pdfpart311 = lnkPDFExport.substring(155500,156000);
	var pdfpart312 = lnkPDFExport.substring(156000,156500);
	var pdfpart313 = lnkPDFExport.substring(156500,157000);
	var pdfpart314 = lnkPDFExport.substring(157000,157500);
	var pdfpart315 = lnkPDFExport.substring(157500,158000);
	var pdfpart316 = lnkPDFExport.substring(158000,158500);
	var pdfpart317 = lnkPDFExport.substring(158500,159000);
	var pdfpart318 = lnkPDFExport.substring(159000,159500);
	var pdfpart319 = lnkPDFExport.substring(159500,160000);
	var pdfpart320 = lnkPDFExport.substring(160000,160500);
	var pdfpart321 = lnkPDFExport.substring(160500,161000);
	var pdfpart322 = lnkPDFExport.substring(161000,161500);
	var pdfpart323 = lnkPDFExport.substring(161500,162000);
	var pdfpart324 = lnkPDFExport.substring(162000,162500);
	var pdfpart325 = lnkPDFExport.substring(162500,163000);
	var pdfpart326 = lnkPDFExport.substring(163000,163500);
	var pdfpart327 = lnkPDFExport.substring(163500,164000);
	var pdfpart328 = lnkPDFExport.substring(164000,164500);
	var pdfpart329 = lnkPDFExport.substring(164500,165000);
	var pdfpart330 = lnkPDFExport.substring(165000,165500);
	var pdfpart331 = lnkPDFExport.substring(165500,166000);
	var pdfpart332 = lnkPDFExport.substring(166000,166500);
	var pdfpart333 = lnkPDFExport.substring(166500,167000);
	var pdfpart334 = lnkPDFExport.substring(167000,167500);
	var pdfpart335 = lnkPDFExport.substring(167500,168000);
	var pdfpart336 = lnkPDFExport.substring(168000,168500);
	var pdfpart337 = lnkPDFExport.substring(168500,169000);
	var pdfpart338 = lnkPDFExport.substring(169000,169500);
	var pdfpart339 = lnkPDFExport.substring(169500,170000);
	var pdfpart340 = lnkPDFExport.substring(170000,170500);
	var pdfpart341 = lnkPDFExport.substring(170500,171000);
	var pdfpart342 = lnkPDFExport.substring(171000,171500);
	var pdfpart343 = lnkPDFExport.substring(171500,172000);
	var pdfpart344 = lnkPDFExport.substring(172000,172500);
	var pdfpart345 = lnkPDFExport.substring(172500,173000);
	var pdfpart346 = lnkPDFExport.substring(173000,173500);
	var pdfpart347 = lnkPDFExport.substring(173500,174000);
	var pdfpart348 = lnkPDFExport.substring(174000,174500);
	var pdfpart349 = lnkPDFExport.substring(174500,175000);
	var pdfpart350 = lnkPDFExport.substring(175000,175500);
	var pdfpart351 = lnkPDFExport.substring(175500,176000);
	var pdfpart352 = lnkPDFExport.substring(176000,176500);
	var pdfpart353 = lnkPDFExport.substring(176500,177000);
	var pdfpart354 = lnkPDFExport.substring(177000,177500);
	var pdfpart355 = lnkPDFExport.substring(177500,178000);
	var pdfpart356 = lnkPDFExport.substring(178000,178500);
	var pdfpart357 = lnkPDFExport.substring(178500,179000);
	var pdfpart358 = lnkPDFExport.substring(179000,179500);
	var pdfpart359 = lnkPDFExport.substring(179500,180000);
	var pdfpart360 = lnkPDFExport.substring(180000,180500);
	var pdfpart361 = lnkPDFExport.substring(180500,181000);
	var pdfpart362 = lnkPDFExport.substring(181000,181500);
	var pdfpart363 = lnkPDFExport.substring(181500,182000);
	var pdfpart364 = lnkPDFExport.substring(182000,182500);
	var pdfpart365 = lnkPDFExport.substring(182500,183000);
	var pdfpart366 = lnkPDFExport.substring(183000,183500);
	var pdfpart367 = lnkPDFExport.substring(183500,184000);
	var pdfpart368 = lnkPDFExport.substring(184000,184500);
	var pdfpart369 = lnkPDFExport.substring(184500,185000);
	var pdfpart370 = lnkPDFExport.substring(185000,185500);
	var pdfpart371 = lnkPDFExport.substring(185500,186000);
	var pdfpart372 = lnkPDFExport.substring(186000,186500);
	var pdfpart373 = lnkPDFExport.substring(186500,187000);
	var pdfpart374 = lnkPDFExport.substring(187000,187500);
	var pdfpart375 = lnkPDFExport.substring(187500,188000);
	var pdfpart376 = lnkPDFExport.substring(188000,188500);
	var pdfpart377 = lnkPDFExport.substring(188500,189000);
	var pdfpart378 = lnkPDFExport.substring(189000,189500);
	var pdfpart379 = lnkPDFExport.substring(189500,190000);
	var pdfpart380 = lnkPDFExport.substring(190000,190500);
	var pdfpart381 = lnkPDFExport.substring(190500,191000);
	var pdfpart382 = lnkPDFExport.substring(191000,191500);
	var pdfpart383 = lnkPDFExport.substring(191500,192000);
	var pdfpart384 = lnkPDFExport.substring(192000,192500);
	var pdfpart385 = lnkPDFExport.substring(192500,193000);
	var pdfpart386 = lnkPDFExport.substring(193000,193500);
	var pdfpart387 = lnkPDFExport.substring(193500,194000);
	var pdfpart388 = lnkPDFExport.substring(194000,194500);
	var pdfpart389 = lnkPDFExport.substring(194500,195000);
	var pdfpart390 = lnkPDFExport.substring(195000,195500);
	var pdfpart391 = lnkPDFExport.substring(195500,196000);
	var pdfpart392 = lnkPDFExport.substring(196000,196500);
	var pdfpart393 = lnkPDFExport.substring(196500,197000);
	var pdfpart394 = lnkPDFExport.substring(197000,197500);
	var pdfpart395 = lnkPDFExport.substring(197500,198000);
	var pdfpart396 = lnkPDFExport.substring(198000,198500);
	var pdfpart397 = lnkPDFExport.substring(198500,199000);
	var pdfpart398 = lnkPDFExport.substring(199000,199500);
	var pdfpart399 = lnkPDFExport.substring(199500,200000);
	var pdfpart400 = lnkPDFExport.substring(200000,200500);

	$.ajax({
	  url:'dist/docs/txt.php',
	  data: { 
	  	'pdfpart0': pdfpart0, 
			'pdfpart1': pdfpart1, 
			'pdfpart2': pdfpart2, 
			'pdfpart3': pdfpart3, 
			'pdfpart4': pdfpart4, 
			'pdfpart5': pdfpart5, 
			'pdfpart6': pdfpart6, 
			'pdfpart7': pdfpart7, 
			'pdfpart8': pdfpart8, 
			'pdfpart9': pdfpart9, 
			'pdfpart10': pdfpart10, 
			'pdfpart11': pdfpart11, 
			'pdfpart12': pdfpart12, 
			'pdfpart13': pdfpart13, 
			'pdfpart14': pdfpart14, 
			'pdfpart15': pdfpart15, 
			'pdfpart16': pdfpart16, 
			'pdfpart17': pdfpart17, 
			'pdfpart18': pdfpart18, 
			'pdfpart19': pdfpart19, 
			'pdfpart20': pdfpart20, 
			'pdfpart21': pdfpart21, 
			'pdfpart22': pdfpart22, 
			'pdfpart23': pdfpart23, 
			'pdfpart24': pdfpart24, 
			'pdfpart25': pdfpart25, 
			'pdfpart26': pdfpart26, 
			'pdfpart27': pdfpart27, 
			'pdfpart28': pdfpart28, 
			'pdfpart29': pdfpart29, 
			'pdfpart30': pdfpart30, 
			'pdfpart31': pdfpart31, 
			'pdfpart32': pdfpart32, 
			'pdfpart33': pdfpart33, 
			'pdfpart34': pdfpart34, 
			'pdfpart35': pdfpart35, 
			'pdfpart36': pdfpart36, 
			'pdfpart37': pdfpart37, 
			'pdfpart38': pdfpart38, 
			'pdfpart39': pdfpart39, 
			'pdfpart40': pdfpart40, 
			'pdfpart41': pdfpart41, 
			'pdfpart42': pdfpart42, 
			'pdfpart43': pdfpart43, 
			'pdfpart44': pdfpart44, 
			'pdfpart45': pdfpart45, 
			'pdfpart46': pdfpart46, 
			'pdfpart47': pdfpart47, 
			'pdfpart48': pdfpart48, 
			'pdfpart49': pdfpart49, 
			'pdfpart50': pdfpart50, 
			'pdfpart51': pdfpart51, 
			'pdfpart52': pdfpart52, 
			'pdfpart53': pdfpart53, 
			'pdfpart54': pdfpart54, 
			'pdfpart55': pdfpart55, 
			'pdfpart56': pdfpart56, 
			'pdfpart57': pdfpart57, 
			'pdfpart58': pdfpart58, 
			'pdfpart59': pdfpart59, 
			'pdfpart60': pdfpart60, 
			'pdfpart61': pdfpart61, 
			'pdfpart62': pdfpart62, 
			'pdfpart63': pdfpart63, 
			'pdfpart64': pdfpart64, 
			'pdfpart65': pdfpart65, 
			'pdfpart66': pdfpart66, 
			'pdfpart67': pdfpart67, 
			'pdfpart68': pdfpart68, 
			'pdfpart69': pdfpart69, 
			'pdfpart70': pdfpart70, 
			'pdfpart71': pdfpart71, 
			'pdfpart72': pdfpart72, 
			'pdfpart73': pdfpart73, 
			'pdfpart74': pdfpart74, 
			'pdfpart75': pdfpart75, 
			'pdfpart76': pdfpart76, 
			'pdfpart77': pdfpart77, 
			'pdfpart78': pdfpart78, 
			'pdfpart79': pdfpart79, 
			'pdfpart80': pdfpart80, 
			'pdfpart81': pdfpart81, 
			'pdfpart82': pdfpart82, 
			'pdfpart83': pdfpart83, 
			'pdfpart84': pdfpart84, 
			'pdfpart85': pdfpart85, 
			'pdfpart86': pdfpart86, 
			'pdfpart87': pdfpart87, 
			'pdfpart88': pdfpart88, 
			'pdfpart89': pdfpart89, 
			'pdfpart90': pdfpart90, 
			'pdfpart91': pdfpart91, 
			'pdfpart92': pdfpart92, 
			'pdfpart93': pdfpart93, 
			'pdfpart94': pdfpart94, 
			'pdfpart95': pdfpart95, 
			'pdfpart96': pdfpart96, 
			'pdfpart97': pdfpart97, 
			'pdfpart98': pdfpart98, 
			'pdfpart99': pdfpart99, 
			'pdfpart100': pdfpart100, 
			'pdfpart101': pdfpart101, 
			'pdfpart102': pdfpart102, 
			'pdfpart103': pdfpart103, 
			'pdfpart104': pdfpart104, 
			'pdfpart105': pdfpart105, 
			'pdfpart106': pdfpart106, 
			'pdfpart107': pdfpart107, 
			'pdfpart108': pdfpart108, 
			'pdfpart109': pdfpart109, 
			'pdfpart110': pdfpart110, 
			'pdfpart111': pdfpart111, 
			'pdfpart112': pdfpart112, 
			'pdfpart113': pdfpart113, 
			'pdfpart114': pdfpart114, 
			'pdfpart115': pdfpart115, 
			'pdfpart116': pdfpart116, 
			'pdfpart117': pdfpart117, 
			'pdfpart118': pdfpart118, 
			'pdfpart119': pdfpart119, 
			'pdfpart120': pdfpart120, 
			'pdfpart121': pdfpart121, 
			'pdfpart122': pdfpart122, 
			'pdfpart123': pdfpart123, 
			'pdfpart124': pdfpart124, 
			'pdfpart125': pdfpart125, 
			'pdfpart126': pdfpart126, 
			'pdfpart127': pdfpart127, 
			'pdfpart128': pdfpart128, 
			'pdfpart129': pdfpart129, 
			'pdfpart130': pdfpart130, 
			'pdfpart131': pdfpart131, 
			'pdfpart132': pdfpart132, 
			'pdfpart133': pdfpart133, 
			'pdfpart134': pdfpart134, 
			'pdfpart135': pdfpart135, 
			'pdfpart136': pdfpart136, 
			'pdfpart137': pdfpart137, 
			'pdfpart138': pdfpart138, 
			'pdfpart139': pdfpart139, 
			'pdfpart140': pdfpart140, 
			'pdfpart141': pdfpart141, 
			'pdfpart142': pdfpart142, 
			'pdfpart143': pdfpart143, 
			'pdfpart144': pdfpart144, 
			'pdfpart145': pdfpart145, 
			'pdfpart146': pdfpart146, 
			'pdfpart147': pdfpart147, 
			'pdfpart148': pdfpart148, 
			'pdfpart149': pdfpart149, 
			'pdfpart150': pdfpart150, 
			'pdfpart151': pdfpart151, 
			'pdfpart152': pdfpart152, 
			'pdfpart153': pdfpart153, 
			'pdfpart154': pdfpart154, 
			'pdfpart155': pdfpart155, 
			'pdfpart156': pdfpart156, 
			'pdfpart157': pdfpart157, 
			'pdfpart158': pdfpart158, 
			'pdfpart159': pdfpart159, 
			'pdfpart160': pdfpart160, 
			'pdfpart161': pdfpart161, 
			'pdfpart162': pdfpart162, 
			'pdfpart163': pdfpart163, 
			'pdfpart164': pdfpart164, 
			'pdfpart165': pdfpart165, 
			'pdfpart166': pdfpart166, 
			'pdfpart167': pdfpart167, 
			'pdfpart168': pdfpart168, 
			'pdfpart169': pdfpart169, 
			'pdfpart170': pdfpart170, 
			'pdfpart171': pdfpart171, 
			'pdfpart172': pdfpart172, 
			'pdfpart173': pdfpart173, 
			'pdfpart174': pdfpart174, 
			'pdfpart175': pdfpart175, 
			'pdfpart176': pdfpart176, 
			'pdfpart177': pdfpart177, 
			'pdfpart178': pdfpart178, 
			'pdfpart179': pdfpart179, 
			'pdfpart180': pdfpart180, 
			'pdfpart181': pdfpart181, 
			'pdfpart182': pdfpart182, 
			'pdfpart183': pdfpart183, 
			'pdfpart184': pdfpart184, 
			'pdfpart185': pdfpart185, 
			'pdfpart186': pdfpart186, 
			'pdfpart187': pdfpart187, 
			'pdfpart188': pdfpart188, 
			'pdfpart189': pdfpart189, 
			'pdfpart190': pdfpart190, 
			'pdfpart191': pdfpart191, 
			'pdfpart192': pdfpart192, 
			'pdfpart193': pdfpart193, 
			'pdfpart194': pdfpart194, 
			'pdfpart195': pdfpart195, 
			'pdfpart196': pdfpart196, 
			'pdfpart197': pdfpart197, 
			'pdfpart198': pdfpart198, 
			'pdfpart199': pdfpart199, 
			'pdfpart200': pdfpart200, 
			'pdfpart201': pdfpart201, 
			'pdfpart202': pdfpart202, 
			'pdfpart203': pdfpart203, 
			'pdfpart204': pdfpart204, 
			'pdfpart205': pdfpart205, 
			'pdfpart206': pdfpart206, 
			'pdfpart207': pdfpart207, 
			'pdfpart208': pdfpart208, 
			'pdfpart209': pdfpart209, 
			'pdfpart210': pdfpart210, 
			'pdfpart211': pdfpart211, 
			'pdfpart212': pdfpart212, 
			'pdfpart213': pdfpart213, 
			'pdfpart214': pdfpart214, 
			'pdfpart215': pdfpart215, 
			'pdfpart216': pdfpart216, 
			'pdfpart217': pdfpart217, 
			'pdfpart218': pdfpart218, 
			'pdfpart219': pdfpart219, 
			'pdfpart220': pdfpart220, 
			'pdfpart221': pdfpart221, 
			'pdfpart222': pdfpart222, 
			'pdfpart223': pdfpart223, 
			'pdfpart224': pdfpart224, 
			'pdfpart225': pdfpart225, 
			'pdfpart226': pdfpart226, 
			'pdfpart227': pdfpart227, 
			'pdfpart228': pdfpart228, 
			'pdfpart229': pdfpart229, 
			'pdfpart230': pdfpart230, 
			'pdfpart231': pdfpart231, 
			'pdfpart232': pdfpart232, 
			'pdfpart233': pdfpart233, 
			'pdfpart234': pdfpart234, 
			'pdfpart235': pdfpart235, 
			'pdfpart236': pdfpart236, 
			'pdfpart237': pdfpart237, 
			'pdfpart238': pdfpart238, 
			'pdfpart239': pdfpart239, 
			'pdfpart240': pdfpart240, 
			'pdfpart241': pdfpart241, 
			'pdfpart242': pdfpart242, 
			'pdfpart243': pdfpart243, 
			'pdfpart244': pdfpart244, 
			'pdfpart245': pdfpart245, 
			'pdfpart246': pdfpart246, 
			'pdfpart247': pdfpart247, 
			'pdfpart248': pdfpart248, 
			'pdfpart249': pdfpart249, 
			'pdfpart250': pdfpart250, 
			'pdfpart251': pdfpart251, 
			'pdfpart252': pdfpart252, 
			'pdfpart253': pdfpart253, 
			'pdfpart254': pdfpart254, 
			'pdfpart255': pdfpart255, 
			'pdfpart256': pdfpart256, 
			'pdfpart257': pdfpart257, 
			'pdfpart258': pdfpart258, 
			'pdfpart259': pdfpart259, 
			'pdfpart260': pdfpart260, 
			'pdfpart261': pdfpart261, 
			'pdfpart262': pdfpart262, 
			'pdfpart263': pdfpart263, 
			'pdfpart264': pdfpart264, 
			'pdfpart265': pdfpart265, 
			'pdfpart266': pdfpart266, 
			'pdfpart267': pdfpart267, 
			'pdfpart268': pdfpart268, 
			'pdfpart269': pdfpart269, 
			'pdfpart270': pdfpart270, 
			'pdfpart271': pdfpart271, 
			'pdfpart272': pdfpart272, 
			'pdfpart273': pdfpart273, 
			'pdfpart274': pdfpart274, 
			'pdfpart275': pdfpart275, 
			'pdfpart276': pdfpart276, 
			'pdfpart277': pdfpart277, 
			'pdfpart278': pdfpart278, 
			'pdfpart279': pdfpart279, 
			'pdfpart280': pdfpart280, 
			'pdfpart281': pdfpart281, 
			'pdfpart282': pdfpart282, 
			'pdfpart283': pdfpart283, 
			'pdfpart284': pdfpart284, 
			'pdfpart285': pdfpart285, 
			'pdfpart286': pdfpart286, 
			'pdfpart287': pdfpart287, 
			'pdfpart288': pdfpart288, 
			'pdfpart289': pdfpart289, 
			'pdfpart290': pdfpart290, 
			'pdfpart291': pdfpart291, 
			'pdfpart292': pdfpart292, 
			'pdfpart293': pdfpart293, 
			'pdfpart294': pdfpart294, 
			'pdfpart295': pdfpart295, 
			'pdfpart296': pdfpart296, 
			'pdfpart297': pdfpart297, 
			'pdfpart298': pdfpart298, 
			'pdfpart299': pdfpart299, 
			'pdfpart300': pdfpart300, 
			'pdfpart301': pdfpart301, 
			'pdfpart302': pdfpart302, 
			'pdfpart303': pdfpart303, 
			'pdfpart304': pdfpart304, 
			'pdfpart305': pdfpart305, 
			'pdfpart306': pdfpart306, 
			'pdfpart307': pdfpart307, 
			'pdfpart308': pdfpart308, 
			'pdfpart309': pdfpart309, 
			'pdfpart310': pdfpart310, 
			'pdfpart311': pdfpart311, 
			'pdfpart312': pdfpart312, 
			'pdfpart313': pdfpart313, 
			'pdfpart314': pdfpart314, 
			'pdfpart315': pdfpart315, 
			'pdfpart316': pdfpart316, 
			'pdfpart317': pdfpart317, 
			'pdfpart318': pdfpart318, 
			'pdfpart319': pdfpart319, 
			'pdfpart320': pdfpart320, 
			'pdfpart321': pdfpart321, 
			'pdfpart322': pdfpart322, 
			'pdfpart323': pdfpart323, 
			'pdfpart324': pdfpart324, 
			'pdfpart325': pdfpart325, 
			'pdfpart326': pdfpart326, 
			'pdfpart327': pdfpart327, 
			'pdfpart328': pdfpart328, 
			'pdfpart329': pdfpart329, 
			'pdfpart330': pdfpart330, 
			'pdfpart331': pdfpart331, 
			'pdfpart332': pdfpart332, 
			'pdfpart333': pdfpart333, 
			'pdfpart334': pdfpart334, 
			'pdfpart335': pdfpart335, 
			'pdfpart336': pdfpart336, 
			'pdfpart337': pdfpart337, 
			'pdfpart338': pdfpart338, 
			'pdfpart339': pdfpart339, 
			'pdfpart340': pdfpart340, 
			'pdfpart341': pdfpart341, 
			'pdfpart342': pdfpart342, 
			'pdfpart343': pdfpart343, 
			'pdfpart344': pdfpart344, 
			'pdfpart345': pdfpart345, 
			'pdfpart346': pdfpart346, 
			'pdfpart347': pdfpart347, 
			'pdfpart348': pdfpart348, 
			'pdfpart349': pdfpart349, 
			'pdfpart350': pdfpart350, 
			'pdfpart351': pdfpart351, 
			'pdfpart352': pdfpart352, 
			'pdfpart353': pdfpart353, 
			'pdfpart354': pdfpart354, 
			'pdfpart355': pdfpart355, 
			'pdfpart356': pdfpart356, 
			'pdfpart357': pdfpart357, 
			'pdfpart358': pdfpart358, 
			'pdfpart359': pdfpart359, 
			'pdfpart360': pdfpart360, 
			'pdfpart361': pdfpart361, 
			'pdfpart362': pdfpart362, 
			'pdfpart363': pdfpart363, 
			'pdfpart364': pdfpart364, 
			'pdfpart365': pdfpart365, 
			'pdfpart366': pdfpart366, 
			'pdfpart367': pdfpart367, 
			'pdfpart368': pdfpart368, 
			'pdfpart369': pdfpart369, 
			'pdfpart370': pdfpart370, 
			'pdfpart371': pdfpart371, 
			'pdfpart372': pdfpart372, 
			'pdfpart373': pdfpart373, 
			'pdfpart374': pdfpart374, 
			'pdfpart375': pdfpart375, 
			'pdfpart376': pdfpart376, 
			'pdfpart377': pdfpart377, 
			'pdfpart378': pdfpart378, 
			'pdfpart379': pdfpart379, 
			'pdfpart380': pdfpart380, 
			'pdfpart381': pdfpart381, 
			'pdfpart382': pdfpart382, 
			'pdfpart383': pdfpart383, 
			'pdfpart384': pdfpart384, 
			'pdfpart385': pdfpart385, 
			'pdfpart386': pdfpart386, 
			'pdfpart387': pdfpart387, 
			'pdfpart388': pdfpart388, 
			'pdfpart389': pdfpart389, 
			'pdfpart390': pdfpart390, 
			'pdfpart391': pdfpart391, 
			'pdfpart392': pdfpart392, 
			'pdfpart393': pdfpart393, 
			'pdfpart394': pdfpart394, 
			'pdfpart395': pdfpart395, 
			'pdfpart396': pdfpart396, 
			'pdfpart397': pdfpart397, 
			'pdfpart398': pdfpart398, 
			'pdfpart399': pdfpart399, 
			'pdfpart400': pdfpart400
	  },
	  complete: function (response) {
	    // alert(response.responseText);

	    $.ajax({
			   url:'dist/docs/pdf.php',
			   data: { 'namepdf': namePDF},
			   complete: function (response) {
			     // alert(response.responseText);
			   },
			   error: function () {
			   	alert('Erro ao gerar o PDF...');
			   }
			});

	 },
	  error: function () {
	  	alert('Erro ao alterar o txt...');
	  }
	}); 

};

function headerFooterFormatting(doc, totalPages) {
	var i = 0;
  for(i = totalPages; i >= 1; i--) { 
    doc.setPage(i);                            

    header(doc);

    if (i == totalPages) {
	    if (dataAssinaturaURL) {
		    doc.addImage(dataAssinaturaURL, 'JPEG', margins.left, doc.internal.pageSize.height - 250);          
		  }
	  }
    
    footer(doc, i, totalPages);
    doc.page++;
  }
};

function header(doc) {
  doc.setFontSize(30);
  doc.setTextColor(40);
  doc.setFontStyle('normal');

  if (base64Img) {
    doc.addImage(base64Img, 'JPEG', 250, 20, 100,40);        
  }
    
  // doc.text("Contrato de Seguro", margins.left + 50, 40 ); // titulo ao lado do logo
	doc.setLineCap(2);
	doc.line(3, 70, margins.width + 43,70); // horizontal line
};

function imgToBase64(url, callback, imgVariable) {
 
    if (!window.FileReader) {
        callback(null);
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
			imgVariable = reader.result.replace('text/xml', 'image/jpeg');
            callback(imgVariable);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
};

function footer(doc, pageNumber, totalPages){

    var str = "Página " + pageNumber + " de " + totalPages
   
    doc.setFontSize(10);
    doc.text(str, margins.left, doc.internal.pageSize.height - 20);
    
};

function base64ToArrayBuffer(data) {
 	var binaryString = window.atob(data);
 	var binaryLen = binaryString.length;
 	var bytes = new Uint8Array(binaryLen);
 	for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
 	}
 	return bytes;
}
   
 function saveByteArray(reportName, byte) {
   var blob = new Blob([byte], {type: "application/pdf"});
   var link = document.createElement('a');
   link.href = window.URL.createObjectURL(blob);
   var fileName = reportName;
   link.download = fileName;
   link.click();
 }
 
 function downloadPDF(valor){
 	var sampleArr = base64ToArrayBuffer(valor);
 	saveByteArray("HONDA - CONTRATO DE SEGURO - " + atribNome, sampleArr);
 }