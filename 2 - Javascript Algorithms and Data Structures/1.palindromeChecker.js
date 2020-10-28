//Funcion que convierte mayusculas en minusculas, remueve todo caracter que no sea alfanumerico
//y lo invierte en un string para comprobar si la frase inicial es un palindromo.

function palindrome(str) {
    var alphaNumericOnly="";
    var inverted = "";
    
    var alphaNumericList = str.toLowerCase().match(/[a-z0-9]/g)
    for (var letter in alphaNumericList) {
        alphaNumericOnly = alphaNumericOnly + alphaNumericList[letter];
    }

    
    for (var i = 0; i< alphaNumericOnly.length; i++) {
        
        inverted = alphaNumericOnly[i] + inverted;

    }
    
    return alphaNumericOnly === inverted;
}

palindrome("eye");