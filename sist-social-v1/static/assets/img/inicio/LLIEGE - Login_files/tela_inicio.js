$(document).ready(function() {

    atualizaNovasNotificacoes(); //Chama método que retorna novas notificações da base de dados.
    $('#noti_Counter').hide();
    $('#painel_resposta').hide(); //Esconde o painel de resposta!
    $('#button_responde_notificacao').hide(); //Esconde botão respondir da modal.

    setInterval("atualizaNovasNotificacoes()", 60000);

    $('#iconNotificacao').on('click', function() {
        var posicaoNotificacao = $('#iconNotificacao').offset();
        posicaoNotificacao['top'] = posicaoNotificacao['top'] + 30;
        posicaoNotificacao['left'] = posicaoNotificacao['left'] - 330;
        $('#notifications').css(posicaoNotificacao);
    });
    //Exibe notificacões
    $('#notificacao').click(function() {
        $('#notifications').fadeToggle('fast', 'linear', function() {});
        return false;
    });

    $('#trocar_perfil').on('change', function(e) {
        e.preventDefault();
        var id_perfil_troca = $('#trocar_perfil').val();
        if (id_perfil_troca) {
            $.ajax({
                type: 'POST',
                data: { id: id_perfil_troca },
                url: caminho + 'sist_central/Login/trocarPerfil'
            }).done(function(retorno) {
                window.location.href = caminho + 'sist_central/Inicio';
            });
        }
    });

    $(document).click(function() { $('#notifications').hide(); });

    //Exibe os detalhes da notificação.
    $("#div_notificacoes").on("click", ".notificacao", function() {
        id_notificacao_clicada = retorno[$(this).attr('id')].id; //Variavél para ser usada no evento de responder a notificação.
        notificacao_clicada = $(this).attr('id');
        $('#modal_notificacoes').modal('show'); //manifesta modal
        $('#button_responde_notificacao').show();

        //Caso for uma reposta, muda o formato do título.
        if (retorno[$(this).attr('id')].resposta_notificacao == 1) { $('#modal_header_notificacao').html('<strong>Reposta da notificação:</strong> ' + retorno[$(this).attr('id')].assunto); } else { $('#modal_header_notificacao').html(retorno[$(this).attr('id')].assunto); }

        $('#modal_body_notificacao').html(retorno[$(this).attr('id')].notificacao); //Preenche a notificação.
        $('#modal_footer_notificacao').html('<strong>De:</strong> ' + retorno[$(this).attr('id')].nome_remetente + '<br><strong>Data:</strong> ' + retorno[$(this).attr('id')].data_formatada); //Preenche com emissor e data.

        //Verifica se notificação necessita de resposta.
        if (retorno[$(this).attr('id')].resposta == 1 && retorno[$(this).attr('id')].status_id != 3) {
            $('#painel_resposta').show();
        } else {
            $('#painel_resposta').hide();
            $('#button_responde_notificacao').hide();
            $(this).remove(); //Remove o elemento da lista de notificação
            count--; //diminui a contagem de notificações!
        }

        //Caso o número de notificacões for maior que 0, exibe alert de notificacoes
        if (count > 0) {
            $('#noti_Counter').css({ opacity: 0 }).text(count).css({ top: '-10px' }).animate({ top: '-2px', opacity: 1 }, 500);
        } else {
            $('#noti_Counter').hide(); //Esconde o alert de novas notificações
            $('#div_notificacoes').html('<p class="alert alert-warning" role="alert" align="center">Nenhuma nova notificação!</p>');
        }

        if (retorno[$(this).attr('id')].resposta == 1 && retorno[$(this).attr('id')].status_id == 3 || retorno[$(this).attr('id')].resposta == 0) {
            atualizaNotificacaoVisualizada(2, retorno[$(this).attr('id')].id, id_notificacao_clicada);
        }

        //Notificação passa de "Enviada" para "Visualizada".

    });
    //Atualiza as notificações.
    $('#button_atualiza_notificacoes').click(function() { atualizaNovasNotificacoes(); });

    //Mantem a janela de notificações aberta após o fechamento da modal.
    $('#modal_notificacoes').on('hidden.bs.modal', function(e) {
        $('#notifications').fadeToggle('fast', 'linear', function() {});
    });

    /***************************RESPONDE NOTIFICAÇÕES****************************************************/

    $('#button_responde_notificacao').click(function() {
        if ($('#textRespostaNotificacao').val().length <= 0) {
            swal({
                title: 'Campo Obrigatório!',
                text: 'Preencha o campo de Resposta!',
                type: 'warning',
                confirmButtonColor: "#ed5565",
                confirmButtonText: "OK"
            });
        } else {
            //Envia a resposta ao destinatário, e atualiza o status da notificação -> passa de visualizada para respondida.
            $.ajax({
                type: 'POST',
                url: caminho + "sist_social/Notificacao/inserir",
                data: {
                    assunto: retorno[notificacao_clicada].assunto,
                    notificacao: $('#textRespostaNotificacao').val(),
                    destinatario: retorno[notificacao_clicada].remetente,
                    remetente: retorno[notificacao_clicada].destinatario,
                    data: retorno[notificacao_clicada].data_formatada,
                    id_notificacao: id_notificacao_clicada
                }
            }).done(function(retorno) {
                retorno = JSON.parse(retorno);
                if (retorno.resultado == true) {
                    swal({
                        title: 'Resposta Enviada com Sucesso',
                        text: '',
                        type: 'success',
                        confirmButtonColor: "#1ab394",
                        confirmButtonText: "OK",
                        focusConfirm: false
                    });
                    $('#button_responde_notificacao').hide('slow'); //Esonde o botão de responder.
                    $('#textRespostaNotificacao').val(''); //Limpa o <textarea> da modal!
                    $('#painel_resposta').hide('slow'); //Esconde o painel de resposta!
                    $('#fechar_notificacao_x').click();
                    atualizaNovasNotificacoes();
                } else {
                    swal({
                        title: 'Falha ao Enviar Mensagem!',
                        text: 'Entre em contato com o suporte',
                        type: 'error',
                        confirmButtonColor: "#ed5565",
                        confirmButtonText: "OK"
                    });
                }
            })
        }
    });

    unidadeSession();
    encerraSession();

});

