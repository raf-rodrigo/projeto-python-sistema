$(function () {
//
});

function geraPessoa(){

    let btn = $('.dev .btn')
    var text_btn = btn.text();

    $.ajax({
        type: "POST",
        url: caminho + 'sist_social/Pessoas/geraPessoa',
        dataType: "json",
        beforeSend: function() {
            btn.text('Gerando...');
        },
        complete: function() {
            btn.text(text_btn);
        },
        error: function(xhr) { 
           alert('Ocorreu um erro. Verifique o endpoint 4dev')
           alert(xhr.statusText + xhr.responseText)
           return
        },
        success: function (response) {

            if(response == 'false' || response == false) {
                btn.text(text_btn);
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    //timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                  });
                  Toast.fire({
                    icon: "error",
                    title: "Tente novamente."
                  });
            }

            var data = JSON.parse(response);

            nome = data[0].nome
            cpf = data[0].cpf
            data_nasc = data[0].data_nasc
            sexo = data[0].sexo
            mae = data[0].mae
            pai = data[0].pai
            telefone_fixo = data[0].telefone_fixo
            celular = data[0].celular
                      
            $('#nomeCompleto').val(nome)
            $('.cpf').val(cpf)
            $('#dataNascimento').val(data_nasc)

            if (gerarBooleanAleatorio(90)) { //90% ed chances de conhecer a mãe
                $('#nomeMae').val(mae);
                $('input[name="naoSabeNomeMae"]').iCheck('uncheck');
            } else {
                $('#nomeMae').val('');
                $('input[name="naoSabeNomeMae"]').iCheck('check');
            }

            if (gerarBooleanAleatorio(50)) { //30% ed chances de conhecer o pai
                $('#nomePai').val(pai);
                $('input[name="naoSabeNomePai"]').iCheck('uncheck');
            } else {
                $('#nomePai').val('');
                $('input[name="naoSabeNomePai"]').iCheck('check');
            }
            
       
            $('.tel').val(telefone_fixo)
            $('.cel').val(celular)
            $('.nis').val(gerarNIS())
            
            probabilidade = gerarBooleanAleatorio(15)// Probabilidade de gerar uma pessoa morador de rua
            $('input[name="moradorRua"][value="'+probabilidade+'"]').iCheck('check');
            $('#selectOrientacaoSexual').val(geraAleatorio(10,1)).trigger('change');
            $('#selectIdentidadeGenero').val(geraAleatorio(10,1)).trigger('change');
            $('#selectEtnia').val(geraAleatorio(5,1)).trigger('change');

            
            if(sexo === 'Masculino') {
                $('input[name="sexo"][value="Masc"]').iCheck('check');
            } else {
                $('input[name="sexo"][value="Fem"]').iCheck('check');
            }
            //pessoa gerada
                swal("", "Pessoa gerada!", "success");
            //pessoa gerada
          
        }
    });
}

function gerarNIS() {
    // Gera um número aleatório entre 0 e 99999999999 (11 dígitos)
    const numero = Math.floor(Math.random() * 100000000000);
    // Converte o número para uma string e preenche com zeros à esquerda, se necessário
    return numero.toString().padStart(11, '0');
}

// Utilizando para gerar morador de rua: 0 nao, 1 sim.
//Forcencer a porcentagem para gerar 1
function gerarBooleanAleatorio(percentualChance) {

    if (percentualChance < 0 || percentualChance > 100) {
        throw new Error('A porcentagem deve estar entre 0 e 100.');
    }

    const chance = Math.random() * 100;

    return chance < percentualChance ? 1 : 0;
}

// Exemplos de uso
//console.log(geraAleatorio(4));    // Pode gerar: 0, 1, 2, 3, 4
//console.log(geraAleatorio(4, 1)); // Pode gerar: 1, 2, 3, 4
//console.log(geraAleatorio(10, 5)); // Pode gerar: 5, 6, 7, 8, 9, 10
function geraAleatorio(max, min = 0) {
    // Gera um número aleatório entre min e max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}