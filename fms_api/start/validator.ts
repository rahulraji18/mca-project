// import { string } from '@ioc:Adonis/Core/Helpers'
import { validator } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
validator.rule('ageVerification', (value, [role], options) => {
    if (typeof value !== 'string') {
        return
    }


    if (role == 1) {
        var today = new Date();
        var birthDate = new Date(value);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }


        if (age < 16) {
            options.errorReporter.report(
                options.pointer,
                'ageVerification',
                'age must be greater than 16',
                options.arrayExpressionPointer
            )
        }
    }

})


validator.rule('checkDateOverLap', (value, [date], options) => {
    // if (typeof value !== 'string') {
    //     return
    // }
    // console.log(date)

    if (date) {

        var d1 = DateTime.fromISO(value);
        var d2 = DateTime.fromISO(date);

        if (d1 > d2) {
            options.errorReporter.report(
                options.pointer,
                'Start Date',
                'Start date must be smaller than End date',
                options.arrayExpressionPointer
            )
        }

    }




})