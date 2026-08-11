
/**
 * 
 * @param {type} hora1 - Formato HH:mm
 * @param {type} hora2 - Formato HH:mm
 * @returns {Boolean}
 */
function compararHora(hora1, hora2) {
    hora1 = hora1.split(":");
    hora2 = hora2.split(":");

    var d = new Date();
    var data1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hora1[0], hora1[1]);
    var data2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hora2[0], hora2[1]);

    return data1 >= data2;
};