$(function(){

    $('.contagemTextArea').each(function(){

        var idTextArea  = $(this).find('textarea').attr('id');
        var limitTexto  = $('#'+idTextArea).attr('maxlength');
        var objSpan     = $(this).find('span').last();
        objSpan.text('Máximo de '+limitTexto+' caracteres');

        $('#'+idTextArea).on('input', function(){

            var caracteresDigitados = $(this).val().length;
            var caracteresRestantes = limitTexto - caracteresDigitados;

            if(caracteresRestantes <= 0){

                objSpan.html('Limite de caracteres atingido!');
            }
            else{

                objSpan.html('<b>'+caracteresRestantes+'</b> Caracteres restantes');
            }
        });
    });
});

function resetaContagem() {
    $('.contagemTextArea').each(function(){
        var idTextArea  = $(this).find('textarea').attr('id');
        var objSpan     = $(this).find('span').last();
        objSpan.html('<b>'+$('#'+idTextArea).attr('maxlength')+'</b> Caracteres restantes');
    });
}
