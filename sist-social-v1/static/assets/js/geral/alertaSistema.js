$(function(){
    exibeAlerta(msgAlertaTela);
});

function exibeAlerta(msgAlertaTela){
    swal({
        title: 'Atenção!',
        text: msgAlertaTela,
        type: 'warning',
        confirmButtonColor: "#1ab394 ",
        confirmButtonText: "OK"
    },
    function(){
        window.close();
    });
}