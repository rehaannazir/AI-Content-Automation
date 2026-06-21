from passlib.context import CryptContext

pswd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashing_passward(passward : str):

    return pswd_context.hash(passward)

def verify_passward(plain_passward, hash_passward):

    return pswd_context.verify(plain_passward, hash_passward)