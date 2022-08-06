import * as React from 'react';
import { AppBar, Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { ParseJWTToken, GetToken } from './utils';

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

  function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  

  function stringAvatar(jwtPayload: any) {
    if (jwtPayload?.picture !== undefined){
      return
    }

    let name = jwtPayload?.name

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  function GetUserInfo(){
    let token = GetToken()
    if (token === undefined){
      return
    }

    let payload = ParseJWTToken(token)
console.log(payload)
    return <React.Fragment>
      <Typography>{payload?.name}&nbsp;</Typography>
        <Avatar alt={payload?.name} {...stringAvatar(payload)} src={payload?.picture} />
      </React.Fragment>
  }

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Link href="https://stockholmfootvolley.github.io/frontend/">Booking - Stockholm Footvolley</Link>
          </Typography>
          {GetUserInfo()}
        </Toolbar>
      </AppBar>
      {props.children}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid sx={{
          display: 'center',
          justifyContent: 'center',
        }}>
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item.name}>
                    <Link href={item.link} variant="subtitle1" color="text.secondary">
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
