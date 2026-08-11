function defineBotoesAcoes(){
    $('.botaoExcluirPerfil').click(function(event){
        var idPerfil = $(this).attr('data-id');

        swal({
            title: "Deseja realmente deletar este perfil?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#ed5565 ',
            confirmButtonText: 'Sim, deletar registro!',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: false },
            function(){excluirPerfil(idPerfil);}
        );
    });

    //Exibe modal para vincular itens do menu ao perfil.
    $('.botaoVincularItensMenu').click(function(event){
        idPerfil = $(this).attr('data-id');
        nomePerfil = $(this).parent().parent().parent().children().closest('.tdNomePerfil').text();
        nomeModulo = $(this).parent().parent().parent().children().closest('.tdModuloPerfil').text();
        idModulo = $(this).closest('tr').attr('data-modulo-id');

        if(typeof idModulo == 'undefined'){
            idModulo = $('.chosen-select option:selected').val();
        }

        $.ajax({
            url: caminho+'sist_central/Perfil/exibirCategorias',
            type: 'POST',
            data: {
                idPerfil:idPerfil,
                nomePerfil:nomePerfil,
                nomeModulo:nomeModulo,
                idModulo:idModulo
            }
        })
        .done(function(retorno){
            $('#modalSelecionaItensMenu').modal('show');
            $('#modalBodyListaPerfis').html(retorno);

            formataChecks($('.i-checks'));

            //Exceção-> Salva as páginas localizadas no menu lateral.
            $('.checksMenuLateral').on('ifChanged', function(event){
                var idPaginaSelecionada = $(this).parent().parent().parent().attr('data-id');
                var inserir = null;
                if($(this).is(':checked')){
                    inserir = 1;
                }
                vincularPaginaMenuLateralAoPerfil(idPaginaSelecionada,idPerfil,inserir);
            });
        }).fail(function(){
            swal("Ops","Falha ao exibir os dados, entre em contato com o suporte!","warning");
        });
    });

    //Exibe Tabela de permissões.
    $('.botaoPermissoesPerfil').click(function(){
        idPerfilExterno = $(this).attr('dataPerfilIdExterno');
        idModulo = $(this).parent().parent().parent().attr('data-modulo-id');
        idPerfil = $(this).parent().parent().parent().attr('data-perfil-id');
        nomeModulo = $(this).parent().parent().parent().children().closest('.tdModuloPerfil').text();
        nomePerfil = $(this).parent().parent().parent().children().closest('.tdNomePerfil').text();
        $.ajax({
            url: caminho+'sist_central/Perfil/exibePermissoesSocial',
            type: 'POST',
            data: {perfilIdExterno: idPerfilExterno}
        })
        .done(function(retorno){
            var retorno = JSON.parse(retorno);

            $('#modalPermissoes').modal('show');
            $('#smallModulo').text(nomeModulo);
            $('#smallPerfil').text(nomePerfil);
            $('#modalBodyPermissoes').html(retorno['html']);

            $('.active').each(function(){
                $(this).removeClass('btn-default');
                $(this).addClass('btn-primary');
            });

            arrPermissoesAntes = retorno['arrPermissaoAntes'];//Permissões.

            formataChecks($('.opcaoPermissoesInserir'));
            formataTableParaDataTable($('#tableModalPermissoes'),5);

            //Quando houver mudança na opção das permissões, muda a classe do botão.
            $(document).on('change','.opcaoPermissoes',function(){
                $(this).parent().parent().children().each(function(){
                    $(this).removeClass('btn-primary');
                    $(this).addClass('btn-default');
                });
                $(this).parent().removeClass('btn-default');
                $(this).parent().addClass('btn-primary');
            });
        });
    });

    //Salva as permissões selecionadas
    $(document).on('click','#salvarPermissoes', function(){
        var table = $('#tableModalPermissoes').DataTable();
        table.destroy();

        var permissoes = new Array();

        $('.trModalPermissoes').each(function(index){
             var inserir = $(this).children().find('.opcaoPermissoesInserir').is(':checked');
             var visualizar = $(this).children().find('.visualizar').find('.active').children().val();
             var editar = $(this).children().find('.editar').find('.active').children().val();
             var deletar = $(this).children().find('.deletar').find('.active').children().val();
             permissoes[index] = {
                 "tabela" : $(this).attr('data-table'),
                 "inserir": inserir ? 1 : 0,
                 "visualizar": visualizar == undefined ? 0 : visualizar,
                 "editar": editar == undefined ? 0 : editar,
                 "deletar": deletar == undefined ? 0 : deletar
             };
        });

        formataTableParaDataTable($('#tableModalPermissoes'),5);

        $.ajax({
            url: caminho+'sist_central/perfil/salvarPermissoes',
            type: 'POST',
            data: {
                idPerfilExterno:idPerfilExterno,
                arrPermissoes:permissoes,
                idPerfil:idPerfil,
                idModulo:idModulo,
                arrPermissoesAntes: arrPermissoesAntes
            }
        }).done(function(retorno){
            var retorno = JSON.parse(retorno);

            if(retorno){
                swal({
                    title:"Permissões Atualizadas com Sucesso!",
                    text:"Clique em ok para continuar",
                    type:"success"
                });
            }
            else{
                swal({
                    title: 'Oops!',
                    text: 'Falha ao atualizar as permissões, entre em contato com o suporte!',
                    confirmButtonColor: '#f8ac59',
                    confirmButtonText: 'OK',
                    type: 'warning',
                    html: false
                });
            }
        });
    });

    //Exibe a table com as paǵinas vinculadas a categoria selecionada.
    $(document).on('click', '.opcaoMenuLateral', function(event){
        idCategoria = $(this).attr('data-id');

        element = $(this);

        $.ajax({
            url: caminho+'sist_central/Menu/paginasVinculadasCategoria',
            type: 'POST',
            data: {idCategoria:idCategoria,idPerfil:idPerfil}
        })
        .done(function(retorno){
            if(retorno){
                $('#divTableMenuModal').html(retorno);

                //Formata os checks para i-Checks.
                formataChecks($('.i-checks'));

                 //Formata a tabela para o padrão dataTable
                formataTableParaDataTable($('#tableModalPerfil'));

                //Evento ->Marca todos os checks da table.
                $('#checkMarcarTodosVinculaMenu').on('ifChanged', function(event){

                    if($(this).is(':checked')){
                        var table = $('#tableModalPerfil').DataTable();
                        table.destroy();
                        $('.checks').iCheck('check');
                        formataTableParaDataTable($('#tableModalPerfil'));
                    }
                    else{
                        table = $('#tableModalPerfil').DataTable();
                        table.destroy();
                        $('.checks').iCheck('uncheck');
                        formataTableParaDataTable($('#tableModalPerfil'));    
                    }
                });
            }
            else{
                swal("Ops", "Nenhum dado encontrado!", "warning");
            }
        })
        .fail(function(){
            swal("Ops", "Falha ao atualizar os dados, entre em contato com o suporte!", "warning");
        });
    });

    //Evento ->Salva o vinculo do menu com o perfil.
    $(document).on('click','#salvarVinculoMenuPerfil',function(){
        
        var table = $('#tableModalPerfil').DataTable();

        table.destroy();
        var arrIdsPaginas = [];

        //Checks dataTable.
        $('.checks').each(function(index, el){
            if($(this).is(':checked')){
                arrIdsPaginas.push($(this).parent().parent().parent().attr('data-id'));
            }
        });

        formataTableParaDataTable($('#tableModalPerfil'));

        vinculaMenuAoPerfil(arrIdsPaginas,idCategoria,idPerfil);
    });

    //Exibe modal de vincular ações
    $('.botaoVincularAcoes').click(function(){
        idPerfilVincularAcao = $(this).attr('data-id');

        $.ajax({
            url: caminho+'sist_central/Perfil/exibirPaginasPorPerfil',
            type: 'POST',
            data: {idPerfil:idPerfilVincularAcao}
        })
        .done(function(retorno){
            try{ 
                var retorno = JSON.parse(retorno); 
                if(retorno.status){
                    if(retorno.status == 'Sucesso'){
                        $('#modalVinculaAcoes').modal('show');
                        $('#modalBodyVinculaAcoes').html(retorno.html);
                        $('#idPerfil').val(idPerfilVincularAcao);
                    }
                    else{
                        if(!retorno.msg){
                            retorno.msg = "Falha ao exibir ações, entre em contato com o suporte!";
                        }
                        swal({
                            title:"Ops",
                            text: retorno.msg,
                            type: "warning"
                        });
                    }
                }
                else{
                    swal({
                        title:"Ops",
                        text: "Falha ao exibir ações, entre em contato com o suporte!",
                        type: "warning"
                    });
                }
            }
            catch(err){
                swal("Ops", "Falha ao exibir ações, entre em contato com o suporte!", "warning");
            }
        })
        .fail(function(){
            swal("Ops","Falha ao exibir ações, entre em contato com o suporte!","warning");
        });
    });

    //Exibe as ações da página selecionada.
    $(document).on('click','.paginaAcoesMenuLateral',function(event){
    
        var idPagina = $(this).attr('data-id');
        var idPerfil = $('#idPerfil').val();

        $.ajax({
            url: caminho+'sist_central/Perfil/exibirAcoesPorPagina',
            type: 'POST',
            data: {idPagina: idPagina, idPerfil: idPerfil}
        })
        .done(function(retorno){
            if(retorno){

                $('#divTableAcoesModal').html(retorno);

                formataChecks($('.i-checks'));
                formataTableParaDataTable($('#tabelaListaAcoes'));

                $('#checkMarcarTodosVincularAcoes').on('ifChanged',function(event){

                    if($(this).is(':checked')){
                        var table = $('#tabelaListaAcoes').DataTable();
                        table.destroy();
                        $('.checksAcoes').iCheck('check');
                        formataTableParaDataTable($('#tabelaListaAcoes'));
                    }
                    else{
                        table = $('#tabelaListaAcoes').DataTable();
                        table.destroy();
                        $('.checksAcoes').iCheck('uncheck');
                        formataTableParaDataTable($('#tabelaListaAcoes'));    
                    }
                });
            }
            else{
                swal("Ops","Falha ao exibir ações da página, entre em contato com o suporte!","warning");
            }    
        })
        .fail(function(){
            swal("Ops","Falha ao exibir ações da página, entre em contato com o suporte!","warning");
        });
    });

    //Salva as ações selecionadas e vincula com o perfil selecionado.
    $(document).on('click','#salvarVinculoAcoesPerfil',function(event){
        
        var table = $('#tabelaListaAcoes').DataTable();

        table.destroy();
        var arrIdsVincularAcoes = [];
        var arrIdsExcluir = [];

        //Checks dataTable.
        $('.checksAcoes').each(function(index, el){
            if($(this).is(':checked')){
                arrIdsVincularAcoes.push($(this).parent().parent().parent().attr('data-id'));
                arrIdsExcluir.push($(this).parent().parent().parent().attr('data-id'));
            }
            else{
                arrIdsExcluir.push($(this).parent().parent().parent().attr('data-id'));
            }
        });

        formataTableParaDataTable($('#tabelaListaAcoes'));

        $.ajax({
           url: caminho+'sist_central/Perfil/vincularAcoes',
           type: 'POST',
           data: {
                idPerfil:idPerfilVincularAcao,
                arrIdsVincularAcoes:arrIdsVincularAcoes,
                arrIdsExcluir:arrIdsExcluir
            }
        })
        .done(function(retorno){
           if(retorno){
                swal({
                    title:"Ações vinculadas com sucesso!",
                    text: "Clique em ok para continuar",
                    type: "success"
                });
           }
           else{
            swal("Ops","Falha ao salvar alterações, entre em contato com o suporte!","warning");
           }
        })
        .fail(function(){
           swal("Ops","Falha ao vincular ações, entre em contato com o suporte!","warning");
        });
    });

    $(document).on('click','.btnExibirSubPaginas',function(){
        var nomePagina = $(this).attr('data-pagina');

        $(this).closest('.list-group-item').siblings('.'+nomePagina).toggle('slow');
        if($(this).find('i').hasClass('fa-chevron-down')){
            $(this).find('i').removeClass('fa-chevron-down');
            $(this).find('i').addClass('fa-chevron-up');
        }
        else{
            $(this).find('i').removeClass('fa-chevron-up');
            $(this).find('i').addClass('fa-chevron-down');
        }
    });
}


