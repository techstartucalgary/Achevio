from litestar.openapi.config import OpenAPIConfig
from litestar.openapi.spec.contact import Contact

config = OpenAPIConfig(
    title="Achevio API",
    version="0.2.0",
    description="Project Manager: Wilbur Elbouni",
    # contact=Contact(name="Wilbur Elbouni", email="wilbur.elbouni@ucalgary.ca"),
    use_handler_docstrings=True,
)
"""OpenAPI config for app."""
