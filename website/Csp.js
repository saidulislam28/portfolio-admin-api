export default function csp(req, res, next) {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self'; img-src 'self' data:; media-src 'self'; frame-src 'none'; font-src 'self'; connect-src 'self';"
    );
    next();
  }