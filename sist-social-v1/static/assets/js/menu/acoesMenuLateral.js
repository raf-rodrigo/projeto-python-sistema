var ordemMenu ;
$(function(){
    ordemMenu = carregaItemMenu();
    var idCategoria = null;

    iniciaMenuNestable();
    acoesMenuTela();
    filtrarMenuLateral();
    //montaTablePaginas();
    filtrarPaginasPorModulo();

    $(".dd-collapse").click(function(){
        $('#divTable').hide();
        $('#divMsgInit').show();
        $('#divMsgItemMenu').hide();
    });
    $('.navbar-minimalize').click();
});

function iniciaMenuNestable(){
    $('.dd').nestable({
        maxDepth:2,
        beforeDragStop: function(l,e,p){
            if($(e).hasClass('liItemMenu')){
                return ($(p).hasClass('pagina'))?false:true;
            }
            return ($(p).hasClass('main'))?false:true;
        }
    }).on('change',function(){
        var novaOrdem = carregaItemMenu();
        var jsonNovaOrdem = jsonEqual(ordemMenu,novaOrdem);
        salvarMudancaMenu(jsonNovaOrdem);
        ordemMenu = novaOrdem;
    }).nestable('collapseAll');
}

function carregaItemMenu(){
    var order = [];

    var liItemMenu = $('.liItemMenu');

    liItemMenu.each(function(){
        var item = {
            idCategory:$(this).attr('menu-id'),
            orderCategory:$(this).attr('ordem'),
            pages:retornaOrdemPaginas($(this).find('.liPagina'))
        };
        order.push(item);
    });

    return order;
}

function retornaOrdemPaginas(liPages){
    var obj = [];
    liPages.each(function(){
        var li = {
            idPage:$(this).attr('menu-id'),
            orderPage:$(this).attr('ordem')
        };
        obj.push(li);
    });

    return obj;
}

function jsonEqual(oldOrder,newOrder){

    var jsonDifferentPart = [];

    if(JSON.stringify(oldOrder) !== JSON.stringify(newOrder)){
        $(oldOrder).each(function(index){
            //Category
            if(oldOrder[index].orderCategory != newOrder[index].orderCategory){

                var dataNewOrder = {
                    id:newOrder[index].idCategory,
                    ordem:index,
                };

                jsonDifferentPart.push(dataNewOrder);
            }

            //Pages
            if(oldOrder[index].pages.length >0){
                var oldPages = oldOrder[index].pages;
                var newPages = newOrder[index].pages;

                $(oldPages).each(function(index2){
                    try{
                        if(oldPages[index2].orderPage != newPages[index2].orderPage){
                            var dataNewOrder = {
                                id:newPages[index2].idPage,
                                ordem:index2
                            };
                            jsonDifferentPart.push(dataNewOrder);
                        }
                    }catch(err){
                        return jsonDifferentPart;
                    }
                });
            }
        });
    }

    return jsonDifferentPart;
}

function salvarMudancaMenu(novaOrdemMenu){
    $.ajax({
        type: 'POST',
        url: caminhoBase+'MenuLateral/salvarMudancaMenu',
        data: {ordemMenu:novaOrdemMenu}
    }).done(function(retorno){
        if(!retorno){
            swal("Erro ao mudar a ordenação do menu","Entre em contato com o suporte!","error");
        }
    });
}

function filtrarMenuLateral(){
    $("#inputFiltro").on('input',function(){
        var valFiltro = $.trim($(this).val().toLowerCase());
        var liItemMenu = $('.liItemMenu');
        liItemMenu.each(function(){
            var item = $.trim($(this).find('.item').text());
            var corresponde = item.toLowerCase().indexOf(valFiltro) >=0;
            (corresponde)? $(this).show(): $(this).hide();
        });
    });
}

function resetaMenuLateral(table){
    buscarMenuConteudo();
}

