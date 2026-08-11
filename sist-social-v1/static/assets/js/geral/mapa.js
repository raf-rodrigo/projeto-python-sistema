var infoWindowAnterior = false;
var controleDivLegenda;

function Mapa(id){
    this.divMapa = document.getElementById(id);
    this.divMapa.classList.add("map");
    this.marcadores = [];
    this.mapa = {};
    this.caminhoMarcadores = {
        imagePath: '../assets/img/googlemaps/m'
    };
}

Mapa.prototype.inicializa = function(configInicio){
    this.mapa = new google.maps.Map(this.divMapa,configInicio);
    this.limparTudo();
};

Mapa.prototype.criarInputBusca = function() {
    var input = document.createElement('input');
    input.setAttribute('id', 'pac-input');
    input.setAttribute('class', 'controls');
    input.setAttribute('placeholder', 'Buscar endereço...');
    return input;
};

Mapa.prototype.setBoxPesquisa = function(criarMarcador, criarCluster, limparPontos) {
    var input = this.criarInputBusca();
    var map = this;

    this.mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(input);
    this.getMapa().addListener('bounds_changed', function() {
        searchBox.setBounds(this.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        if (infoWindowAnterior) {
            infoWindowAnterior.close();
        }

        if(limparPontos) {
            map.limparTudo();
        }

        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        var bounds = new google.maps.LatLngBounds();

        places.forEach(function(place) {
            if (!place.geometry) {
                return;
            }

            if (criarMarcador) {
                var configMarcador = [
                    {location: place.geometry.location}
                ];
                map.setMarcador(configMarcador);
            }

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        if (criarCluster) {
            map.getZoom();
            map.agruparMarcadores(map.getMapa(), map.getMarcadores());
        }
        map.limitarArea(bounds);
    });
}

Mapa.prototype.setBoxPesquisaGeoCode = function(fncRetorno) {
    var input = this.criarInputBusca();
    var map   = this;
    
    this.mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(input);
    this.getMapa().addListener('bounds_changed', function() {
        searchBox.setBounds(this.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        
        if (infoWindowAnterior) {
            infoWindowAnterior.close();
        }

        map.limparTudo();

        var places = searchBox.getPlaces();
        
        if (places.length == 0) {
            
            return;
        }

        var address = input.value;
     
        map.GeoCode(address).done(function(obj){
            fncRetorno.call(this,obj);
        });
    }); 
};

Mapa.prototype.GeoCode = function(address) {
    
   var map      = this;   
   var geocoder = new google.maps.Geocoder();
   
    return $.Deferred(function(dfrd) {
        geocoder.geocode({'address': address}, function(results, status) {
            if(status === google.maps.GeocoderStatus.OK) {               
                var obj = {status:true,lat:results[0].geometry.location.lat(),lng: results[0].geometry.location.lng()};
                dfrd.resolve(obj);
            }
            else {
                var obj = {status:false,msg:(new Error(status))};
                dfrd.reject(obj);
            }
        });
    }).promise();
};

Mapa.prototype.setLegenda = function(icones) {

    this.criarDivLegenda();

    for (i=0; i<icones.length; i++) {
        var nome = icones[i].nome;
        var icone = icones[i].icone;
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + icone + '"> ' + nome;
        this.legenda.appendChild(div);
    }

    this.mapa.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controleDivLegenda);
};

Mapa.prototype.criarDivLegenda = function() {

    controleDivLegenda = document.createElement('div');
    controleDivLegenda.setAttribute('id','legend');

    var btnLegenda = document.createElement('div');
    btnLegenda.id = 'btnLegenda';
    btnLegenda.title = 'Clique para exibir/ocultar a legenda';

    var btnLegendaText = document.createElement('div');
    btnLegendaText.id = 'btnLegendaText';
    btnLegendaText.innerHTML = '<b style="color:#676A6C">Legenda</b>';
    btnLegenda.appendChild(btnLegendaText);

    var btnExibir = document.createElement('div');
    btnExibir.id = 'btnExibir';
    btnExibir.innerHTML = '-';
    btnLegenda.appendChild(btnExibir);

    btnExibir.addEventListener('click', function() {
        var caixaLegenda = document.getElementById("caixaLegenda");
        if (this.textContent == '-') {
            caixaLegenda.classList.add("invisivel");
            btnExibir.innerHTML = '+';
        } else {
            caixaLegenda.classList.remove("invisivel");
            btnExibir.innerHTML = '-';
        }
    });

    this.legenda = document.createElement('div');
    this.legenda.id = 'caixaLegenda';
    this.legenda.classList.add("quebra");

    controleDivLegenda.appendChild(btnLegenda);
    controleDivLegenda.appendChild(this.legenda);

    return controleDivLegenda;
};

Mapa.prototype.limitarArea = function(place) {
    this.mapa.fitBounds(place);
};

Mapa.prototype.setMarcador = function(configMarcador, icone){
    for (i=0; i<configMarcador.length; i++) {
        var marcador = new google.maps.Marker({
            position: configMarcador[i].location
        });
        marcador.setMap(this.mapa);

        if (typeof icone !== 'undefined') {
            marcador.setIcon(icone);
        }

        if (typeof configMarcador[i].conteudo !== 'undefined') {
            var fncAbrirInfoWindow = (configMarcador[i].fncAbrir === undefined) ? null : configMarcador[i].fncAbrir;
           this.exibeInfoWindow(configMarcador[i].conteudo, marcador,fncAbrirInfoWindow);
        }

        this.setMarcadores(marcador);	
    }
};

Mapa.prototype.limparMapa = function() {
    this.marcadores.forEach(function(marcador) {
        marcador.setMap(null);
    });
    this.marcadores = [];
};

Mapa.prototype.setCaminhoMarcadores = function(caminho) {
    this.caminhoMarcadores = {
        imagePath: caminho
    };
};

Mapa.prototype.agruparMarcadores = function(mapa, marcadores) {
    
    this.marcadoresAgrupados = new MarkerClusterer(mapa, marcadores, this.caminhoMarcadores);
};

Mapa.prototype.limparMakerCluster = function() {
    if (typeof this.marcadoresAgrupados !== 'undefined') {
        this.marcadoresAgrupados.clearMarkers();
    }
};

Mapa.prototype.limparTudo = function() {
    this.limparMapa();
    this.limparMakerCluster();
};

Mapa.prototype.setMarcadores = function(marcador) {
    var marcadores = this.marcadores;	
    marcadores.push(marcador);
    this.marcadores = marcadores;
};

Mapa.prototype.setCentroMarcadores = function(objCoordenadas) {
    var bounds = new google.maps.LatLngBounds();

    for (i=0; i<objCoordenadas.length; i++) {
        bounds.extend(objCoordenadas[i].location);
    }
    this.limitarArea(bounds);
};

Mapa.prototype.setCentro = function(objCoordenadas) {
    this.mapa.setCenter(objCoordenadas);
}

Mapa.prototype.getMapa = function(){
    return this.mapa;
};

Mapa.prototype.getMarcadores = function(){
    return this.marcadores;
};

Mapa.prototype.setZoom = function(zoom){
    this.mapa.setZoom(zoom);
};

Mapa.prototype.getZoom = function(){
    return this.mapa.getZoom();
};

Mapa.prototype.getCoordenadas = function(marcador){
    return {lat:marcador.getPosition().lat(),lng:marcador.getPosition().lng()}
};


Mapa.prototype.exibeInfoWindow = function(conteudoWindow, marcador,fncAbrirInfoWindow){
    this.infoWindow = new google.maps.InfoWindow({
        content:conteudoWindow,
        maxWidth:440
    });

    var infoWindow = this.infoWindow;

    marcador.addListener('click', function(){
        if (infoWindowAnterior) {
            infoWindowAnterior.close();
        };

        infoWindow.open(this.mapa, marcador);
            if(fncAbrirInfoWindow !== null){
                fncAbrirInfoWindow.call();
            }

        infoWindowAnterior = infoWindow;
    });
};

Mapa.prototype.criarDivLegenda = function() {

    controleDivLegenda = document.createElement('div');
    controleDivLegenda.setAttribute('id','legend');

    var btnLegenda = document.createElement('div');
    btnLegenda.id = 'btnLegenda';
    btnLegenda.title = 'Clique para exibir/ocultar a legenda';

    var btnLegendaText = document.createElement('div');
    btnLegendaText.id = 'btnLegendaText';
    btnLegendaText.innerHTML = '<b style="color:#676A6C">Legenda</b>';
    btnLegenda.appendChild(btnLegendaText);

    var btnExibir = document.createElement('div');
    btnExibir.id = 'btnExibir';
    btnExibir.innerHTML = '-';
    btnLegenda.appendChild(btnExibir);

    btnExibir.addEventListener('click', function() {
        var caixaLegenda = document.getElementById("caixaLegenda");
        if (this.textContent == '-') {
            caixaLegenda.classList.add("invisivel");
            btnExibir.innerHTML = '+';
        } else {
            caixaLegenda.classList.remove("invisivel");
            btnExibir.innerHTML = '-';
        }
    });
    
    this.legenda = document.createElement('div');
    this.legenda.id = 'caixaLegenda';
    this.legenda.classList.add("quebra");

    controleDivLegenda.appendChild(btnLegenda);
    controleDivLegenda.appendChild(this.legenda);

    return controleDivLegenda;
};

Mapa.prototype.setLegenda = function(icones) {
    
    this.criarDivLegenda();

    for (i=0; i<icones.length; i++) {
        var nome = icones[i].nome;
        var icone = icones[i].icone;
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + icone + '"> ' + nome;
        this.legenda.appendChild(div);
    }
    
    this.mapa.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controleDivLegenda);

};
