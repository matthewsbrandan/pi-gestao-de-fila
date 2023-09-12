import passport from "passport";

export const middlewareAuth = () => passport.authenticate('local', {
  failureRedirect: '/',
  failureMessage: true
})