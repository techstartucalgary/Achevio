from argon2 import PasswordHasher

ph = PasswordHasher()


def hash_password(password):
    return ph.hash(password)

print(hash)

print(ph.verify(hash, "s3kr3tp4ssw0rd"))