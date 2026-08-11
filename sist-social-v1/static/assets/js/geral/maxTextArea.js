function maxTextArea(id, limite){
    var textArea = $('#'+id);
    var span = $('#'+id+'Span');

    if (textArea.length === 0) {
        console.warn('maxTextArea: elemento #' + id + ' não encontrado.');
        return;
    }

    textArea.focusin(function(){
        if($(this).val() && $(this).val().length === 0){
            span.html('Máximo de <b>'+ limite + '</b> caracteres');
        }
        $(this).attr('maxlength',limite);
    });

    var valor = textArea.val() || "";
    var tamanhoAtual = valor.length;
    var calculo = limite - tamanhoAtual;

    if(calculo <= 0){
        span.html('Limite de caracteres atingido!');
    } else {
        span.html('<b>'+ calculo + '</b> Caracteres restantes');
    }

    textArea.keyup(function(){
        var caracteresDigitados = ($(this).val() || "").length;
        var caracteresRestantes = limite - caracteresDigitados;

        if(caracteresRestantes <= 0){
            span.html('Limite de caracteres atingido!');
        } else {
            span.html('<b>'+ caracteresRestantes + '</b> Caracteres restantes');
        }
    });
}
