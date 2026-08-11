$(function(){
    formataChecks($(".i-checks"));
    $('#btnDeletarLocal').click(deletarLocal);
    $('#btnSalvar').click(salvarLocal);
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

        var objCampos = $('#formulario').serializeObject();
        objCampos.id = cod;

        $.ajax({
            url: caminho+'sist_central/api/Local',
            type: 'PUT',
            dataType: 'json',
            data: objCampos
        })
        .done(function(retorno){

            if (retorno){

                swal({
                    title: 'Registro alterado com sucesso!',
                    text: 'Clique em OK para continuar',
                    type: 'success',
                    confirmButtonColor: "#1ab394",
                    confirmButtonText: "OK",
                }, function () {
                    window.location.href = caminhoBase+'Local';
                });
            }
        })
        .fail(function(){

            swal({
                title: 'Erro ao tentar alterar o registro!',
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

        $('.inputCep').mask('00000-000');
    }
}

function deletarLocal(){

    swal({
            title: 'Deseja realmente deletar o registro?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#5cb85c",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Não, cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){

            if(isConfirm){

                $.ajax({
                    url: caminho+'sist_central/api/Local',
                    type: 'DELETE',
                    dataType: 'JSON',
                    data:{id: cod}
                })
                    .done(function(retorno){

                        if(retorno){

                            swal({
                                title: retorno.msg,
                                text: retorno.texto,
                                type: retorno.tipo,
                                confirmButtonColor: "#1ab394",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            },
                            function(){

                                window.location.href = caminhoBase+'Local';
                            });
                        }
                        else{

                            swal({
                                title: retorno.msg,
                                text: retorno.texto,
                                type: retorno.tipo,
                                confirmButtonColor: "#ed5565",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        }
                    })
                    .fail(function(){

                        swal({
                            title: 'Erro ao tentar deletar o registro!',
                            text: 'Entre em contato com o suporte.',
                            type: 'error',
                            confirmButtonColor: "#ed5565",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });
                    });
            }
            else{

                swal({
                    title: 'Operação cancelada',
                    text: '',
                    type: 'error',
                    confirmButtonColor: "#ed5565",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                });
            }
        });
}