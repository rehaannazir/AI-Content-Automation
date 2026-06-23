from passlib.context import CryptContext

pswd_context = CryptContext(schemes=["bcrypt"], deprecated= "auto")

def hashing_pswd(passward : str):

    return pswd_context.hash(passward)

def verify_pswd(plain_pswd, hash_pswd):
    return pswd_context.verify(plain_pswd, hash_pswd)