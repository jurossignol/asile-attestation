'use strict';

$.getJSON( "conf/config.json", {_: moment().valueOf()})
	.done(function( data ) {
		if(data.modeFormulaireComplet) {
			initForm();
		} else {
			$('#title-photo').show();
			$('#form-photo').show();
			$('.infoBox').append("<br><br>Merci d'enregistrer l'image dans le répertoire suivant : " + data.repertoirePhoto);
			$('#bloc-form').remove();
		}
	})
	.fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});

var cropCtx = { 
	cropper: null,
	cropperOptions: {
		thumbBox: '.thumbBox',
		spinner: '.spinner'
	}
};

$('#thefile').picEdit({
	imageUpdated: function(img) {
		$('.picedit_box').addClass("hidden");
		$('.imageBox').removeClass("hidden");
		cropCtx.cropperOptions.imgSrc = img.src;
		cropCtx.cropper = $('.imageBox').cropbox(cropCtx.cropperOptions);
	}
});

$('#btnCancel').on('click', function(){
	$('#thefile').val(null);
	$('.picedit_action_btns').addClass("active");
    $('.picedit_canvas canvas').remove();
    $('.picedit_box').css("width", "");
    $('.picedit_box').css("height", "");
    $('.picedit_box').removeClass("hidden");
    $('.imageBox').css("background", "");
	$('.imageBox').addClass("hidden");
});

$('#btnCrop').on('click', function(){
    $("#theimg").attr("src", cropCtx.cropper.getDataURL());
	$('.finalImageBox').removeClass("hidden");
	$('.infoBox').removeClass("hidden");
    $('.imageBox').addClass("hidden");
});

$('#btnImgCancel').on('click', function(){
	$("#theimg").attr("src", '');
	$('.finalImageBox').addClass("hidden");
	$('.infoBox').addClass("hidden");
	$('.imageBox').removeClass("hidden");
});

$('#btnImgSave').on('click', function(){
	if($("#field_agdrefId").val() === ''){
		alert("Merci de préciser un numéro d'étranger AGDREF");
	} else if($("#field_agdrefId").val().length != 10) {
		alert("Le numéro d'étranger AGDREF doit contenir 10 caractères");
	} else {
		var photoLink = document.createElement('a');
		photoLink.href = $("#theimg").attr("src");
		photoLink.download = $("#field_agdrefId").val() + ".jpeg";
		photoLink.click();
	}
});

$('#btnZoomIn').on('click', function(){
	cropCtx.cropper.zoomIn();
});

$('#btnZoomOut').on('click', function(){
	cropCtx.cropper.zoomOut();
});


function initForm() {

	$('#btnImgSave').remove();
	$('#title-form').show();
	$('#bloc-form').show();
	
	$(".mineur").change(function() {
	    if($(this).val() === 'oui') {
	    	$("#group-represent").show();
	    } else {
	    	$("#group-represent").hide();
	    	$("#field_representLastName").val("");
	    	$("#field_representFirstName").val("");
	    	$("#field_representMoral_o").prop("checked", false ).trigger('change');
	    	$("#field_representMoral_n").prop("checked", false ).trigger('change');
	    }
	});
	
	$(".representMoral").change(function() {
	    if($(this).val() === 'oui') {
	    	$("#group-representDesignation").show();
	    } else {
	    	$("#group-representDesignation").hide();
	    	$("#field_representDesignation").val("");
	    }
	});
	
	$("#field_type").change(function() {
		calculateValidityDate();
	});
	$("#field_status").change(function() {
		calculateValidityDate();
	});
	$("#field_deliveryDate").change(function() {
		calculateValidityDate();
	});
	
	function calculateValidityDate(){
		var type = $("#field_type").val();
		var status = $("#field_status").val();
		var date = moment($("#field_deliveryDate").val(), 'YYYY-MM-DD');
		
		if(type === '' || status === '' || !date.isValid()) {
			$("#field_validityDate").val(null);
			return;
		}
		
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
	
		$("#field_validityDate").val(moment(date).format("YYYY-MM-DD"));
	}
	
	
	if(window.location.search.indexOf("devtest") > -1) {
		$("#field_type").val("Normale");
		$("#field_id").val("5613208497");
		$("#field_lastName").val("Jan");
		$("#field_usedLastName").val("Jun");
		$("#field_firstName").val("Ly, Ka, Lu");
		$("#field_sex_m").prop("checked", true ).trigger('change');
		$("#field_situation").val("Célibataire");
		$("#field_birthDate").val(moment("2000-02-02").format("YYYY-MM-DD"));
		$("#field_birthCity").val("Pékin");
		$("#field_birthCountry").val("RPC");
		$("#field_mineur_o").prop("checked", true ).trigger('change');
		$("#field_representLastName").val("Kan");
		$("#field_representFirstName").val("Chu");
		$("#field_representMoral_o").prop("checked", true ).trigger('change');
		$("#field_representDesignation").val("Cha cha");
		$("#field_addressOwner").val("Chu Xan");
		$("#field_addressStreet").val("1 avenue Daumesnil");
		$("#field_addressCity").val("75012 Paris");
		$("#field_addressComplement").val("Bâtiment 1");
		$("#field_deliveryBy").val("93 Prefecture de Seine-Saint-Denis");
		$("#field_deliveryDate").val(moment("2015-09-16").format("YYYY-MM-DD")).trigger('change');
		$("#field_firstDeliveryDate").val(moment("2015-09-16").format("YYYY-MM-DD"));
		$("#field_status").val("Première délivrance").trigger('change');
	}
}


