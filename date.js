exports.getDate = function () {

    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };

    const today = new Date(); // defaults to current date.
    
    return today.toLocaleDateString("en-US", options);

}

exports.getFullDate = function () {

    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };

    const today = new Date(); // defaults to current date.

    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function () {

    const options = {
        weekday: 'long'
    };

    const today = new Date(); // defaults to current date.

    return today.toLocaleDateString("en-US", options);
}

exports.getMonth = function () {

    const options = {
        month: 'long'
    };

    const today = new Date(); // defaults to current date.

    return today.toLocaleDateString("en-US", options);
}