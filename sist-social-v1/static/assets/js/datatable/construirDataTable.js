function iniciarDataTable(nomeController, nomeTela, colunas, targetInfo, ajaxCustom, customButton = "", retorno = "") {
    var horario = dataFormatada();
    var titulo = campoTitulo();
    // var pdfConfig = titulo.NOME_PREFEITURA.toUpperCase() + "\n\n" + titulo.SUBTITULO_PREFEITURA + "\n" + "Atendimento - " + nomeTela + "\nImpresso por: " + titulo.IMPRESSOPOR;
    var target = 5;
    let dados = "";
    let colunasRelatorio = "";
    

    if (colunas.length >= 7) { //Orientação dinâmica
        var orientation = 'landscape';
    } else {
        orientation = 'portrait'
    }

    colunas.forEach(formataColuna);

    if (customButton == "default") {
        var actionButton = 'criarBotoes(data["id"])';
    } else if (customButton != "" && customButton != "default") {
        var actionButton = customButton;
    }
    var colunaFormatada = eval('[' + dados + '{targets: [' + target + '],width: "10%",orderable: false,mData: data => ' + actionButton + ',responsivePriority: 2}]');

    tabela = $('#datatable' + nomeController).DataTable({

        paging: true,
        dom: 'Blfrtip',
        fixedHeader: true,
        fixedFooter: true,
        lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "Todos"]
        ],
        buttons: [
            {
                text: '<i class="fa fa-file-pdf-o"></i>  PDF',
                action: function(e, dt, button, config) {
                    window.open(caminho + 'sist_social/' + nomeController + '/listarPdf?' + $.param(dt.ajax.params()), '_blank');
                }
            },
            // {
            //     extend: 'csvHtml5',
            //     exportOptions: {
            //         columns: ':visible',
            //     },
            //     text: '<i class=\"glyphicon glyphicon-download-alt\"></i>  CSV',
            //     filename: "Relatorio_" + nomeController + "_" + dataFormatada("data"),
            //     exportOptions: {
            //         columns: targetInfo,
            //     },
            // },
            // {
            //     extend: 'pdfHtml5',
            //     orientation: orientation,
            //     exportOptions: {
            //         columns: targetInfo,
            //     },
            //     text: '<i class=\"glyphicon glyphicon-print\"></i>  PDF',
            //     messageBottom: function() {
            //         return 'message to be displayed at bottom'
            //     },
            //     filename: "Relatorio_" + nomeController + "_" + dataFormatada("data"),
            //     title: ' ',
            //     fontSize: 2,
            //     customize: function(doc) {
            //         doc.pageMargins = [20, 120, 20, 50]; // Margens do doc
            //         doc.defaultStyle.fontSize = 10; //Tamanho da padrão
            //         doc.defaultStyle.alignment = 'center'; //Tamanho da padrão

            //         doc.styles.title = { //Tamanho da fonte do titulo
            //             fontSize: '13',
            //             display: 'none',
            //             alignment: 'center',
            //             margin: 300,
            //         }

            //         var tblBody = doc.content[1].table.body; //CSS título
            //         for (var i = 0; i < tblBody[0].length; i++) {
            //             tblBody[0][i].fillColor = '#a0a0a0';
            //             tblBody[0][i].color = 'black';
            //         }
            //         doc['header'] = (function() {
            //             return {
            //                 columns: [{
            //                         image: titulo.IMAGEM,
            //                         width: 80
            //                     },
            //                     {
            //                         alignment: 'center',
            //                         text: [
            //                             { text: titulo.NOME_PREFEITURA.toUpperCase() + '\n', bold: true, fontSize: 13 },
            //                             { text: titulo.SUBTITULO_PREFEITURA + '\n\n', bold: false, fontSize: 12 },
            //                             { text: nomeTela + '\n', bold: false, fontSize: 12 },
            //                             { text: 'Impresso por: ' + titulo.IMPRESSOPOR, bold: false, fontSize: 12 },
            //                             { text: '\n\nTotal de registro(s): ' + contagem(), bold: false, fontSize: 10 },
            //                         ],
            //                         // fontSize: 13,
            //                         margin: [10, 0]
            //                     }
            //                 ],
            //                 margin: 20
            //             }
            //         });

            //         doc['footer'] = (function(page) {

            //             return [{
            //                 columns: [{
            //                         alignment: 'left',
            //                         fontSize: '9',
            //                         text: ['SistSocial - Sistema de Gestão da Assistência Social'],
            //                     },
            //                     {
            //                         alignment: 'center',
            //                         fontSize: '9',
            //                         text: ['Pg.', { text: page.toString() }]
            //                     },
            //                     {
            //                         alignment: 'right',
            //                         fontSize: '9',
            //                         text: [horario]
            //                     },

            //                 ],
            //                 margin: [30, 20, 30, 30]
            //             }, ]
            //         });

            //         var objLayout = {};
            //         objLayout['hLineWidth'] = function(i) { return .5; };
            //         objLayout['vLineWidth'] = function(i) { return .5; };
            //         objLayout['hLineColor'] = function(i) { return 'black'; };
            //         objLayout['vLineColor'] = function(i) { return 'black'; };
            //         objLayout['paddingLeft'] = function(i) { return 4; };
            //         objLayout['paddingRight'] = function(i) { return 4; };
            //         doc.content[1].layout = objLayout;
            //         var obj = {};
            //         obj['hLineWidth'] = function(i) { return .5; };
            //         obj['hLineColor'] = function(i) { return 'black'; };
            //         doc.content[1].margin = [0, 0, 0, 0];

            //     }
            // }
        ],
        "language": { "url": caminho + 'sist_central/assets/js/plugins/dataTables/idiomas/pt-br.json' },
        'processing': true, //Ativa Indicador de processamento.
        'serverSide': true, //Ativa o modo server-side do DataTables.
        'order': [], //Inicia sem ordem.

        //Carrega dados para o conteudo da tabela via ajax
        'ajax': {
            'url': caminho + 'sist_social/' + nomeController + '/dataTable' + ajaxCustom,
            'type': 'POST',
            'data': function(data) {
                return $.extend({}, data, {
                    filtro
                });
            }
        },

        //Define as propriedades de inicialização das colunas
        "columns": colunaFormatada,

        "preDrawCallback": function(settings) {
            if (verificaCampos()) {
                $('.containerDatatable, .filtros-usados').hide();
            }
        },
        'fnDrawCallback': function(data) {
            if (retorno != "" && retorno != "0") {
                var callbackContent = callback(data);
            }


            $('.btnDeletar').on('click', function() {
                var linhaAtual = $(this).closest('#datatable' + nomeController + ' tbody tr');
                var id = tabela.row(linhaAtual).data()['id'];
                // alert(id);
                deletar(id);
            });
        }
    });



    function formataColuna(item, index) {
        dados = dados + '{ "data": "' + item[0] + '", ' + item[1] + ' },';
        if (item[2] == "colunaRelatorio: true") {
            colunasRelatorio = colunasRelatorio + index + ',';
        }
        return dados;
    }

    function contagem() {
        var text = $('.dataTables_info').text();
        if (text) {
            const myArray = text.split("de");
            text = myArray[2].replace(" registros (Filtrados ", "");
            return text;
        } else {
            return false;
        }
    }

    $.getScript(caminho + "sist_central/assets/js/crud/crudApi.js");
    return tabela;
}


