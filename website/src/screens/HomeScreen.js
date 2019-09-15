import React from "react";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { Link } from "react-router-dom";

const HomeScreen = () => (
  <>
    <Typography variant="h2" color="inherit">
      Free Soccer
    </Typography>
    <br />
    <Typography variant="h5" color="inherit">
      Free API with results from national soccer competitions
    </Typography>
    <br />
    <Typography variant="h6" color="inherit">
      Summary
    </Typography>
    <ul>
      <li>
        <Link to="/getting-started">Getting Started</Link>
        <ul>
          <li>
            <Link to="/getting-started#signup">Sign-Up</Link>
          </li>
          <li>
            <Link to="/getting-started#api-key">Get API key</Link>
          </li>
          <li>
            <Link to="/getting-started#knonw-api">Know the API</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link to="/getting-started#conTableRowibute">Getting Started to Contribute</Link>
        <ul>
          <li>
            <Link to="/getting-started#clone-github">Clone to Github</Link>
          </li>
          <li>
            <Link to="/getting-started#npm">NPM</Link>
          </li>
          <li>
            <Link to="/getting-started#branch-request">Branch and Pull Request</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link to="/documentation">Documentation</Link>
      </li>
      <li>
        <Link to="/about">About Us</Link>
      </li>
    </ul>
    <br />
    <Typography variant="h6" color="inherit">
      Competitions
    </Typography>
    <br />
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Year</TableCell>
          <TableCell>Sex</TableCell>
          <TableCell>Year</TableCell>
          <TableCell>Results</TableCell>
          <TableCell>Table</TableCell>
          <TableCell>Statistics</TableCell>
          <TableCell>Flags</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Brasileirão Série A</TableCell>
          <TableCell>Brazil</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2012 - 2018</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Brasileirão Série B</TableCell>
          <TableCell>Brazil</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2012 - 2018</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Copa do Brasil</TableCell>
          <TableCell>Brazil</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2012 - 2018</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="na">
              〰️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Copa do Brasil Sub-20</TableCell>
          <TableCell>Brazil</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2012 - 2018</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="na">
              〰️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Copa do Brasil Sub-17</TableCell>
          <TableCell>Brazil</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2013 - 2018</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="na">
              〰️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Copa Verde</TableCell>
          <TableCell>Brazil</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2014 - 2018</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="na">
              〰️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>La Liga</TableCell>
          <TableCell>Spain</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2013/2014 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>La Liga Segunda División</TableCell>
          <TableCell>Spain</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2013/2014 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Primera División Femenina</TableCell>
          <TableCell>Spain</TableCell>
          <TableCell>F</TableCell>
          <TableCell>2013/2014 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Premier League</TableCell>
          <TableCell>England</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2000/2001 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ❌
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ligue 1</TableCell>
          <TableCell>France</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2000/2001 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ligue 2</TableCell>
          <TableCell>France</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2000/2001 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Coupe Ligue</TableCell>
          <TableCell>France</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2000/2001 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="na">
              〰️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Serie A</TableCell>
          <TableCell>Italy</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2004/2005 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bundesliga</TableCell>
          <TableCell>Germany</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2000/2001 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2 Bundesliga</TableCell>
          <TableCell>Germany</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2000/2001 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3 Liga</TableCell>
          <TableCell>Germany</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2008/2009 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Allianz Frauen-Bundesliga</TableCell>
          <TableCell>Germany</TableCell>
          <TableCell>F</TableCell>
          <TableCell>2000/2001 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2 Frauen-Bundesliga</TableCell>
          <TableCell>Germany</TableCell>
          <TableCell>F</TableCell>
          <TableCell>2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Liga NOS</TableCell>
          <TableCell>Portugal</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2009/2010 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ledman LigaPro</TableCell>
          <TableCell>Portugal</TableCell>
          <TableCell>M</TableCell>
          <TableCell>2009/2010 - 2018/2019</TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="check">
              ✔️
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
          <TableCell>
            <span role="img" aria-label="uncheck">
              ❌
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <br />
    <Typography variant="h6" color="inherit">
      Federations
    </Typography>
    <ul>
      <li>CBF</li>
      <li>RFEF</li>
      <li>FFF</li>
      <li>FIGC</li>
      <li>DFB</li>
      <li>FPF</li>
    </ul>
  </>
);

export default HomeScreen;
