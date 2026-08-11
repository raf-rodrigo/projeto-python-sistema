$(function(){
    tabela = $('#datatable').DataTable({

        "language": {"url": caminho+'sist_central/assets/js/plugins/dataTables/idiomas/pt-br.json'},
        'processing': true, //Ativa Indicador de processamento.
        'serverSide': true, //Ativa o modo server-side do DataTables.
        'order': [], //Inicia sem ordem.

        //Carrega dados para o conteudo da tabela via ajax
        'ajax': {
            'url': caminho+'sist_social/'+nomeController+'/dataTable',
            'type': 'POST'
        },

        //Define as propriedades de inicialização das colunas
        "columns": [
            { "data": "id"},
            { "data": "descricao" },
            { "data": "artigo_infringido" },
            {
                // Coluna de Status com ícones de Ativo/Inativo
                "data": "status",
                "render": function (data, type, row) {
                    console.log(data)
                    if (data === 'ativo') {
                        return `
                        <span class="btn btn-default btn-sm" onclick="toggleStatus(${row.id})"  title="Desativar" >
                            <i class="fa fa-check-circle" data-toggle="tooltip"style="color:#1ab394"></i>
                        </span>`;
                    } else if (data === 'inativo') {
                        return `
                        <span class="btn btn-default btn-sm" onclick="toggleStatus(${row.id})" title="Ativar">
                            <i class="fa fa-times-circle" data-toggle="tooltip"  style="color:#ED5565"></i>
                        </span>`;
                    }
                    return '';
                }
            },
            {
                targets: [3],
                width: '10%',
                orderable: false,
                mData: data => criarBotoes(data[0])
    }
],

    'fnDrawCallback': function(){

        $('.btnDeletar').on('click', function(){
            let linhaAtual = $(this).closest('#datatable tbody tr');
            let id = tabela.row(linhaAtual).data()['id'];
            deletar(id, null, nomeController, 'Deseja realmente excluir o registro?');
        });
    }
});

    $.getScript(caminho+"sist_central/assets/js/crud/crudApi_v2.js");
});

function toggleStatus(id){
 $.ajax({
    type: "POST",
    url: caminho+"sist_social/AtosInfracionais/toggleStatus",
    data:{id:id},
    dataType: "json",
    success: function (response) {
        if(response.success) {
            swal({
                title: 'Sucesso',
                text: 'Alterado com sucesso!',
                type: "success",
                button: "Ok"
            }, function() {
                // Recarregar a página após clicar em "Ok"
                location.reload();
            });

        } else {
            swal({
                title: 'Informação',
                text: 'Erro ao alterar o status.',
                type: "error",
                button: "Ok"
            }, function() {
              //
            });
        }
    }
 });
}