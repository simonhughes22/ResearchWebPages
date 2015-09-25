function round(n, decimals){
    var num = Number(n);
    return num.toFixed(decimals);
}

function vectorLength(vector){
    var total = 0.0;
    for(var i = 0; i < vector.length; i++){
        var item = vector[i];
        total += (item * item);
    }
    return Math.sqrt(total);
}
