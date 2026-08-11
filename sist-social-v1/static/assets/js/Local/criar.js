$(function(){
    formataChecks($(".i-checks"));

    $('#btnSalvar').click(salvarLocal);

    $('#numero').mask('0000000');

    $('#cep').focusout(function () {
        if(this.value.length == 9 && $('#bairro').val().length > 0 && $('#cidade').val().length > 0){
            $('#bairro').attr('readonly', true);
            $('#cidade').attr('readonly', true);
            $('#logradouro').attr('readonly', true);
            $('#estado').attr('readonly', true);

        }else{
            $('#bairro').attr('readonly', false);
            $('#cidade').attr('readonly', false);
            $('#logradouro').attr('readonly', false);
            $('#estado').attr('readonly', false);
        }
    });

    $('#botaoProximo1').click(function(e){
        e.preventDefault();
        $('#tab2').trigger('click');
    });

    $('#botaoProximo2').click(function(e){
        e.preventDefault();
        $('#tab3').trigger('click');
    });
});

function salvarLocal(e){

    e.preventDefault();

    if(validar()){
        $('.inputCep').unmask();

        var objCampos = $('#formLocal').serializeObject();

        $.ajax({
            url: caminho + 'sist_central/api/Local',
            type: 'POST',
            dataType: 'json',
            data: objCampos
        })
        .done(function(retorno){

            if(retorno){

                swal({
                        title: 'Local cadastrado com sucesso!',
                        text: 'Clique em OK para continuar',
                        type: 'success',
                        confirmButtonColor: "#1ab394",
                        confirmButtonText: "OK",
                    },
                    function(){

                        window.location.href = caminhoBase+'Local';
                    });
            }
        })
        .fail(function(){

            swal({
                title: 'Erro ao tentar cadastrar o registro!',
                text: 'Entre em contato com o suporte.',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#ed5565',
                confirmButtonText: "OK",
                cancelButtonText: '',
                closeOnConfirm: false,
                closeOnCancel: false
            });
        });
    }
};