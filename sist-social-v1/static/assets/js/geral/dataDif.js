function dataDif(dataInicio,dataFim){
    
    var data1 = new Date(dataInicio);
    var data2 = new Date(dataFim);
    
    var data1Milisegundos = data1.getTime();     
    var data2Milisegundos = data2.getTime();  
    
    if(data1Milisegundos > data2Milisegundos){
        return false;
    }
    else{
        return true;
    }
}