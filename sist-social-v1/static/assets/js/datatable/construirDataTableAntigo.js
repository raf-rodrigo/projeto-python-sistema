function iniciarDataTable(nomeController, nomeTela, colunas, targetInfo, ajaxCustom, customButton = "", retorno = "") {
    var horario = dataFormatada();
    var titulo = campoTitulo();
    // var pdfConfig = titulo.NOME_PREFEITURA.toUpperCase() + "\n\n" + titulo.SUBTITULO_PREFEITURA + "\n" + "Atendimento - " + nomeTela + "\nImpresso por: " + titulo.IMPRESSOPOR;
    /*  var target = colunas.length; */
    var target = 5;
    let dados = "";
    let colunasRelatorio = "";
    if (colunas.length >= 7) { //Orientação dinâmica
        var orientation = 'landscape';
    } else {
        orientation = 'portrait'
    }

    /*  EXEMPLO DE VARIÁVEL COM COLUNAS DA TABLE
        var colunaFormatada = eval('[{ "data": "id", visible:false },{ "data": "nom_pessoa", width: "22%"},{ "data": "anot_contra_refer"},{ "data": "data_anot"},{ "data": "nome" },{targets: [5],width: "10%",orderable: false,mData: data => criarBotoes(data["id"]),responsivePriority: 2}]'); 
    */

    colunas.forEach(formataColuna);

    if (customButton == "default") {
        var actionButton = 'criarBotoes(data["id"])';
    }
    if (customButton != "" && customButton != "default") {
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
        buttons: [{
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':visible',
                },
                text: '<i class=\"glyphicon glyphicon-download-alt\"></i>  Excel',
                filename: "Relatorio_" + nomeController + "_" + dataFormatada("data"),
                exportOptions: {
                    columns: targetInfo,
                },
            },
            {
                extend: 'csvHtml5',
                exportOptions: {
                    columns: ':visible',
                },
                text: '<i class=\"glyphicon glyphicon-download-alt\"></i>  CSV',
                filename: "Relatorio_" + nomeController + "_" + dataFormatada("data"),
                exportOptions: {
                    columns: targetInfo,
                },
            },
            {
                extend: 'pdfHtml5',
                orientation: orientation,
                exportOptions: {
                    columns: targetInfo,
                },
                text: '<i class=\"glyphicon glyphicon-print\"></i>  PDF',
                messageBottom: function() {
                    return 'message to be displayed at bottom'
                },
                filename: "Relatorio_" + nomeController + "_" + dataFormatada("data"),
                title: ' ',
                fontSize: 2,
                customize: function(doc) {
                    doc.pageMargins = [20, 120, 20, 50]; // Margens do doc
                    doc.defaultStyle.fontSize = 10; //Tamanho da padrão
                    doc.defaultStyle.alignment = 'center'; //Tamanho da padrão

                    doc.styles.title = { //Tamanho da fonte do titulo
                        fontSize: '13',
                        display: 'none',
                        alignment: 'center',
                        margin: 300,
                    }

                    var tblBody = doc.content[1].table.body; //CSS título
                    for (var i = 0; i < tblBody[0].length; i++) {
                        tblBody[0][i].fillColor = '#a0a0a0';
                        tblBody[0][i].color = 'black';
                    }
                    doc['header'] = (function() {
                        return {
                            columns: [{
                                    image: titulo.IMAGEM,
                                    width: 80
                                },
                                {
                                    alignment: 'center',
                                    text: [
                                        { text: titulo.NOME_PREFEITURA.toUpperCase() + '\n', bold: true, fontSize: 13 },
                                        { text: titulo.SUBTITULO_PREFEITURA + '\n\n', bold: false, fontSize: 12 },
                                        { text: nomeTela + '\n', bold: false, fontSize: 12 },
                                        { text: 'Impresso por: ' + titulo.IMPRESSOPOR, bold: false, fontSize: 12 },
                                        { text: '\n\nTotal de registro(s): ' + contagem(), bold: false, fontSize: 10 },
                                    ],
                                    // fontSize: 13,
                                    margin: [10, 0]
                                }
                            ],
                            margin: 20
                        }
                    });

                    doc['footer'] = (function(page) {

                        return [

                            {

                                columns: [{
                                        alignment: 'left',
                                        fontSize: '9',
                                        text: ['SistSocial - Sistema de Gestão da Assistência Social'],
                                    },
                                    {
                                        alignment: 'center',
                                        fontSize: '9',
                                        text: ['Pg.', { text: page.toString() }]
                                    },
                                    {
                                        alignment: 'right',
                                        fontSize: '9',
                                        text: [horario]
                                    },

                                ],
                                margin: [30, 20, 30, 30]
                            },
                        ]
                    });

                    var objLayout = {};
                    objLayout['hLineWidth'] = function(i) { return .5; };
                    objLayout['vLineWidth'] = function(i) { return .5; };
                    objLayout['hLineColor'] = function(i) { return 'black'; };
                    objLayout['vLineColor'] = function(i) { return 'black'; };
                    objLayout['paddingLeft'] = function(i) { return 4; };
                    objLayout['paddingRight'] = function(i) { return 4; };
                    doc.content[1].layout = objLayout;
                    var obj = {};
                    obj['hLineWidth'] = function(i) { return .5; };
                    obj['hLineColor'] = function(i) { return 'black'; };
                    doc.content[1].margin = [0, 0, 0, 0];

                    // doc.content.splice(1, 0, {
                    //     margin: [15, -85, 0, 24],
                    //     alignment: 'left',
                    //     width: 80,
                    //     height: 80,
                    //     image: titulo.IMAGEM,
                    // }, {
                    //     alignment: 'center',
                    //     fontSize: '10',
                    //     text: ['Total de registro(s): ', contagem()],
                    //     margin: [10, 10, 10, 10],
                    // });
                }
            }
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

        /*Formato manual antigo         
        "columns": [
            { "data": "id", visible:false },
            { "data": "nom_pessoa", width: '22%'},
            { "data": "anot_contra_refer"},
            { "data": "data_anot"},
            { "data": "nome" },
            {
                targets: [5],
                width: '10%',
                orderable: false,
                mData: data => criarBotoes(data['id']),
                responsivePriority: 2
            }
        ],
        */
        "preDrawCallback": function(settings) {
            if (verificaCampos()) {
                $('.containerDatatable, .filtros-usados').hide();
            }
        },
        'fnDrawCallback': function() {
            if (retorno != "") {
                var callbackContent = callback();
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

    // Mostra o resultado
    return result;
}


//CÓDIGO MANUAL PARA CONSULTA
/*     var horario = dataFormatada();
    var titulo = campoTitulo();
    var pdfConfig = titulo.NOME_PREFEITURA + "\n" + titulo.SUBTITULO_PREFEITURA + "\n" + nomeTela + "\nImpresso por: " + titulo.IMPRESSOPOR;

    tabelaFiltro = tabela = $('#datatable' + nomeController).DataTable({
        paging: true,
        dom: 'Bfrtip',
        buttons: [

            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':visible',
                    className: "addNewRecord",
                },
                text: '<i class=\"glyphicon glyphicon-download-alt\"></i> Baixar CSV',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6],
                },
                text: '<i class=\"glyphicon glyphicon-print\"></i> Imprimir',
                messageBottom: function() {
                    return 'message to be displayed at bottom'
                },
                filename: 'consultaAtendimento',
                title: pdfConfig,

                customize: function(doc) {

                    doc.styles.title = {
                        fontSize: '13',
                        alignment: 'center',
                        margin: 300,
                    }
                    var tblBody = doc.content[1].table.body;
                    for (var i = 0; i < tblBody[0].length; i++) {
                        tblBody[0][i].fillColor = '#a0a0a0';
                        tblBody[0][i].color = 'black';
                    }

                    doc['footer'] = (function(page, pages) {
                        return [
                            { canvas: [{ type: 'line', x1: 30, y1: 15, x2: 595 - 30, y2: 15, lineWidth: 1, color: 'black' }] },
                            {

                                columns: [

                                    {
                                        alignment: 'left',
                                        fontSize: '7',
                                        text: ['SistSocial - Sistema de Gestão da Assistência Social'],
                                    },
                                    {
                                        alignment: 'center',
                                        fontSize: '7',
                                        text: ['Página ', { text: page.toString() }]
                                    },
                                    {
                                        alignment: 'right',
                                        fontSize: '7',
                                        text: ['Gerado em: ', horario]
                                    },

                                ],
                                margin: [30, 15, 30, 35]
                            },
                        ]
                    });

                    var objLayout = {};
                    objLayout['hLineWidth'] = function(i) { return .5; };
                    objLayout['vLineWidth'] = function(i) { return .5; };
                    objLayout['hLineColor'] = function(i) { return 'black'; };
                    objLayout['vLineColor'] = function(i) { return 'black'; };
                    objLayout['paddingLeft'] = function(i) { return 4; };
                    objLayout['paddingRight'] = function(i) { return 4; };
                    doc.content[1].layout = objLayout;
                    var obj = {};
                    obj['hLineWidth'] = function(i) { return .5; };
                    obj['hLineColor'] = function(i) { return 'black'; };
                    doc.content[1].margin = [0, 0, 0, 0];

                    doc.content.splice(1, 0, {
                        margin: [15, -85, 0, 24],
                        alignment: 'left',
                        width: 80,
                        height: 80,
                        image: titulo.IMAGEM,
                    });


                }
            }
        ],
        "language": { "url": caminho + 'sist_central/assets/js/plugins/dataTables/idiomas/pt-br.json' },
        'processing': true, //Ativa Indicador de processamento.
        'serverSide': true, //Ativa o modo server-side do DataTables.
        'order': [], //Inicia sem ordem.

        //Carrega dados para o conteudo da tabela via ajax
        'ajax': {
            'url': caminho + 'sist_social/' + nomeController + '/dataTableAtend',
            'type': 'POST',
            'data': function(data) {
                return $.extend({}, data, {
                    filtro
                });
            }
        },

        responsive: true,

        //Define as propriedades de inicialização das colunas
        "columns": [
            { "data": "id", visible: false },
            { "data": "nome_conhecido", width: "15%" },
            { "data": "nom_pessoa", width: '25%' },
            { "data": "data_atend" },
            { "data": "descr_atend" },
            { "data": "status" },
            { "data": "modalidade" },
            {
                targets: [6],
                width: '10%',
                orderable: false,
                mData: data => criarBotoesAtendimento(data),
                responsivePriority: 2
            }
        ],

        "preDrawCallback": function(settings) {
            if (verificaCampos()) {
                $('.containerDatatable, .filtros-usados').hide();
            }
        },

        'fnDrawCallback': function() {
            if (tabela.rows().data().length == 0) {
                var buttons = 'Aconselha-se rever critérios de Pesquisa<br>Antes de Prosseguir<br>' +
                    '<button style="width: 270px; background: #1AB394" class="botaoSweet" id="cadastroFam">Cadastrar Novo Grupo Familiar</button><br>' +
                    '<button style="width: 270px; background: #1C84C6" class="botaoSweet" id="incluiFam">Incluir em Grupo Familiar Existente</button><br>' +
                    '<button style="width: 270px; background: #C4170C" class="botaoSweet">Cancelar Operação</button>';

                swal({
                    title: "Pessoa não Encontrada.<br>Deseja cadastrá-la?",
                    text: buttons,
                    html: true,
                    type: "warning",
                    closeOnConfirm: false,
                    showConfirmButton: false,
                    showCancelButton: false
                });

                $('#cadastroFam').click(function() {
                    // window.open(caminhoBase+"FamiliaDomicilio/criar/");
                    window.location = caminhoBase + "FamiliaDomicilio/criar";
                });
            }

            criarBotoesAtendimento(tabela.row().column(0).data());

            $('.btnDeletar').on('click', function() {
                var linhaAtual = $(this).closest('#datatable' + nomeController + ' tbody tr');
                var id = tabela.row(linhaAtual).data()['id'];
                deletar(id);
            });
        }
    });

    $.getScript(caminho + "sist_central/assets/js/crud/crudApi.js"); */