interface userInterface {
    name: string,
    usrname: string,
    password: string,
    confirmPassword: string,
    email: string,
    image: string,
    isDeleted: boolean,
    cretedOn: Date
    comparePassword(candidatePwsrd: string, dbPswrd: string): Promise<boolean>;
}