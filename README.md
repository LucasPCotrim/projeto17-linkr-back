# Linkr

Linkr is a social network application designed for sharing links.
Users can create their profile, log-in and share their favorite links.
They can also follow other users to see their posts on their own timeline or see posts from trending hashtags.
It's also possible to like, comment and repost.

This is the project for the back-end of Linkr.


## API Documentation

### Sign-up

```
  POST /sign-up
```
#### Headers
| Parameter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | Username |
| `email` | `string` | User email |
| `password` | `string` | Password |
| `profilePic` | `string` | URL of user profile picture |

### Log-in

```
  POST /sign-in
```
#### Headers
| Parameter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | User email |
| `password` | `string` | Password |

### Log-out

```
  POST /logout
```
#### Headers
| Parameter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `string` | 'Bearer <token>' |

#### Body
| Parameter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | User email |
| `password` | `string` | Password |




## Deploy

Front-end deploy url:

  https://projeto17-linkr.vercel.app/
  
Back-end deploy url:
 
  https://projeto-linkr-backend.herokuapp.com/

  
## Authors

- [@Kevin Candeloni](https://github.com/kcandeloni)

- [@Lucas Melo](https://github.com/Lucas-Melo0)

- [@Lucas Cotrim](https://github.com/LucasPCotrim)

- [@Mateus Diniz](https://github.com/MateusDiniz9)

- [@Sandi Tomaz](https://github.com/sanditomaz)
