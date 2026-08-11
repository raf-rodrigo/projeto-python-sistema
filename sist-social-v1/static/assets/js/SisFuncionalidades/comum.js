var moduloSelect = $('#modulo');
 
function comboModulo() {
    return $.ajax({
        type: 'GET',
        url: caminho + 'sist_central/api/Modulo/comboSelected',
        data: {id: modulo, valor: 'nome'}
    });
}
 
$(function(){
 
    moduloSelect.select2({
        placeholder: 'Selecione um módulo',
        ajax: {
            url: caminho + 'sist_central/Modulo/comboModulo',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }
 
                return queryParameters;
            },
        }
    });
});