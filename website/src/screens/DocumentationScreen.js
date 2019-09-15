import React, { useEffect } from "react";
import SwaggerUI from "swagger-ui";
import Typography from "@material-ui/core/Typography";

const DocumentationScreen = () => {
  useEffect(() => {
    SwaggerUI({
      dom_id: "#ui",
      url: "http://service.apifreesoccer.com/api/documentation"
    });
  }, []);

  return (
    <>
      <Typography variant="h2" color="inherit" noWrap>
        Documentation
      </Typography>
      <br />
      <div id="ui" />
    </>
  );
};

export default DocumentationScreen;
