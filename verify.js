

exports.mail = function (mail) {
 let r1 = /^(([^<()[\]\\.,;:\s@\]+(\.[^<()[\]\\.,;:\s@\]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
    
    if(r1.test(mail))
        return true
    else 
        return false
}

exports.required = function(field) {
    let val = false;
    for (let i = 0; i < field.length; i++) {
        if(field[i] !== " ") {
            val = true;
            break;
        }
    }
    return val;
}

exports.minLength = function (field, n) {
    if (field.length < n)
        return false
    else 
        return true
}



