from litestar.openapi.config import OpenAPIConfig
from litestar.openapi.spec.contact import Contact
from litestar.openapi.spec.license import License


config = OpenAPIConfig(
    title='Achevio API',
    version='0.2.0',
    description='Project Manager: Wilbur Elbouni',
    # contact=Contact(name="Wilbur Elbouni", email="wilbur.elbouni@ucalgary.ca"),
    use_handler_docstrings=True,
    license=License(name="This project is under the MIT License", url="https://opensource.org/licenses/MIT"),
)
"""OpenAPI config for app."""
