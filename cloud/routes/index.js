
/*
 * GET home page.
 */

exports.index = function(req, res){
  var host = req.header("host");
  if (host.match(/^www\..*/i)) {
  	res.render('index');
  } else {
    res.redirect(301, "http://www." + host);
  }
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};