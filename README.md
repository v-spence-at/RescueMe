# RescueMe

## Features
- View a list of emergency numbers and addresses.
- Edit a list of emergency numbers and addresses.
- Use opencage REST-API for map data.

## Must Requirements:
- M1: The backend (BE) of the system must be an individual component. &#x2714;
- M2: The frontend (FE) of the system must be an individual component implemented using HTML5, CSS and JS. &#x2714;
- M3: The communication between FE and BE components must be implemented using HTTP(S). &#x2714;
- M4: The communication between FE and BE components must be implemented using asynchronous data transfer (AJAX). &#x2714;
- M5: The HTTP endpoints of the BE component must return the data either as JSON or as XML. &#x2714;
- M6: The HTTP endpoints of the BE component must manage resources using HTTP methods GET (&#x2714;), POST (&#x2714;), PUT (&#x2714;) and DELETE (&#x2714;), each method at least on one HTTP endpoint.
- M7: The HTTP endpoints of the FE component must consume resources using HTTP methods GET (&#x2714;), POST (&#x2714;), PUT (&#x2714;) and DELETE (&#x2714;) from at least one HTTP endpoint.
- M8: The system must consume at least one external REST web service. &#x2714;
- M9: The system must implement session management (Login, sessionID, JWT, ...). &#x2714; (JWT)

## Should Requirements:
- S1: The system should consume a least two external REST web services.
- S2: The system should offer a second individual FE component that communicates with at least three HTTP endpoints of the BE component.
- S3: The FE component should be designed in a way that it is w3c compliant (https://validator.w3.org/). (&#x2714; checked, with no errors)
- S4: The FE component should be responsive in a way that it has a dedicated view for mobile and desktop screens.

