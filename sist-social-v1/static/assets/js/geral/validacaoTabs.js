function validarTabsForm(nomeForm){
    resetaErrosForm(nomeForm);
    var res = true;
    let radioValid = $('#'+nomeForm+' .radioValid');
    radioValid.each(function(){
        let radios = $(this).find('.radio:checked');
        if(!radios.length){
            let idTabPane = $(this).closest('.tab-pane').attr('id');
            $('.nav-tabs').find('a[href=#'+idTabPane+']').find('.spanErro').addClass('label label-danger pull-right').text('!');
            $('#errorTabs'+nomeForm).addClass('alert alert-warning').html('<strong>Erro</strong> ao salvar alterações, verifique as abas com o ícone <span class="label label-danger">!</span>');
            $(this).find('.msgErro').html('<p class="text-danger"><strong>Este campo é obrigatório</strong></p>');
            res = false;
        }
    });

    return res;
}

function resetaErrosForm(nomeForm){
    $('#'+nomeForm).parent().find('.spanErro').removeClass('label label-danger pull-right').text('');
    $('#'+nomeForm+' .radioValid').find('.msgErro').html('');
    $('#errorTabs'+nomeForm).removeClass('alert alert-warning').html('');
}