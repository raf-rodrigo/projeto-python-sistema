$('#salvarNovoItemMenu').click(criaCategoria);

$('#btnAdicionarItemMenu').click(function(){
    $('#modalAdicionaItemMenu').modal('show');
});

$(document).on("click","#btnEscolherIcone",function(){
    $.post('MenuLateral/buscarIcones',function(retorno){
        var retorno = JSON.parse(retorno);
        $('#bodyIcons').html(retorno);
        $('#modalAdicionaItemMenu').modal('hide');
        $('#modalIcons').modal('show');
    });
});

$(document).on("click",".icone",function(){
    var icone = $(this).children().attr('class');
    var idIcone = $(this).closest('.boxIcone').attr('data-id');
    var htmlIcone = $(this).html();
    $('#modalIcons').modal('hide');
    $('#divIconeSelecionado').html(htmlIcone);
    $('#divIconeSelecionado').attr('data-id',idIcone);
    $('#divIconeSelecionado').attr('data-nome',icone);
});

$('#modalIcons').on('hidden.bs.modal',function(e){$('#modalAdicionaItemMenu').modal('show');});
$('#modalAdicionaItemMenu').on('hidden.bs.modal',function(e){$('#msgErro').html('');$('#msgErro').hide();});

function criaCategoria(){
    var retornoValidacao = validaCadastroCategoria();
    if(!retornoValidacao){
        var nomeCategoria = $('#nomeCategoria').val();
        var nomeIcone = $('#divIconeSelecionado').attr('data-nome');
        var idIcone = $('#divIconeSelecionado').attr('data-id');

        $.ajax({
            url: caminhoBase+'MenuLateral/cadastrarItemMenu',
            type:'POST',
            data:{nome:nomeCategoria,nomeIcone:nomeIcone,idIcone:idIcone}
        }).done(function(retorno){
            var retorno = JSON.parse(retorno);

            if(!retorno.nomeJaCadastrado){
                swal({
                    title:"Item criado com sucesso.",
                    text: "Clique em ok para continuar",
                    type: "success"
                },
                function(){
                    resetaMenuLateral($('#tableListagemPagina'));
                    $('#modalAdicionaItemMenu').modal('hide');
                });
            }
            else{swal("Categoria já cadastrada","Escolha outro nome para a categoria!","error");}
        });
    }
    else{
        $('#msgErro').show();
        $('#msgErro').html(retornoValidacao);
    }
}

function validaCadastroCategoria(){
    var erro = false;
    var msg = "";

    if($('#nomeCategoria').val().length <1){
        erro=true;
        msg+="Insira um nome de categoria <br>";
    }

    if($('#divIconeSelecionado').attr('data-id') == ""){
        erro=true;
        msg+='Selecione um Ícone <br>';
    }

    return (erro) ? msg : false;
}