function buscarMenuConteudo(){
    $.post(caminhoBase+'MenuLateral/listarMenuConteudo',function(retorno){
        $('#menuLateralIbox').html(retorno);
        iniciaMenuNestable();
        acoesMenuTela();
    });
}

function filtrarPaginasPorModulo(){
    $('#dropdownmenu > li').click(function(e){
        e.preventDefault();
        $('.dropdownmenuLi').removeClass('selected');
        $(this).addClass('selected');
        var idModulo = $(this).attr('id');
        $('#dropdownselected').text($(this).text());
        montaTablePaginas(idModulo);
    });
}

function acoesMenuTela(){
    $('.dd').nestable();
    $('.botaoAddPagina').on("click",function(){
        $('#divTable').show();
        $('#idItemMenu').val($(this).closest('.liItemMenu').attr('data-id'));
        $('#idItemMenu').attr("text-menu",$(this).closest('.dd3-content').text());
        $('#divMsgInit').hide();
        $('#divMsgItemMenu').show();
        $('.divTextItemMenu').text($(this).closest('.dd3-content').text());
        idCategoria = $(this).attr('id');
        var idModulo = $('#dropdownmenu').find('.selected').attr('id');
        var arrPaginas = $(this).closest('.dd3-item').find('.liPagina');
        var arrIdPaginas = [];
        arrPaginas.each(function(index,val){
            arrIdPaginas.push($(val).attr('data-id'));
        });
        montaTablePaginas(idModulo,arrIdPaginas);
        $(this).closest('.liItemMenu').children('button[data-action="expand"]').click();
    });

    $('.botaoRemoverCategoria').on("click",function(){
        idCategoria = $(this).attr('id');
        var arrPaginas = $(this).closest('.dd3-item').find('.liPagina');
        var arrIdPaginas = [];
        arrPaginas.each(function(index,val){
            arrIdPaginas.push($(val).attr('data-id'));
        });

        $.ajax({
            type: 'POST',
            url: caminhoBase+'MenuLateral/buscarPerfilsVinculadosCategoria',
            data: {idCategoria:idCategoria}
        }).done(function(retorno){
            var retorno = JSON.parse(retorno);
            if(retorno.existePerfis){
                swal({
                        title: "Atenção!",
                        text: "Existem perfis vinculados a essa categoria.<br>"+retorno.html+"<br> Deseja realmente excluir essa categoria?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#1ab394',
                        confirmButtonText: "Sim!",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false,
                        html:true
                    },
                    function(){
                        removerCategoria(retorno.idMenuPagina,retorno.idPagina);
                    });
            }
            else{
                swal({
                        title: "Atenção!",
                        text: "Deseja realmente excluir essa categoria?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#1ab394',
                        confirmButtonText: "Sim!",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    },function(isConfirm) {
                    if (isConfirm) {
                        removerCategoria(retorno.idMenuPagina,retorno.idPagina);
                        swal({
                            title: "Categoria excluida com sucesso",
                            type: "success"
                        });
                    }
                });
            }
        });

    });

    $('.btnRemovePagina').click(function(){
        var idPagina = $(this).closest('.liPagina').attr('data-id');
        var categoria = $(this).closest('.liItemMenu').attr('data-id');

        $.ajax({
            type: 'POST',
            url: caminhoBase+'MenuLateral/buscarPerfilsVinculadosPagina',
            data: {idPagina:idPagina}
        }).done(function(retorno){
            var retorno = JSON.parse(retorno);
            if(retorno.existePerfis){
                swal({
                    title: "Atenção!",
                    text: "Existem perfis vinculados a essa página.<br>"+retorno.html+"<br> Deseja realmente excluir essa página?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#1ab394',
                    confirmButtonText: "Sim!",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    html:true
                },
                function(){
                    removerPaginaVinculadaCategoria(retorno.arrPaginas,retorno.idPagina,categoria);
                });
            }
            else{removerPaginaVinculadaCategoria(retorno.arrPaginas,retorno.idPagina,categoria);}
        });
    });
}

