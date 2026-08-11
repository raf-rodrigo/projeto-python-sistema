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
        "columns": [
            { "data": "id", visible:false },
            { "data": "modulo", responsivePriority: 1  },
            { "data": "chave" },
            { "data": "valor" },
            {
                targets: [4],
                width: '10%',
                orderable: false,
                mData: data => criarBotoes(data[0]),
                responsivePriority: 2
            }
        ],
 
        'fnDrawCallback': function(){
 
            $('.btnDeletar').on('click', function(){
 
                let linhaAtual = $(this).closest('#datatable tbody tr');
                let id = tabela.row(linhaAtual).data()['id'];
                deletar(id);
            });
        }
    });
 
    $.getScript(caminho+"sist_central/assets/js/crud/crudApi.js");
 
});