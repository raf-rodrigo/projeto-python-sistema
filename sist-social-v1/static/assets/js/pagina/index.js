$(document).ready(function(){
    
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
        $.ajax({
           url: 'pagina/deletar/'+id,
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
    
    $("#tabelaPagina").DataTable({
        "order": [[ 0, "desc" ]],
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
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        }
    });
});