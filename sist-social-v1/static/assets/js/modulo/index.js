$(document).ready(function(){
    
    $('#url').hide();    
    $('.btnExcluir').click(function(){
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
        var url = $('#url').val();
        $.ajax({
           url: url+'deletar/'+id,
           type: 'json',
           data: {'id':id},
           success:function(data){
               var obj = JSON.parse(data);
               
               if(obj.status === true){
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
               }
               else{
                    swal({ 
                        title: 'Algo deu errado, tente novamente',
                        text: '',
                        confirmButtonColor: '#ed5565',
                        confirmButtonText: 'OK',
                        type: 'error'
                    });                   
               }
           },
           error: function(data){
            swal({ 
                title: 'Oops!',
                text: 'Falha ao deletar módulo, entre em contato com o suporte!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: true
              });                        
           }
        });
    }
    
    $("#tabelaModulo").DataTable({
        "language":{
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar",
        "oPaginate":{
            "sNext": "Próximo",
            "sPrevious": "Anterior",
            "sFirst": "Primeiro",
            "sLast": "Último"
        },
        "oAria":{
            "sSortAscending": ": Ordenar colunas de forma ascendente",
            "sSortDescending": ": Ordenar colunas de forma descendente"
        }
        }
    });
});