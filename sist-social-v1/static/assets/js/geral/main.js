function formataTableParaDataTable(id, numLinhas = 10) {
    $(id).DataTable({
        "pageLength": numLinhas,
        "language": {
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
        "bLengthChange": false
    });
}

function formataChecks(classe) {
    $(classe).iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

}

function dataBrParaBanco(data) {
    if (data == '') {
        return data;
    } else {
        var arrData = data.split('/');
        return (arrData[2] + '-' + arrData[1] + '-' + arrData[0]);
    }
}

function formataDataParaDatePicker(campoDataDe, campoDataAte) {
    campoDataDe.datepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR',
        maskInput: true,
        autoclose: true
    }).on('changeDate', function(selected) {
        var dataInicio = new Date(selected.date.valueOf());
        campoDataAte.datepicker('setStartDate', dataInicio);
    }).on('clearDate', function(selected) {
        campoDataAte.datepicker('setStartDate', null);
    }).on('hide', function() {
        campoDataAte.focus();
    });

    campoDataAte.datepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR',
        maskInput: true,
        autoclose: true
    }).on('changeDate', function(selected) {
        var dataFim = new Date(selected.date.valueOf());
        campoDataDe.datepicker('setEndDate', dataFim);
    }).on('clearDate', function(selected) {
        campoDataDe.datepicker('setEndDate', null);
    });
}

function converteDataParaIdade(dateOfBirth, dateToCalculate) {
    dateOfBirth = parseData(dateOfBirth);
    var calculateYear = dateToCalculate.getFullYear();
    var calculateMonth = dateToCalculate.getMonth();
    var calculateDay = dateToCalculate.getDate();

    var birthYear = dateOfBirth.getFullYear();
    var birthMonth = dateOfBirth.getMonth();
    var birthDay = dateOfBirth.getDate();

    var age = calculateYear - birthYear;
    var ageMonth = calculateMonth - birthMonth;
    var ageDay = calculateDay - birthDay;

    if (ageMonth < 0 || (ageMonth == 0 && ageDay < 0)) {
        age = parseInt(age) - 1;
    }
    return age;
}

function parseData(dateStr) {
    var dateParts = dateStr.split("/");
    return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
}

function mostraIdade() {
    var dtNasc = $('#dtaNascPes').val();


    // if(dtNasc.length > 0){
    //     dtNasc = dtNasc.split('/');
    //     $('#idade').val(idade(dtNasc[2], dtNasc[1], dtNasc[0])+' anos');

    // }
}

function idade(ano, mes, dia) {
    var d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),

        ano_aniversario = +ano,
        mes_aniversario = +mes,
        dia_aniversario = +dia,

        quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;
}