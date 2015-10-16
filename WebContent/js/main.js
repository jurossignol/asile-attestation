$('#thefile').picEdit({
	imageUpdated: function(img) {
		$('.picedit_box').addClass("hidden");

		var options =
        {
            thumbBox: '.thumbBox',
            spinner: '.spinner',
            imgSrc: img.src
        }
        var cropper = $('.imageBox').cropbox(options);
		
        $('#btnCrop').on('click', function(){
            $("#theimg").attr("src", cropper.getDataURL());
			$('#theimg').removeClass("hidden");
			$('#theimgbtn').removeClass("hidden");
            $('.imageBox').addClass("hidden");
        });
        
        $('#btnCancel').on('click', function(){
            $("#theimg").attr("src", '');
			$('#theimg').addClass("hidden");
			$('#theimgbtn').addClass("hidden");
			$('.imageBox').addClass("hidden");
            $('.picedit_box').removeClass("hidden");
        });
        
        $('#btnImgCancel').on('click', function(){
            $("#theimg").attr("src", '');
			$('#theimg').addClass("hidden");
			$('#theimgbtn').addClass("hidden");
			$('.imageBox').addClass("hidden");
            $('.picedit_box').removeClass("hidden");
        });
        
        $('#btnZoomIn').on('click', function(){
            cropper.zoomIn();
        });
        
        $('#btnZoomOut').on('click', function(){
            cropper.zoomOut();
        });
		
		$('.imageBox').removeClass("hidden");
	}
});

$(".mineur").change(function() {
    if($(this).val() === 'oui') {
    	$("#group-represent").show();
    } else {
    	$("#group-represent").hide();
    	$("#field_represent").val("");
    }
});

function generatePdf() {
	var pdf = new jsPDF('p', 'cm', 'a4');
	pdf.setFillColor(0);

	pdf.setFontSize(14);
	pdf.setFontType("bold");
	pdf.addImage($('#theimg').prop('src'), 'JPEG', 15.1, 5.7, 2.9, 3.4);
	pdf.text("ATTESTATION DE DEMANDE D'ASILE", 10.5, 10.3, 'center');
	pdf.text("PROCEDURE " + $("#field_type").val().toUpperCase(), 10.5, 10.8, 'center');
	
	pdf.setFontSize(11);
	pdf.setFontType("normal");
	
	pdf.text("Signature du titulaire", 18, 13, 'right');
	pdf.text("Cachet et signature de l'autorité", 18, 24, 'right');
	
	pdf.text("Identifiant : " + $("#field_id").val(), 2, 12);
	pdf.text("Nom : " + $("#field_lastName").val(), 2, 12.7);
	pdf.text("Nom d'usage : " + $("#field_usedLastName").val(), 2, 13.4);
	pdf.text("Prénoms : " + $("#field_firstName").val(), 2, 14.1);
	if($("#field_sex_m").prop("checked") == true){
		pdf.text("Sexe : " + $("#field_sex_m").val(), 2, 14.8);
	} else {
		pdf.text("Sexe : " + $("#field_sex_f").val(), 2, 14.8);
	}
	
	pdf.text("Situation familiale : " + $("#field_situation").val(), 2, 16);
	pdf.text("Né(e) le : " + moment($("#field_birthDate").val()).format("DD/MM/YYYY"), 2, 16.7);
	pdf.text("A : " + $("#field_birthCity").val() + ", " + $("#field_birthCountry option:selected").text(), 2, 17.4);
	if($("#field_mineur_o").prop("checked") == true){
		pdf.text("Mineur", 2, 18.1);
		pdf.text("Représentant légal : " + $("#field_represent").val(), 2, 18.8);
	}

	pdf.text("Adresse :", 2, 20);
	pdf.text($("#field_addressComplement").val(), 2.5, 20.7);
	pdf.text($("#field_addressStreet").val(), 2.5, 21.4);
	pdf.text($("#field_addressCity").val(), 2.5, 22.1);
	pdf.text("Chez :", 2, 22.8);
	pdf.text($("#field_addressOwner").val(), 2.5, 23.5);

	pdf.text("Délivrée par : " + $("#field_deliveryBy").val(), 2, 24.7);
	pdf.text("Le : " + moment($("#field_deliveryDate").val()).format("DD/MM/YYYY"), 2, 25.4);
	pdf.text("Valable jusqu'au : " + getEndDate().format("DD/MM/YYYY"), 2, 26.1);
	pdf.text("Date de premier enregistrement en guichet unique : " + moment($("#field_firstDeliveryDate").val()).format("DD/MM/YYYY"), 2, 26.8);
	pdf.text("Statut : " + $("#field_status").val(), 2, 27.5);
	
	pdf.save('attestation_' + $("#field_id").val() + '.pdf');
}

function getEndDate(){
	var type = $("#field_type").val();
	var status = $("#field_status").val();
	var date = moment($("#field_deliveryDate").val());
	
	if(status === 'Première délivrance'){
		date.add(1, 'M');
	} else if(status === 'Premier renouvellement') {
		if(type === 'Dublin'){
			date.add(4, 'M');
		} else if(type === 'Normale'){
			date.add(9, 'M');
		} else if(type === 'Accélérée'){
			date.add(6, 'M');
		}
	} else if(status === 'Deuxième renouvellement') {
		if(type === 'Dublin'){
			date.add(4, 'M');
		} else if(type === 'Normale'){
			date.add(6, 'M');
		} else if(type === 'Accélérée'){
			date.add(3, 'M');
		}
	}
	date.subtract(1, 'd');
	return date;
}

/** TEMPORAIRE **/
$("#field_type").change(function(){
	$("#field_id").val("5613208497");
	$("#field_lastName").val("Jan");
	$("#field_usedLastName").val("Jun");
	$("#field_firstName").val("Ly, Ka, Lu");
	$("#field_sex_m").prop("checked", true ).trigger('change');
	$("#field_situation").val("Célibataire");
	$("#field_birthDate").val(moment("2000-02-02").format("YYYY-MM-DD"));
	$("#field_birthCity").val("Pékin");
	$("#field_birthCountry").val("CN");
	$("#field_mineur_o").prop("checked", true ).trigger('change');
	$("#field_represent").val("Kan Chu");
	$("#field_addressOwner").val("Chu Xan");
	$("#field_addressStreet").val("1 avenue Daumesnil");
	$("#field_addressCity").val("75012 Paris");
	$("#field_addressComplement").val("Bâtiment 1");
	$("#field_deliveryBy").val("93 Prefecture de Seine-Saint-Denis");
	$("#field_deliveryDate").val(moment("2015-09-16").format("YYYY-MM-DD"));
	$("#field_firstDeliveryDate").val(moment("2015-09-16").format("YYYY-MM-DD"));
	$("#field_status").val("Première délivrance");
});