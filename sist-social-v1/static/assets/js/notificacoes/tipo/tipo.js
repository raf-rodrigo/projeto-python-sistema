$(document).ready(function(){

    formataTableParaDataTable('#tabelaNotificacaoTipo');

    $('.btnDeletar').on('click',function(){
        var id = $(this).attr('data-id');
        swal({
                title: "Deseja realmente deletar o registro?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#ed5565',
                confirmButtonText: 'Sim, deletar registro!',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false },
            function(){
                deletar(id);
            });
    });

    function deletar(id){
        $.ajax({
            url: 'notificacaoTipo/deletar/'+id,
            type: 'post',
            dataType: 'json',
            success:function(retorno){
                if(retorno.status){
                    swal({
                            title: 'Registro deletado com sucesso!',
                            text: '',
                            confirmButtonColor: '#1ab394',
                            confirmButtonText: 'OK',
                            type: 'success'},
                        function(isConfirm){
                            if(isConfirm){
                                window.location.href = '';
                            }
                        }
                    );
                }else{
                    swal({
                        title: 'Não foi possível deletar o registro!',
                        text: '',
                        confirmButtonColor: '#ed5565',
                        confirmButtonText: 'OK',
                        type: 'error'
                    });
                }
            },
            error:function(){
                swal({
                    title: 'Não foi possível deletar o registro, entre em contato com o suporte!',
                    text: '',
                    confirmButtonColor: '#ed5565',
                    confirmButtonText: 'OK',
                    type: 'error'
                });
            }
        });
    }
});

