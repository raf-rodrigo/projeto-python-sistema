var map;
var marcador;
var geocoder;
var lat;
var lng;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    sublocality_level_1: 'long_name',
    administrative_area_level_1: 'short_name',
    administrative_area_level_2: 'long_name',
    political: 'long_name'
};

$(function() {
    $('body').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            if ($('#autocompleteEndereco').is(":focus")) {
                e.preventDefault();
            }
            if ($('#cepEndereco').is(":focus")) {
                e.preventDefault();
                buscaPorCep();
            }
        }
    });

    $.ajax({
        url: caminhoBase + 'api/Mapa/htmlEndereco',
        type: 'POST',
        data: arrDados,
        success: function(html) {
            $('#endereco').html(html);
            formataChecksMapa($('.check'));
            adicionarMascara();
            trocaBusca();
            $('.btn-buscar').on('click', function() {
                buscaPorCep();
            });
            $.get(caminhoBase + 'Configuracoes/getCoordenadas', function(latLong) {
                latLong = $.parseJSON(latLong);
                lat = latLong.lat;
                lng = latLong.lng;
                iniciaMapa(lat, lng);
            })
        }
    });
});

function buscaPorCep() {
    var cep = $('#cepEndereco').val();
    if (cep.length != 0) {
        $('#load').removeClass('hidden');
        $('#numero').val('');
        buscarEnderecoViaCep(cep).done(function(retornoEndereco) {
            var endereco = retornoEndereco.logradouro + ' - ' + retornoEndereco.localidade + ' - ' + retornoEndereco.uf;
            $('#bairro').val(retornoEndereco.bairro);
            return $.ajax({
                type: "GET",
                url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + endereco + "&sensor=false&key=" + (window.GOOGLE_API_KEY || ''),
                dataType: "json",
                success: function(dados) {
                    var lat = dados.results[0].geometry.location.lat;
                    var lng = dados.results[0].geometry.location.lng;
                    setarCampos(lat, lng, dados.results[0].address_components, true);
                    carregarMapa(lat, lng);
                    $('#load').addClass('hidden');
                }
            });
        });
    } else {
        swal({
            title: 'Informe um CEP válido!',
            type: 'error',
            confirmButtonColor: '#ed5565',
            confirmButtonText: 'OK'
        });
    }
}

function trocaBusca() {
    $('#buscaEndereco').on('ifChanged', function(event) {
        if (this.checked) {
            $('#cepEndereco').addClass('hidden');
            $('.btn-buscar').addClass('hidden');
            $('#autocompleteEndereco').removeClass('hidden');
            $('#textoBusca').text('Endereço');
        } else {
            $('#autocompleteEndereco').addClass('hidden');
            $('#cepEndereco').removeClass('hidden');
            $('.btn-buscar').removeClass('hidden');
            $('#textoBusca').text('CEP');
        }
    });
}

function adicionarMascara() {
    $('#numero').mask('000000');
    $('#cepEndereco').mask('00000-000');
}

function iniciaMapa(lat, lng) {
    map = new google.maps.Map(document.getElementById('mapa_ip'), {
        center: { lat: lat, lng: lng },
        zoom: 14,
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        scrollwheel: false,
        mapTypeControl: false,
        streetViewControl: false,
        minZoom: 13
    });

    geocoder = new google.maps.Geocoder();

    var input = document.getElementById('autocompleteEndereco');

    var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        $('#load').show();
        var address = input.value;

        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                carregarMapa(latitude, longitude);

                setarCampos(latitude, longitude, results[0].address_components);
            }
        });

        var places = autocomplete.getPlace();

        if (places.length == 0) {
            return;
        }
    });

    if ($('#latitude').val() != '' && $('#longitude').val() != '') {
        carregarMapa($('#latitude').val(), $('#longitude').val())
    }
}

function carregarMapa(latitude, longitude) {
    var latLong = new google.maps.LatLng(latitude, longitude);
    if (marcador != null) {
        marcador.setMap(null);
    }
    marcador = new google.maps.Marker({
        position: latLong,
        map: map,
        draggable: true
    });

    map.setZoom(18);
    marcador.addListener("dragend", function() {
        geocoder.geocode({
            latLng: this.getPosition()
        }, function(responses) {
            if (responses && responses.length > 0) {
                setarCampos(marcador.getPosition().lat(), marcador.getPosition().lng(), responses[0].address_components);
            } else {
                swal({
                    title: 'Não foi possível localizar o endereço!',
                    text: '',
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: "#179d82",
                    confirmButtonText: "Ok"
                });
            }
        });
    });

    map.setCenter(marcador.getPosition());
}

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

function setarCampos(lat, lng, endereco, buscacep) {
    var cep = buscacep;
    if (cep == null) {
        cep = false;
    }
    for (var i = 0; i < endereco.length; i++) {
        var addressType = endereco[i].types[0];


        if (addressType == 'route') {
            $('#logradouro').val(endereco[i][componentForm[addressType]]);
            continue;
        }

        if (addressType == 'political') {
            $('#bairro').val(endereco[i][componentForm[addressType]]);
            continue;
        }

        if (addressType == 'street_number' && !cep) {
            var numero = endereco[i][componentForm[addressType]];
            if (!isNaN(numero))
                $('#numero').val(endereco[i][componentForm[addressType]]);
            else
                $('#numero').val('');
            continue;
        }

        if (addressType == 'administrative_area_level_2') {
            $('#cidade').val(endereco[i][componentForm[addressType]]);
            continue;
        }

        if (addressType == 'administrative_area_level_1') {
            $('#estado').val(endereco[i][componentForm[addressType]]);
            continue;
        }
    }

    $('#txtLatitude').val(lat);
    $('#txtLongitude').val(lng);
    $('#latitude').val(lat);
    $('#longitude').val(lng);
}

function formataChecksMapa(classe) {
    $(classe).iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}