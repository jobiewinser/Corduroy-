export default (req, res, next) => {
    if(req.user) {
        console.log('middleware', req.user)
        next();
    }
    console.log('wWAAANN', req.user)
    res.status(401);
    res.end();
}