$.cssTest.suite("cssSuite1")
    .test(".cssTest-hud", {
        "border-top-style": "solid",
        "border-right-style": "solid",
        "border-bottom-style": "solid",
        "border-left-style": "solid",
        "border-top-width": "1px",
        "border-right-width": "1px",
        "border-bottom-width": "1px",
        "border-left-width": "1px",
        "border-top-color": "#CCC",
        "border-right-color": "#CCC",
        "border-bottom-color": "#CCC",
        "border-left-color": "#CCC",
        "padding": "10px",
        "padding-top": "10px",
        "padding-right": "10px",
        "padding-bottom": "10px",
        "padding-left": "10px",
        "width": "300px",
        "height": "200px",
        "background-color": "#F0F0F0"
    }, "cssTest-field")
    .test(".cssTest-field", {
        position:"absolute"
    }, "cssTest-field")
    .test(".cssTest-button", {
        position:"relative"
    }, "cssTest-button");