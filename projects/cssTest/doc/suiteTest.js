cssTest.suite("suite1")
    .test(".css-panel-header", {
        "font-size": "12px",
        "line-height": "12px",
        "text-transform": "uppercase",
        "font-family": "Arial Black",
        "color": "#49494a"
    }, "css-panel-header")
    .test(".css-panel-content", {
        "vertical-align": "middle",
        //Add just padding and margin
        "padding-top": "20px",
        "padding-right": "20px",
        "padding-bottom": "20px",
        "padding-left": "20px"
    }, "css-panel-content");
    
cssTest.suite("suite2")
    .test(".css-container", {
        "width": "800px",
        "height": "700px",
        "position": "relative",
        "text-align": "left",
        "background-color": "#ffffff",
        "border-top-color": "#bbbbaa",
        "border-right-color": "#bbbbaa",
        "border-bottom-style": "solid",
        "border-left-style": "solid",
        "border-top-style": "solid",
        "border-right-style": "solid",
        "border-bottom-color": "#bbbbaa",
        "border-left-color": "#bbbbaa",
        "border-top-width": "0px",
        "border-right-width": "2px",
        "border-bottom-width": "0px",
        "border-left-width": "2px",
        "margin-top": "0px",
        "margin-right": "0px",
        "margin-bottom": "0px",
        "margin-left": "0px"
    }, "css-container")