function generatePdf() {
	var pdf = new jsPDF('p', 'cm', 'a4');
	pdf.setFillColor(0);

	pdf.setFontSize(14);
	pdf.setFontType("bold");
	
	// PHOTO
	pdf.addImage($('#theimg').prop('src'), 'JPEG', 15.1, 5.7, 2.9, 3.4);
	
	// TITRE
	pdf.text("ATTESTATION DE DEMANDE D'ASILE", 10.5, 10.1, 'center');
	pdf.text("PROCEDURE " + $("#field_type").val().toUpperCase(), 10.5, 10.6, 'center');
	
	pdf.setFontSize(11);
	pdf.setFontType("normal");
	
	// SIGNATURE
	pdf.text("Signature du titulaire", 18, 12.8, 'right');
	pdf.text("Cachet et signature de l'autorité", 18, 23.5, 'right');
	
	// IDENTITE
	pdf.text("Identifiant : " + $("#field_id").val(), 2, 11.5);
	pdf.text("Nom : " + $("#field_lastName").val(), 2, 12.2);
	pdf.text("Nom d'usage : " + $("#field_usedLastName").val(), 2, 12.9);
	pdf.text("Prénoms : " + $("#field_firstName").val(), 2, 13.6);
	if($("#field_sex_m").prop("checked") == true){
		pdf.text("Sexe : " + $("#field_sex_m").val(), 2, 14.3);
	} else {
		pdf.text("Sexe : " + $("#field_sex_f").val(), 2, 14.3);
	}
	
	pdf.text("Situation familiale : " + $("#field_situation").val(), 2, 15);
	pdf.text("Né(e) le : " + moment($("#field_birthDate").val()).format("DD/MM/YYYY"), 2, 15.7);
	pdf.text("A : " + $("#field_birthCity").val() + ", " + $("#field_birthCountry option:selected").text(), 2, 16.4);
	if($("#field_mineur_o").prop("checked") == true){
		pdf.text("Mineur", 2, 17.1);
		pdf.text("Nom du représentant légal : " + $("#field_representLastName").val(), 2, 17.8);
		pdf.text("Prénom du représentant légal : " + $("#field_representFirstName").val(), 2, 18.5);
		if($("#field_representMoral_o").prop("checked") == true){
			pdf.text("Désignation de la personne morale : " + $("#field_representDesignation").val(), 2, 19.2);
		}
	}

	// ADRESSE
	pdf.text("Adresse :", 2, 20.2);
	pdf.text($("#field_addressComplement").val(), 2.5, 20.9);
	pdf.text($("#field_addressStreet").val(), 2.5, 21.6);
	pdf.text($("#field_addressCity").val(), 2.5, 22.3);
	pdf.text("Chez :", 2, 23);
	pdf.text($("#field_addressOwner").val(), 2.5, 23.7);

	// DELIVRANCE
	pdf.text("Délivrée par : " + $("#field_deliveryBy").val(), 2, 24.7);
	pdf.text("Le : " + moment($("#field_deliveryDate").val()).format("DD/MM/YYYY"), 2, 25.4);
	pdf.text("Valable jusqu'au : " + moment($("#field_validityDate").val()).format("DD/MM/YYYY"), 2, 26.1);
	pdf.text("Date de premier enregistrement en guichet unique : " + moment($("#field_firstDeliveryDate").val()).format("DD/MM/YYYY"), 2, 26.8);
	pdf.text("Statut : " + $("#field_status").val(), 2, 27.5);
	
	pdf.save('attestation_' + $("#field_id").val() + '.pdf');
}