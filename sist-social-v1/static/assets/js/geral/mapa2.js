function Mapa(id){
    this.divMapa = document.getElementById(id);
    this.marcador = {};
    this.mapa = {};
    this.infoWindow = {};
}

Mapa.prototype.inicializa = function(configInicio){
    return this.mapa = new google.maps.Map(this.divMapa,configInicio);
};

Mapa.prototype.setMarcador = function(configMarcador){
    return this.marcador = new google.maps.Marker(configMarcador);
};

Mapa.prototype.atualizarMarcador = function(coordenadas){
    this.marcador.setPosition(coordenadas);
    this.mapa.setCenter(coordenadas);
};

Mapa.prototype.getMapa = function(){
    return this.mapa;
};

Mapa.prototype.getMarcador = function(){
    return this.marcador;
};

Mapa.prototype.setZoom = function(zoom){
    return this.mapa.setZoom(zoom);
};

Mapa.prototype.getCoordenadas = function(){
    return {lat:this.marcador.getPosition().lat(),lng:this.marcador.getPosition().lng()}
};

Mapa.prototype.exibeInfoWindow = function(conteudoWindow){
    if(Object.keys(this.infoWindow).length >0){
        this.infoWindow.close();
    }
    this.infoWindow = new google.maps.InfoWindow({
        content:conteudoWindow,
        maxWidth: 440
    });
    this.infoWindow.open(this.mapa,this.marcador);
};