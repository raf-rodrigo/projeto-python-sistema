$(function(){
    tabela = $('#datatable').DataTable({
 
        "language": {"url": caminho+'sist_central/assets/js/plugins/dataTables/idiomas/pt-br.json'},
        'processing': true, //Ativa Indicador de processamento.
        'serverSide': true, //Ativa o modo server-side do DataTables.
        'order': [], //Inicia sem ordem.
 
        //Carrega dados para o conteudo da tabela via ajax
        'ajax': {
            'url': caminho+'sist_central/'+nomeController+'/dataTable',
            'type': 'POST'
        },
 
        //Define as propriedades de inicialização das colunas
        'columnDefs': [
            {aTargets: [0], visible: false},
            {aTargets: [2], visible: false},
            {
                targets: [3],
                width: '10%',
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

    function criarBotoes(ids){
        $.ajax({
            type: 'GET',
            dataType:'JSON',
            url: 'TipoLocal/botoesAcesso',
        }).done(function(retorno) {
            for(var i = 0; i < ids.length; i++){
                var botoes = '';
                if (retorno.btnEditar) {
                    botoes += '<a href="TipoLocal/editar/' + ids[i] + '" class="btn btn-default btn-sm">' +
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

                    deletarTipoLocal(id);
                });
            }
        });
    }

    function deletarTipoLocal(id)
    {
        metodo = 'DELETE';
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
            function(isConfirm)
            {
                if (isConfirm) {
                    var promiseDeletar = $.ajax({
                        url: caminhoApi,
                        type: metodo,
                        dataType: 'json',
                        data: {id: id}
                    });

                    if (tipoAmbiente == 'modal') {
                        promiseDeletar
                            .done(function(retorno)
                            {
                                //lógica sucesso
                            })
                            .fail(function(xhr)
                            {
                                //lógica erro
                            });
                    } else {
                        promiseDeletar
                            .done(function(retorno)
                            {
                                if (retorno.httpCode == 200) {
                                    if (typeof botao !== 'undefined') {
                                        swal(retorno.sweet,function()
                                        {
                                            funcValidaRedirecionamento(retorno, botao);
                                        });
                                    } else {
                                        tabela.ajax.reload(null, false);
                                        swal(retorno.sweet);
                                    }
                                } else {
                                    swal(retorno.sweet);
                                }
                            })
                            .fail(function(retorno)
                            {
                                swal(retorno.sweet);
                            });
                    }
                } else {
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
    
});