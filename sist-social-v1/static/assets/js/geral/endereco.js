function buscarEnderecoViaCep(cep) {
    var url = "https://viacep.com.br/ws/" + cep + "/json/";

    return $.getJSON(url, function(dados) {
        try {
            return dados;
        } catch (err) {
            swal({
                title: 'Não foi possível identificar o endereço!',
                text: '',
                type: 'error',
                confirmButtonColor: "#ed5565",
                confirmButtonText: "OK"
            });
        }
    }).fail(function() {
        swal({
            title: 'Não foi possível identificar o endereço!',
            text: '',
            type: 'error',
            confirmButtonColor: "#ed5565",
            confirmButtonText: "OK"
        })
    }).promise();
}

function retornaDadosEndereco(endereco) {
    var url = "http://maps.google.com/maps/api/geocode/json?address=" + endereco + '&sensor=false&key=' + (window.GOOGLE_API_KEY || '');

    return $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + endereco + "&sensor=false&key=" + (window.GOOGLE_API_KEY || ''),
        dataType: "json",
        success: function(dados) {
            return dados;
        }
    });


    return $.getJSON(url, function(dados) {
        try {
            if (dados.status === 'OK') {
                return dados;
            } else {
                swal({
                    title: 'Não foi possível atualizar os dados do endereço!',
                    text: 'Entre em contato com o suporte',
                    type: 'error',
                    confirmButtonColor: "#ed5565",
                    confirmButtonText: "OK"
                });
            }
        } catch (err) {
            swal({
                title: 'Não foi possível consultar os dados do endereço!',
                text: 'Entre em contato com o suporte',
                type: 'error',
                confirmButtonColor: "#ed5565",
                confirmButtonText: "OK"
            });
        }
    }).fail(function() {
        swal({
            title: 'Não foi possível consultar os dados do endereço!',
            text: 'Entre em contato com o suporte',
            type: 'error',
            confirmButtonColor: "#ed5565",
            confirmButtonText: "OK"
        })
    }).promise();
}

function geocoderGoogle(obj) {
    var arrEndereco = ['', 'street_number', 'country', 'route', 'sublocality_level_1', 'administrative_area_level_2', 'administrative_area_level_1'];
    var arrNomesEnd = { route: 'rua', sublocality_level_1: 'bairro', administrative_area_level_2: 'cidade', administrative_area_level_1: 'uf', street_number: 'numero', country: 'pais', postal_code: 'cep', postal_code_prefix: 'cep' };
    var objEndereco = new Object();
    var stringEval;
    var componentForm = {
        street_number: 'long_name',
        route: 'long_name',
        sublocality_level_1: 'long_name',
        country: 'long_name',
        postal_code: 'long_name',
        administrative_area_level_1: 'short_name',
        administrative_area_level_2: 'long_name',
        political: 'long_name',
        postal_code_prefix: 'long_name'
    };

    if (obj && obj.address_components.length > 0) {
        for (var i = 0; i < obj.address_components.length; i++) {
            var tipo = obj.address_components[i].types[0];
            // condição "if tipo=='street_number'", e tambem atentar que pode retornar um intervalo numerico
            if ($.inArray(tipo, arrEndereco)) {
                if (tipo != 'locality') {
                    stringEval = 'objEndereco.' + arrNomesEnd[tipo] + ' = "' + obj.address_components[i][componentForm[tipo]] + '";'
                    eval(stringEval);
                }
            }
        }
    } else {
        objEndereco = { rua: '', numero: '', bairro: '', cidade: '', uf: '', pais: '', cep: '' };
    }
    return objEndereco;
}