function campoTitulo() {
    var value = $.ajax({
        url: caminho + 'sist_central/Configuracoes/getConfig',
        dataType: 'json',
        crossDomain: true,
        contentType: "application/json",
        async: false,
        /*     success: function(json) {
                console.log(json);                
            } */
    }).responseJSON;
    return value;
}

function dataFormatada(tipo = "", delimiter = "-") {
    // Obtém a data/hora atual
    var data = new Date();

    // Guarda cada pedaço em uma variável
    var dia = data.getDate(); // 1-31
    var dia_sem = data.getDay(); // 0-6 (zero=domingo)
    var mes = data.getMonth(); // 0-11 (zero=janeiro)
    var ano2 = data.getYear(); // 2 dígitos
    var ano4 = data.getFullYear(); // 4 dígitos
    var hora = data.getHours(); // 0-23
    var min = data.getMinutes(); // 0-59
    var mseg = data.getMilliseconds(); // 0-999
    var tz = data.getTimezoneOffset(); // em minutos

    switch (tipo) {
        case "data":
            var result = dia + delimiter + (mes + 1) + delimiter + ano4;
            break;
        case "hora":
            var result = hora + ':' + min;
            break;
        default:
            // Formata a data e a hora (note o mês + 1)
            var str_data = dia + delimiter + (mes + 1) + delimiter + ano4;
            var str_hora = hora + ':' + min;
            var result = str_data + ' às ' + str_hora;
    }

    return result;
}

function verificaCampos() {}

function callback() {}