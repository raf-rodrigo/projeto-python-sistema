$(function(){

    $('#modal').on('hidden.bs.modal', function(){
        $('#formFiltro')[0].reset();
    });


    $('#btnFiltro').click(function(){

        $.getJSON('filtro', function(retorno){

            $('.modal-title').html(retorno.tituloModal);
            $('.modal-body').html(retorno.corpoModal);
            $('.modal-footer').html(retorno.rodapeModal);

            $('#btnLimpar').click(function(){

                $('#formFiltro')[0].reset();
                tabela.ajax.reload(null,false);
            });

            $('#btnFiltrar').click(function(){

                tabela.ajax.reload(null,false);

                $('#modal').modal('hide');
            });
        });
    });

     tabela = $('#datatable').DataTable({

        "language": {"url": caminho+'sist_central/assets/js/plugins/dataTables/idiomas/pt-br.json'},
        'processing': true, //Ativa Indicador de processamento.
        'serverSide': true, //Ativa o modo server-side do DataTables.
        'order': [], //Inicia sem ordem.

        //Carrega dados para o conteudo da tabela via ajax
        'ajax': {
            'url': caminho+'sist_central/Local/dataTable',
            'type': 'POST',
            'data': function(data){

                data.form = $('#formFiltro').serializeObject();
            }
        },

        //Define as propriedades de inicialização das colunas
        'columnDefs': [
            {aTargets: [0], visible: false},
            {aTargets: [10],visible: false},
            {aTargets: [11],visible: false},
            {
                targets: [12],
                width: '13%',
                orderable: false,
                mData: data => ""
            }
        ],
    "rowCallback": function( row, data, iDisplayIndex ) {
        $(row).find('td').last().html('<div id="botoes'+iDisplayIndex+'">' +
            '<img src="'+caminho+'sist_central/assets/img/loader.gif"></div>');
    },
        'fnDrawCallback': function(){
            criarBotoes(tabela.row().column(0).data());

        }
    });
});

function deletarLocal(id) {

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
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: caminho + 'sist_central/api/Local',
                    type: 'DELETE',
                    dataType: 'JSON',
                    data: {id: id}
                })
                    .done(function (retorno) {
                        if (retorno) {
                            tabela.ajax.reload(null, false);
                            swal({
                                title: retorno.msg,
                                text: retorno.texto,
                                type: retorno.tipo,
                                confirmButtonColor: "#1ab394",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        }
                        else {
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
                    .fail(function () {
                        swal({
                            title: 'Existem cadastros vinculados a este local!',
                            text: 'Remova os vínculos para fazer a exclusão.',
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

function criarBotoes(ids){
    $.ajax({
        type: 'GET',
        dataType:'JSON',
        url: 'Local/botoesAcesso',
    }).done(function(retorno) {
        for(var i = 0; i < ids.length; i++){
            var botoes = '';
            if (retorno.btnEditar) {
                botoes += '<a href="Local/editar/' + ids[i] + '" class="btn btn-default btn-sm">' +
                    '<i class="fa fa-edit" data-toggle="tooltip" title="Editar"></i>' +
                    '</a>';
            }
            if(retorno.btnDeletar){
                botoes += '<button class="btnDeletar btn btn-default btn-sm">' +
                    '<i class="fa fa-trash" data-toggle="tooltip" title="Deletar"></i>' +
                    '</button>';
            }
            $('#botoes' + i).html(botoes);
            $('.btnDeletar').on('click', function(){
                var linhaAtual = $(this).closest('#datatable tbody tr');
                var id = tabela.row(linhaAtual).data()[0];

                deletarLocal(id);
            });
        }
    });
}