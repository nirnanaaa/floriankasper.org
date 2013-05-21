
/*
 * GET home page.
 */
articles = require('../article');

exports.index = function(req, res){

  articles.readAll(function(cb){
    res.render('index', { 
      title: 'Home | Floriankasper',
      articles: cb 
    });

  });
};
exports.article = function(req, res){


  articles.readSingle(req.route.params.article, function(result){
    if(result){
      res.render('article', {
        title: 'Article | Floriankasper',
        content: result.content
      });
    }else{
      res.render('notfound', {
        title: '404 Not Found | Floriankasper'
      })
    }
  })
}