//Verifica na base de dados, se existe notificações.
function atualizaNovasNotificacoes() {
    if (typeof caminho === "undefined") return
   
    var valor = '';

    $.ajax({
        type: 'POST',
        url: caminho + "sist_social/Notificacao/atualizarNovasNotificacoes",
        data: valor,
        encode: true
    }).done(function(dados) {
        retorno = JSON.parse(dados);

        var notificacoes = '';
        count = 0;
        var tipo_notificacao = ''; //Indica se é uma nova notificação, ou se é uma reposta.

        for (i = 0; i < retorno.length; i++) {
            if (retorno[i].status_id == 1 && retorno[i].resposta_notificacao == 0) {
                tipo_notificacao = '<span class="label label-primary pull-right">Novo</span>';
            } else if (retorno[i].status_id == 1 && retorno[i].resposta_notificacao == 1) {
                tipo_notificacao = '<span class="label label-warning pull-right">Resposta</span>';
            }

            notificacoes += '<a href="#" class="list-group-item notificacao" id="' + i + '"><h5 class="list-group-item-heading">De: ' + retorno[i].nome_remetente + '' + tipo_notificacao + '</h5><p class="list-group-item-text">Assunto: ' + retorno[i].assunto + '</p></a>';
            count++;
        }

        if (count > 0) {
            $('#noti_Counter').show();
            $('#noti_Counter').css({ opacity: 0 }).text(count).css({ top: '-10px' }).animate({ top: '-2px', opacity: 1 }, 500);
            $('#div_notificacoes').html(notificacoes);
        } else {
            $('#noti_Counter').hide();
            $('#div_notificacoes').html('<p class="alert alert-warning" role="alert" align="center">Nenhuma nova notificação!</p>');
        }
    });
}

function registraPaginaAcessada(menu, subMenu, url) {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: caminho + 'sist_central/Inicio/registraMenu',
        data: {
            'menu': menu,
            'subMenu': subMenu,
        }
    }).always(function() {
        window.location.href = url;
    });
}

function exibeAtalhos() {
    $('#divAcessadas').show();
    exibePaginasMaisAcessadas();
    //ultimasPaginasAcessadas();
}

function exibePaginasMaisAcessadas() {
    $.ajax({
            dataType: 'json',
            url: caminho + "sist_central/Pagina/maisAcessados",
        })
        .done(function(objJson) {
            $('#paginasMaisAcessadas').html(objJson.html);
        })
        .fail(function(rsp) {
            $('#paginasMaisAcessadas').html('Falha ao carregar conteúdo.');
        });
}

function ultimasPaginasAcessadas() {
    $.ajax({
            dataType: 'json',
            url: caminho + "sist_central/Pagina/ultimasAcessadas",
        })
        .done(function(objJson) {
            $('#ultimasPaginasAcessadas').html(objJson.html);
        })
        .fail(function(rsp) {
            $('#ultimasPaginasAcessadas').html('Falha ao carregar conteúdo.');
        });
}

//Recebe a identificação da notificacao e qual o número do status que se deve atualizar.
function atualizaNotificacaoVisualizada(status_notificacao, id_notificacao) {
    $.ajax({
        type: 'POST',
        url: caminho + "sist_social/Notificacao/atualizarNotificacoesVisualizadas",
        data: {
            status: status_notificacao,
            notificacao: id_notificacao
        }
    });
}

function esconde_msg(campo) {
    setTimeout(function() {
        campo.fadeOut('slow')
    }, 4000);
}

function unidadeSession() {
    if (typeof nome_conhecido === "undefined") return
    $.ajax({
        url: '/ci/sist_central/Login/unidadeSession',
        type: 'GET',
        dataType: 'json',
        success: function(resposta) {
            $('#unidade2').append(resposta[0].nome_conhecido);
        }
    });

}

function encerraSession() {

    $('#sair').click(function() {
        $.ajax({
            url: '/ci/sist_central/Login/encerraSession',
            type: 'GET',
            dataType: 'json',
            success: function(resposta) {
                return true
            }
        });
    })
}