declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
        ageVerification(role?: number): Rule
        checkDateOverLap(date?: String): Rule
    }
}