function excluirPerfil(idPerfil){

    var paginaAtual = window.location.href;

    $.ajax({
        url: caminho+'sist_central/Perfil/deletar',
        type:'POST',    
        data:{id:idPerfil},
        success:function(response){
            
            try{
                retorno = JSON.parse(response);

                if(retorno.resultado){
                    swal({
                        title:"Perfil excluido com sucesso!",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function() { window.location.href = paginaAtual; });
                }
                else{
                    swal({
                        title:"Não foi possível excluir perfil!",
                        text: "Clique em ok para continuar",
                        type: "error"
                    });
                }
            }
            catch(err){
                swal("Ops", "Falha ao excluir dados do perfil, entre em contato com o suporte!", "warning");
            }
        },
        error:function(){
            swal("Ops", "Falha ao excluir dados do perfil, entre em contato com o suporte!", "warning");
        }
    });
}

function vinculaMenuAoPerfil(arrIdsPaginas,idCategoria,idPerfil){
    $.ajax({
        url: caminho+'sist_central/Perfil/vincularMenu',
        type:'POST',
        data:{arrIdsPaginas:arrIdsPaginas,idCategoria:idCategoria,idPerfil:idPerfil}
    })
    .done(function(retorno){
        retorno = JSON.parse(retorno);
        
        if(retorno.status === null){
            swal({
                title:"Páginas vinculadas com sucesso!",
                text: "Clique em ok para continuar",
                type: "success"
            });
        }
        else if(retorno.status){
            if(retorno.categoria){
               $(element).children().closest('.spanCheck').html('<i class="fa fa-check"></i>');
            }
            else{
                $(element).children().closest('.spanCheck').html('');
            }
            swal({
                title:"Páginas vinculadas com sucesso!",
                text: "Clique em ok para continuar",
                type: "success"
            });
        }
        else{
            swal("Ops", "Falha ao vincular páginas ao perfil!", "warning");
        }
    }).fail(function(){
        swal("Ops", "Falha ao excluir dados do perfil, entre em contato com o suporte!","warning");
    });
}
function vincularPaginaMenuLateralAoPerfil(idPagina,idPerfil,inserir){
    $.ajax({
        url: caminho+'sist_central/Perfil/vincularPaginaDoMenuLateral',
        type:'POST',
        data:{idPagina:idPagina,idPerfil:idPerfil,inserir:inserir}
    })
    .done(function(retorno){
        retorno = JSON.parse(retorno);
        if(retorno.resultado){
            swal({
                title:retorno.msg,
                text: "Clique em ok para continuar",
                type: "success"
            });
        }
        else{
            swal("Ops", "Falha ao vincular página ao perfil!", "warning");
        }
    })
    .fail(function() {
        swal("Ops", "Falha ao atualizar dados do perfil, entre em contato com o suporte!","warning");
    });
}