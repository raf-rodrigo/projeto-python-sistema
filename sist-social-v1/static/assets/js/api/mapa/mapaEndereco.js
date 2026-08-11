function mapaEndereco(idDivMapa,idDivEndereco,jsonEndereco){

    this.caminhoCentral = caminho+'sist_central/';
    this.coordenadaMapaInicial = null;
    this.mapaTela = null;
    this.mapaModal = null;
    this.divFormEndereco = $('#'+idDivEndereco);
    this.htmlCarregando = '<div style="text-align:center"><i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Loading...</span></div>';
    this.objEndereco = {rua:null,numero:null,cep:null,bairroId:null,bairro:null,cidade:null,uf:null,latitude:null,longitude:null};
    this.objEnderecoCompleto = null;

    carregarLibMapa = function(){
        $('#'+idDivMapa).html(this.htmlCarregando);
        return $.getScript(caminho+"sist_central/assets/js/geral/mapa2.js")
        .fail(function(){
            $('#'+idDivMapa).html("<div class=\"texte-center\">Falha ao carregar lib de Mapa</div>");
        });
    };

    carregarLibEndereco = function(){
        return $.getScript(caminho+"sist_central/assets/js/geral/endereco.js")
        .fail(function(){
            alert('Falha ao carregar lib de Endereço');
        });
    };

    falhaMapaEndereco = function(){
        divFormEndereco.html("<div class=\"text-center\">Falha ao carregar Formulário de Endereço.</div>");
    };

    definirCssDivEndereco = function(){
        this.divFormEndereco.addClass('form-group');
        this.divFormEndereco.addClass('text-left');
        this.divFormEndereco.css('border','1px solid #CCC');
        this.divFormEndereco.css('padding','15px 10px');
    };

    carregarMapa = function(){
        this.mapaTela = new Mapa(idDivMapa);

        var configInicial = {
            center: this.coordenadaMapaInicial,
            scrollwheel: false,
            zoom: 13
        };

        this.mapaTela.inicializa(configInicial);

        this.mapaTela.setMarcador({
            map: this.mapaTela.getMapa(),
            position: this.coordenadaMapaInicial,
            animation: google.maps.Animation.DROP
        });
    };

    carregarModalMapaEndereco = function(){
        return $.get(this.caminhoCentral+"api/Mapa/modalEndereco",function(html){
            $("body").append(html);
            $('#modalEnderecoMapa').css('margin','-25px');
            $('#modalEnderecoMapa .modal-body').css('padding:','20px');

        }).fail(function(){
            alert('Falha ao carregar Modal de Mapa/Endereço');
            this.falhaMapaEndereco();
        });
    };

    carregarFormEndereco = function(){
        this.definirCssDivEndereco();
        this.divFormEndereco.html(this.htmlCarregando);
        return $.get( this.caminhoCentral+"api/Mapa/formEndereco",function(html){
            divFormEndereco.html(html);
        }).fail(function(){
            falhaMapaEndereco();
        });
    };

    atribuirAcaoBotaoEditar = function(){
        $('#btnBuscarEnderecoMapa').click(function(){
            $('#modalEnderecoMapa').modal('show');
            atribuirAcaoConfirmarEnderecoModal();
        });
    };

    atribuirAcaoAbrirModal = function(){
        $("#modalEnderecoMapa").on("shown.bs.modal",function(){
            acaoAbrirModalEndereco();
        });
    };

    atribuirAcaoConfirmarEnderecoModal = function(){
        $("#btnConfimarMapaModal").click(function(){
            acaoConfirmarEnderecoModal();
        });
    };

    carregarLibMapa().done(function(){
        carregarLibEndereco().done(function() {
            carregarCoordenadaInicial();
        });
    });

    carregarCoordenadaInicial = function(){
        // Verifica se o Json passado não é vazio
        if(typeof jsonEndereco == "undefined"){
            exibeMapaVazio();
            return;
        }

        var propriedades = ['rua','numero','cep','bairroId','bairro','cidade','uf','latitude','longitude'];

        for(var i = 0; i < propriedades.length; i++){
            var prop = propriedades[i];
            this.objEndereco[prop] = jsonEndereco[prop];
        }

        //Verifica se lat e long não estão vazias, se não, carrega as coordenadas
        if(jsonEndereco.latitude != null && jsonEndereco.longitude != null){
            this.coordenadaMapaInicial = {lat: jsonEndereco.latitude,lng:jsonEndereco.longitude};
            carregarMapa();
            return;
        }

        //Monta a string com as informações disponíveis
        var endereco = null;
        if(jsonEndereco.cep != null){
            endereco = jsonEndereco.cep;
        }else if(jsonEndereco.rua != null){
            endereco = jsonEndereco.rua + ', '+ (jsonEndereco.numero != null ? jsonEndereco.numero : '');
        }else if(jsonEndereco.cidade != null) {
            endereco = (jsonEndereco.bairro != null ? jsonEndereco.bairro : '') + ', ' + jsonEndereco.cidade + ' - ' + (jsonEndereco.uf != null ? jsonEndereco.uf : '');
        }

        //Carrega as coordenadas ou ferrou de vez, nao tem mais o que fazer
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': endereco}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                jsonEndereco.latitude = results[0].geometry.location.lat();
                jsonEndereco.longitude = results[0].geometry.location.lng();
                this.coordenadaMapaInicial = {lat: jsonEndereco.latitude,lng: jsonEndereco.longitude};
                carregarMapa();
            } else {
                exibeMapaVazio();
                return;
            }
        });
    }

    exibeMapaVazio = function(){
        $.getJSON( caminhoBase+"appg/config_ajax.php", function( data ) {
            var jsonLatLong = {latitude:data.lat,longitude:data.lng};
            mapaEndereco('mapaInicio','divEndereco',jsonLatLong);
        });
        return;
    };

    criarMapaModal = function(){
        this.mapaModal = new Mapa('mapaModal');

        var configInicial = {
            center: this.coordenadaMapaInicial,
            scrollwheel: true,
            zoom: 15
        };

        this.mapaModal.inicializa(configInicial);

        this.mapaModal.setMarcador({
            map: this.mapaModal.getMapa(),
            position: this.coordenadaMapaInicial,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
    };

    atribuirAcaoBuscarPorCep = function(){
        $('#buscarCepModal').click(function(){
            var btn = $(this);
            $(btn).prop('disabled',true);
            var cep = $('#inputCepModal').val();

            buscarEnderecoViaCep(cep).done(function(retornoEndereco){
                $(btn).prop('disabled',false);
                if(!retornoEndereco.erro){
                    $('#gifBuscarViaCep').toggle();
                    var endereco = `${retornoEndereco.logradouro} - ${retornoEndereco.localidade} - ${retornoEndereco.uf}`;
                    var resultado = retornaDadosEndereco(endereco);
                    resultado.done(function(dadosEndereco){
                        var coordenadas = dadosEndereco.results[0].geometry.location;
                        parent.mapaModal.atualizarMarcador(coordenadas);
                        parent.mapaModal.setZoom(18);
                        $('#gifBuscarViaCep').toggle();
                        dadosEndereco.results[0].address_components[1].types = ['sublocality_level_1'];//quando vem pelo arrastar o tipo political vem primeiro, desta forma colocado em primeiro o sublocality_level_1
                        var endereco = geocoderGoogle(dadosEndereco.results[0]);
                        endereco.cep = cep;
                        endereco.latitude = dadosEndereco.results[0].geometry.location.lat;
                        endereco.longitude = dadosEndereco.results[0].geometry.location.lng;
                        acaoAtribuirEndereco(endereco);
                    });
                }
                else{
                    swal({
                        title: 'Não foi possível identificar um endereço a partir do CEP informado. Por favor, tente buscar pelo nome da rua.',
                        type: 'error',
                        confirmButtonColor: '#ed5565',
                        confirmButtonText: 'OK'
                    });
                    definirInicioModal();
                    $('.tab-pane').removeClass('active');
                    $('#buscaPorRua').addClass('active');
                    $('#inputRuaModal').focus();
                }
            });
        });
    };

    acaoAoClicarEmAba = function(){
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            var tab = $(e.target);
            var contentId = tab.attr("href");
            var abaAtiva = tab.parent().hasClass('active');
            if (abaAtiva && contentId == '#buscaPorRua') {
                parent.mapaModal.setZoom(18);
                $('#inputRuaModal').focus();
            }
            else if(abaAtiva && contentId == '#buscaNoMapa'){
                //parent.mapaModal.limparMarcador();
            }
            else if (abaAtiva && contentId == '#buscaPorCep') {
                parent.mapaModal.setZoom(16);
                $('#inputCepModal').focus();
                atribuirAcaoBuscarPorCep();
            }
        });
    };

    function infoWindow(info){
        return '<p class="text-uppercase">'+info+'</p>';
    }

    acaoBuscaPorRua = function(){
        var input = document.getElementById('inputRuaModal');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds',this.mapaModal.getMapa());
        autocomplete.addListener('place_changed',function(){
            var local = autocomplete.getPlace();
            if(!local.geometry){
                swal({
                    title: 'Endereço inválido!',
                    type: 'error',
                    confirmButtonColor: '#ed5565',
                    confirmButtonText: 'OK'
                });
                return;
            }

            parent.mapaModal.atualizarMarcador(local.geometry.location);
            parent.mapaModal.setZoom(16);
            var endereco = geocoderGoogle(local);

            endereco.latitude = local.geometry.location.lat;
            endereco.longitude = local.geometry.location.lng;
            acaoAtribuirEndereco(endereco);
        });
    };

    acaoConfirmarEnderecoModal = function(){
        criarEnderecoCompleto();

        var enderecoCompletoModal = {};

        $.each(parent.objEndereco,function(index,val){
            if(typeof val == undefined || val == null){
                enderecoCompletoModal[index] = '';
            }
            else{
                enderecoCompletoModal[index] = val;
            }
        });

        var infoEndereco =
            "<div align='center'>"+
                "<dt>Rua:</dt><dd><input type='text' class='form-control' id='infoRuaSweetAlert' value='"+enderecoCompletoModal.rua+"'/></dd>"+
                "<dt>N°:</dt><dd><input type='text' class='form-control' id='infoNumeroSweetAlert' value='"+enderecoCompletoModal.numero+"'/></dd>"+
                "<dt>Cep:</dt><dd><input type='text' class='form-control' id='infoCepSweetAlert' value='"+enderecoCompletoModal.cep+"'/></dd>"+
                "<dt>Bairro:</dt><dd><input type='text' class='form-control' id='infoBairroSweetAlert' value='"+enderecoCompletoModal.bairro+"'/></dd>" +
                "<dt>Complemento:</dt><dd><input type='text' class='form-control' id='infoComplementoSweetAlert'/></dd>" +
                "<dt>Cidade:</dt><dd>"+enderecoCompletoModal.cidade+"</dd>" +
            "</div>";

        swal({
            title: 'Confirma o Endereço?',
            html: infoEndereco,
            focusConfirm: false,
            preConfirm: function(){
                return new Promise(function(resolve,reject){
                    parent.objEndereco.rua = $('#infoRuaSweetAlert').val();
                    parent.objEndereco.numero = $('#infoNumeroSweetAlert').val();
                    parent.objEndereco.cep = $('#infoCepSweetAlert').val();
                    parent.objEndereco.bairro = $('#infoBairroSweetAlert').val();

                    var regra = /^[0-9]+$/;

                    // if($('#infoNumeroSweetAlert').val() === "" || !$('#infoNumeroSweetAlert').val().match(regra)){
                    //     reject("Informe um número válido!");
                    //     return false;
                    // }
                    // else{
                        resolve([
                            swal.close(),
                            setDadosTela()
                        ]);
                    // }
                });
            }
        });
    };

    atribuirAcaoArrastarPonto = function(){
        google.maps.event.addListener(this.mapaModal.getMarcador(),'dragend',function(){
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': parent.mapaModal.getMarcador().getPosition()},function(results,status){
                if(status == google.maps.GeocoderStatus.OK) {
                    results[0].address_components[2].types = ['sublocality_level_1'];//quando vem pelo arrastar o tipo political vem primeiro, desta forma colocado em primeiro o sublocality_level_1
                    var endereco = geocoderGoogle(results[0]);
                    endereco.latitude = results[0].geometry.location.lat;
                    endereco.longitude = results[0].geometry.location.lng;
                    acaoAtribuirEndereco(endereco);
                }
            });
        });
    };

    validarNumeroEndereco = function(){
        if(this.objEndereco.numero != null){
            if(!jQuery.isNumeric(this.objEndereco.numero) && this.objEndereco.numero!=null){
                //possivelmente solicita o numero do endereço
            }
        }
        else{
            swal({
                title: 'Atenção!',
                input: 'text',
                text: 'Informe o Número do Endereço:',
                inputPlaceholder: 'Número',
                showCancelButton: true,
                cancelButtonText: "Não Sei!",
                confirmButtonText: "Confirmar!",
                inputValidator: function (value){
                    return new Promise(function(resolve,reject){
                        var regra = /^[0-9]+$/;

                        if(value === false) return false;
                        if(!value.match(regra)){
                            parent.objEndereco.numero = '';
                        }else{
                            parent.objEndereco.numero = value;
                        }
                            swal.close();

                            var endereco = `${parent.objEndereco.rua} - ${value} - ${parent.objEndereco.bairro}`;
                            var resultado = retornaDadosEndereco(endereco);
                            resultado.done(function(dadosEndereco){
                                if(dadosEndereco.status == "OK"){
                                    var coordenadas = dadosEndereco.results[0].geometry.location;
                                    parent.mapaModal.atualizarMarcador(coordenadas);
                                    parent.mapaModal.setZoom(18);
                                    criarEnderecoCompleto();
                                    definirInfoWindow();
                                    $('#inputRuaModal').val(parent.objEnderecoCompleto);
                                    parent.objEndereco.latitude = coordenadas.lat;
                                    parent.objEndereco.longitude = coordenadas.lng;
                                }
                                else{
                                    // swal({
                                    //     title: 'Não foi possível identificar um endereço a partir do número informado!',
                                    //     type: 'error',
                                    //     confirmButtonColor: '#ed5565',
                                    //     confirmButtonText: 'OK'
                                    // });
                                    parent.objEndereco.numero = '';
                                    criarEnderecoCompleto();
                                }
                            });
                        //}
                    });
                }
            });
        }
        atribuirEnderecoFormModal();
    };

    acaoAtribuirEndereco = function(endereco){
        if(endereco.numero !== undefined || endereco.numero !== null){
            this.objEndereco.numero = endereco.numero;
        }
        else{
            this.objEndereco.numero = '';
        }
        this.objEndereco.rua = endereco.rua;
        this.objEndereco.bairro = endereco.bairro;
        this.objEndereco.cidade = endereco.cidade;
        this.objEndereco.latitude = endereco.latitude;
        this.objEndereco.longitude = endereco.longitude;
        this.objEndereco.cep = endereco.cep;
        validarNumeroEndereco();
        criarEnderecoCompleto();
        definirInfoWindow();
        return;
    };

    criarEnderecoCompleto = function(){
        var numero = (this.objEndereco.numero!=null ? ','+this.objEndereco.numero:'');
        var bairro = (this.objEndereco.bairro!=null ? ','+this.objEndereco.bairro:'');
        this.objEnderecoCompleto = this.objEndereco.rua+numero+bairro+' - '+this.objEndereco.cidade;
    };

    definirInfoWindow = function(){
        var conteudoWindow = infoWindow(this.objEnderecoCompleto);
        this.mapaModal.exibeInfoWindow(conteudoWindow);
    };

    atribuirEnderecoFormModal = function(){
        $('#numeroModal').val(this.objEndereco.numero);
        $('#logradouroModal').val(this.objEndereco.rua);
        $('#bairroModal').val(this.objEndereco.bairro);
        $('#cidadeModal').val(this.objEndereco.cidade);
        $('#latitudeModal').val(this.objEndereco.latitude);
        $('#longitudeModal').val(this.objEndereco.longitude);
    };

    limparModalEndereco = function(){
        $('#inputRuaModal').val('');
        $('#inputCepModal').val('');
        $('#numeroModal').val('');
        $('#logradouroModal').val('');
        $('#bairroModal').val('');
        $('#cidadeModal').val('');
        $('#latitudeModal').val('');
        $('#longitudeModal').val('');
    };

    definirInicioModal = function(){
        $('#tabsMapaModal .nav-tabs li').removeClass('active');
        $('#tabsMapaModal .nav-tabs li').first().addClass('active');
        $('#buscaPorRua').addClass('active');
        $('#inputRuaModal').focus();
    };

    acaoAbrirModalEndereco = function(){
        if(parent.objEnderecoCompleto !== null){
            parent.mapaModal.setZoom(16);
        }
        else{
            criarMapaModal();
        }

        limparModalEndereco();
        definirInicioModal();
        acaoBuscaPorRua();
        atribuirAcaoArrastarPonto();
    };

    if(!document.getElementById('modalEnderecoMapa')){
        carregarModalMapaEndereco().done(function(){
            atribuirAcaoAbrirModal();
            acaoAoClicarEmAba();
        });
    }

    carregarFormEndereco().done(function(){
        atribuirAcaoBotaoEditar();
        setDadosTela();
    });

    setDadosTela = function(){
        $('#complemento').val($('#infoComplementoSweetAlert').val());
        $('#cep').val(this.objEndereco.cep);
        $('#numero').val(this.objEndereco.numero);
        $('#logradouro').val(this.objEndereco.rua);
        $('#bairro').val(this.objEndereco.bairro);
        $('#cidade').val(this.objEndereco.cidade);
        $('#latCadastro').val(this.objEndereco.latitude);
        $('#lngCadastro').val(this.objEndereco.longitude);
        $('#cepCadastro').val(this.objEndereco.cep);
        if(!$('#modalEnderecoMapa').is(':visible')) return;
        $('#modalEnderecoMapa').modal('hide');
        $('#'+idDivEndereco).next('input,button').focus();
        this.mapaTela.atualizarMarcador(parent.mapaModal.getCoordenadas());
        this.mapaTela.setZoom(16);
    }
}
