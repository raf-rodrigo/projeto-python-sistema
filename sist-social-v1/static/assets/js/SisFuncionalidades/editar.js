$(function(){
    $.getScript(caminho+"sist_central/assets/js/crud/crudApi.js");
 
    $.when(comboModulo())
        .done(function(modulo){
            adicionaSelected(modulo, moduloSelect);
        });
});