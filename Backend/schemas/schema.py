from pydantic import BaseModel as _BaseModel


class Schema(_BaseModel):
    """Extend Pydantic's BaseModel to enable ORM mode"""
    model_config = {"from_attributes": True}
