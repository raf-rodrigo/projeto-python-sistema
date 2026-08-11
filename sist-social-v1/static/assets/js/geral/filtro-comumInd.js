var tabelaFiltro;
var campos = $('#container-filtro').find(':input').not('button');
var filtro;

function criaTagFiltro(texto) {
    var span = document.createElement('span');
    span.classList.add("label", "label-primary");
    span.innerHTML = texto;

    var div = document.getElementById('filtros'+nomeController);
    div.appendChild(span);
}

function criaBotaoLimpar() {
    var link = document.createElement('a');
    link.classList.add("page-scroll");
    link.setAttribute('href', '#datatable'+nomeController);
    link.addEventListener("click", scrollFiltro);

    var botao = document.createElement('button');
    botao.id = 'limparFiltro'+nomeController;
    botao.classList.add("btn", "btn-xs", "btn-default");
    botao.innerHTML = '<i class="glyphicon glyphicon-remove"></i> Limpar';
    botao.addEventListener("click", resetarFiltro);

    var div = document.getElementById('filtros'+nomeController);

    link.appendChild(botao);
    div.appendChild(link);
}

function itensFiltros() {
    $('.filtros-usados span, .filtros-usados button').remove();
    
    for (var i = 0; i < campos.length; i++) {
        campo = $(campos[i]);
        if (campo.is('input')) {
            if(campo.val() != '' ) {
                criaTagFiltro(campo.val());
            }
        } else if (campo.is('select')) {
            if (campo.find('option:selected').text() != '' && typeof campo.find('option:selected').text() !== 'undefined') {
                criaTagFiltro(campo.find('option:selected').text());
            }
        }
    }

    if ($('.filtros-usados span').length > 0) {
        criaBotaoLimpar();
        $('.filtros-usados').show();
    }
}

function atualizaFiltro() {
    var elementos = {};
    for (var i = 0; i < campos.length; i++) {
        var campo = $(campos[i]);
        var indice = campo.attr('id').replace('filtro_', '');
    
        if (campo.hasClass('dataFiltro')) {
            elementos[indice] = dataBrParaBanco(campo.val());
        } else {
            elementos[indice] = campo.val();
        }
    }
    filtro = elementos;

    itensFiltros();
}

function limpaFiltro() {
    for (var i = 0; i < campos.length; i++) {
        var campo = $(campos[i]);
    
        if (campo.hasClass('dataFiltro')) {
            campo.val('').datepicker("update");
        } else {
            campo.val('').trigger('change');
        }
    }

    atualizaFiltro();
}

function resetarFiltro() {
    $('.filtros-usados').hide();
    limpaFiltro();
    tabelaFiltro.ajax.reload();
}

function scrollFiltro() {
    var link = $(this);
    if(typeof $(link.attr('href')).offset() == 'undefined')
        return;

    $('html, body').stop().animate({
        scrollTop: $(link.attr('href')).offset().top - 50
    }, 500);
}

$(function(){
    $('.filtros-usados').hide();

    $('a.page-scroll').bind('click', scrollFiltro);

    $('#filtrar'+nomeController).click(function() {
        atualizaFiltro();
        tabelaFiltro.ajax.reload();
    });

    $('#limpar'+nomeController + ',#limparFiltro'+nomeController).click(resetarFiltro);

    $('.legenda-filtro').click(function(event) {
        event.preventDefault();
        var titulo_texto = $(this).find('i:nth-child(1)');
        var titulo_icone = $(this).find('i:nth-child(2)');
        if (!$(this).hasClass('collapsed')) {
            titulo_texto.text(titulo_texto.text().replace("ocultar", "exibir"));
            titulo_icone.removeClass('fa-chevron-up');
            titulo_icone.addClass('fa-chevron-down');
        } else {
            titulo_texto.text(titulo_texto.text().replace("exibir", "ocultar"));
            titulo_icone.removeClass('fa-chevron-down');
            titulo_icone.addClass('fa-chevron-up');
        }
    });
});