$(function() {
    $.getScript(caminho + "sist_central/assets/js/crud/crudApi.js");
    $('#cep').mask('99999-999');
    $('#cep').blur(buscarCep);
    $('#numero').on('input', function() {
        var numero = $(this).val();
        $(this).val(numero.replace(/[^0-9]/g, ''));
    });

    $('#botaoSalvar').click(function(e) {
        e.preventDefault();
        var resValidacao = validarForm();

        if (resValidacao) {
            $('#cep').unmask();
            $('#formOrganizador').submit();
        }
    });

    $('#botaoProximo').click(function(e) {
        e.preventDefault();
        $('#tab2').trigger('click');
    });

    $('#logradouro').prop('readonly', true);
    $('#bairro').prop('readonly', true);
    $('#cidade').prop('readonly', true);
    $('#estado').prop('readonly', true);
});




function buscarCep() {
    var cep = $(this).val();
    if (cep.length === 9) {
        $.getJSON('https://viacep.com.br/ws/' + cep + '/json', function(retorno) {
            (typeof retorno.erro == "undefined") ? preencherEndereco(retorno): alertErro('cep não encontrado');
        });
    } else {
        alertErro('cep inválido');
        limparCampos();
    }
}

function preencherEndereco(dados) {
    latLng(dados.cep);
    $('#logradouro').val(dados.logradouro).prop('readonly', true);
    $('#bairro').val(dados.bairro).prop('readonly', true);
    $('#cidade').val(dados.localidade).prop('readonly', true);
    $('#estado').val(dados.uf).prop('readonly', true);
}

function limparCampos() {
    $('input').val('').prop('disabled', false);
}

function validarForm() {

    var campos = [];
    var tabs = [false, false];
    var rotulosEndereco = ['#logradouro', '#cidade', '#estado'];
    var rotuloDados = ['#nome', '#responsavel'];
    var erro = false;

    $('.labelErro').remove();
    $('.erroFormIcon').remove();

    // Dados basicos
    for (var i = 0; i < rotuloDados.length; i++) {
        if ($(rotuloDados[i]).val() == '' || $(rotuloDados[i]).val() == null) {
            campos.push(rotuloDados[i]);
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
    if (campos.length == 0) return true;
    mostrarErros(campos, tabs);
    return false;
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

function alertErro(msg) {
    swal({
        title: 'Aviso!',
        text: msg,
        type: 'error',
        confirmButtonColor: '#ed5565',
        confirmButtonText: 'OK'
    });
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