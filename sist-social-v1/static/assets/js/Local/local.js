var cod;
$(function() {

    cod = $('#formulario').attr('data-cod');

    $('.inputCep').mask('00000-000');
    $('#telefone').mask('(00) 00000-0009');

    $('#cep').on('input', buscarCep);

    $('.combo').select2({});
    $('#telefone').blur(function() {
        if ($('#telefone').val().length == 1) {
            $(this).val('');
        }
    });
});

function buscarCep() {

    var valorDigitado = $(this).val();

    if (valorDigitado.length === 9) {

        $.getJSON('https://viacep.com.br/ws/' + valorDigitado + '/json', function(retorno) {

            preencherEndereco(retorno);
        });
    }
}

function preencherEndereco(dados) {

    latLng(dados.cep);
    $('#logradouro').val(dados.logradouro);
    $('#bairro').val(dados.bairro);
    $('#cidade').val(dados.localidade);
    $('#estado').val(dados.uf);
}

function latLng(cep) {

    $.getJSON(
        'https://maps.google.com/maps/api/geocode/json?key=' + (window.GOOGLE_API_KEY || '') + '&address=' + cep + '&sensor=false',
        'async: false',
        function(retorno) {

            if (retorno.status === 'OK') {

                var ponto = retorno.results[0].geometry.location;

                $('#lat').val(ponto.lat);
                $('#lng').val(ponto.lng);
            }
        });
}

function validar() {
    var campos = [];
    var tabs = [false, false, false];
    var rotulosEndereco = ['#logradouro', '#cidade', '#estado'];
    var rotulosLocal = ['#nome'];

    // Local
    for (var i = 0; i < rotulosLocal.length; i++) {
        if ($(rotulosLocal[i]).val() == '' || $(rotulosLocal[i]).val() == null) {
            campos.push(rotulosLocal[i]);
            tabs[0] = true;
        }
    }


    //Endereco
    for (var i = 0; i < rotulosEndereco.length; i++) {
        if ($(rotulosEndereco[i]).val() == '' || $(rotulosEndereco[i]).val() == null) {
            campos.push(rotulosEndereco[i]);
            tabs[1] = true;
        }
    }

    if ($('#tipo_local').val() == '' || $('#tipo_local').val() == null) {
        campos.push('#tipo_local');
        tabs[0] = true;
    }

    if (campos.length == 0) return true;
    mostrarErros(campos, tabs);
    return false
}

function mostrarErros(campos, tabs) {
    $('.erro').remove();
    swal({
        html: true,
        title: 'Preencha todos os campos obrigatórios.',
        text: 'Verifique as abas com o ícone <i style="margin-left: 5px;" class="fa fa-exclamation-circle text-danger erro-form-icon"></i>',
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#ed5565',
        confirmButtonText: "OK",
        cancelButtonText: '',
        closeOnConfirm: false,
        closeOnCancel: false
    });
    campos.forEach(function(valor) {
        $(valor).parent().append('<label class="text-danger erro"><b>Este campo é obrigatório</b></label>');
    });

    tabs.forEach(function(val, ind) {
        if (val) {
            $('.tabs-container a[href="#tab-' + (ind + 1) + '"]').append('<i style="margin-left: 5px;" class="fa fa-exclamation-circle text-danger erro-form-icon erro"></i>');
        }
    });
}