function montaTablePaginas(idModulo = null,idPaginas = null){
    var tabela = $('#tableListagemPagina').DataTable();
    tabela.destroy();

    var tabela = $('#tableListagemPagina').DataTable({
        'processing': true,
        'serverSide': true,
        "pageLength": 6,
        'order': [],

        'ajax':{
            'url': caminhoBase+'MenuLateral/buscarPaginas',
            'type': 'POST',
            'data': {modulo:idModulo,idPaginas:idPaginas}
        },

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
        },
        "columns": [
            { "data": "id", visible: false },
            { "data": "nomeModulo" },
            { "data": "nomePagina" },
            { "data": "descricao" },
            { mData: data => exibirIcone(data) }
        ],

        'fnDrawCallback': function(){
            $('.btnVincularPagina').on('click',function(){
                var row = $(this).closest('tr')[0];
                var rowData = tabela.row(row).data();
                var idPagina = rowData[0];
                var botao = $(this);
                vincularPagina(botao,idCategoria,idPagina);
            });
        }
    });
}

function vincularPagina(botao,categoria,pagina){
    $.ajax({
        type: 'POST',
        url: caminhoBase+'MenuLateral/vincularPaginas',
        data: {categoria:categoria,pagina:pagina}
    }).done(function(retorno){
        var retorno = JSON.parse(retorno);
        if(retorno){
            swal({
                title:"Página Vinculadas com Sucesso!",
                text: "Clique em ok para continuar",
                type: "success"
            },
            function(){
                $(botao).parent().html("<div align='center'>"+
                "<span class='label label-primary' title='incluído'>"+
                "<i class='fa fa-check' aria-hidden='true'></i></span></div>");
                resetaMenuLateral($('#tableListagemPagina'));
            });
        }
        else{
            swal("Falha ao vincular Página","Entre em contato com o suporte!","error");
        }
    });
}

function exibirIcone(dados){
    if(dados.incluido){
        return "<div align='center'>"+
            "<span class='label label-primary' title='incluído'>"+
            "<i class='fa fa-check' aria-hidden='true'></i></span></div>";
    }
    else{
        return "<div align='center'>"+
        "<button type='button' title='Vincular página ao menu' class='btnVincularPagina btn btn-xs btn-primary'>"+
        
        "<i class='fa fa-plus-circle' aria-hidden='true'></i> incluir</button></div>";
    }
}

function removerPaginaVinculadaCategoria(arrPaginas,idPagina,idCategoria){
    $.ajax({
        type: 'POST',
        url: caminhoBase+'MenuLateral/deletarPaginaVinculadaCategoria',
        data: {arrPaginas:arrPaginas,idPagina:idPagina,idCategoria:idCategoria}
    }).done(function(retorno){
        try{
            var retorno = JSON.parse(retorno);
            if(retorno){
                swal({
                        title:"Página excluida com Sucesso!",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function(){resetaMenuLateral($('#tableListagemPagina'));});
            }
            else{
                swal("Falha ao excluir Página","Entre em contato com o suporte (cod:1)!","error");
            }
        }
        catch (e){
            swal("Falha ao excluir Página","Entre em contato com o suporte! (cod:2)","error");
        }

    });
}

function removerCategoria(idMenuCategoria, idCategoria){
    $.ajax({
        type: 'POST',
        url: caminhoBase+'MenuLateral/deletarCategoria',
        data: {idMenuCategoria:idMenuCategoria,idCategoria:idCategoria}
    }).done(function(retorno){
        try{
            var retorno = JSON.parse(retorno);
            if(retorno.status){
                swal({
                        title:"Categoria excluida com Sucesso!",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function(){resetaMenuLateral($('#tableListagemPagina'));});
            }
            else{swal("Falha ao excluir Categoria","Entre em contato com o suporte!","error");}
        }
        catch (e){
            swal("Falha ao excluir Página","Entre em contato com o suporte! (cod:2)","error");
        }
    });
}