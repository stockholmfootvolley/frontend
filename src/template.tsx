import * as React from 'react';
import { AppBar, Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { GetToken, SetUserPicture } from './utils';

const footers = [
  {
    title: 'Socials',
    description: [
      {
        name: 'Instagram',
        link: 'https://www.instagram.com/footvolleystockholm/',
      },
      {
        name: 'Facebook',
        link: 'https://www.facebook.com/stockholmfootvolleyclub',
      },
    ],
  },
];

export function Template(props: any) {
  const [node, setNode] = React.useState<JSX.Element[]>([])

  function CreateAvatar(name: string, picture: string) {
    setNode([
      <React.Fragment>
        <Typography>{name}&nbsp;</Typography><Avatar alt={name} src={picture} />
      </React.Fragment>])
  }

  React.useMemo(() => {
    let token = GetToken()
    if (token === undefined) {
      return
    }
    SetUserPicture(token, CreateAvatar)
  }, [])

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} key={"globalstyles"}/>
      <CssBaseline key={"cssbaseline"}/>
      <AppBar
        key={"appbar"}
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }} key={"toolbar"}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} key={"toolbar-typo"}>
            <Link href={window.location.origin + window.location.pathname}>Booking - Stockholm Footvolley</Link>
          </Typography>
          {node}
        </Toolbar>
      </AppBar>
      {props.children}
      <Container
        key={"maincontainer"}
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid 
          key={"grid2"}
          sx={{
          display: 'center',
          justifyContent: 'center',
        }}>
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={`${footer.title}grid`}>
              <Typography variant="h6" color="text.primary" gutterBottom key={`${footer.title}typo`}>
                {footer.title}
              </Typography>
              <ul key={`${footer.title}ul`}>
                {footer.description.map((item) => (
                  <li key={`${item.name}li`}>
                    <Link href={item.link} variant="subtitle1" color="text.secondary" key={item.link}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
