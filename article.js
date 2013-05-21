fs = require('fs');
path = require('path');
async = require('async');
_ = require('underscore');
marked = require('marked');

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    langPrefix: 'language_'
});

capitalize = function(string)
{
      return string.charAt(0).toUpperCase() + string.slice(1);
}

readPageTitle = function(page,cb){
  fs.stat(path.join('./articles',page),function(err, stats){
    cb(null, { name: capitalize(page.toString().split(".")[0].split("-").join(" ")), stats: stats, filename: page.toString().split(".")[0]});
  });
};
pageExists = function(page, cb) {
  fs.exists(path.join('./articles', page+'.md'), function(exists){
    cb(exists ? true : false);
  })
};

readEntirePage = function(page,cb){
  fs.readFile(path.join('./articles', page+'.md'), {encoding: 'utf-8'}, cb);
};


readOne = function(page,cb) {
  // first check if page exists (false if not)
  async.waterfall([
      function(callback){
        pageExists(page, function(exists){
          if(exists){
            callback();
          }else{
            callback(false);
          }
        });
      },
      // read the file
      function(callback){
        readEntirePage(page,callback);
      },
      // markdown it
      function(data, callback){
        callback(null, marked(data));
      },
      // hash it
      function(data, callback){
        readPageTitle(page+'.md', function(error,info){
          callback(null, {content:data, info: info});
        })
      }
      ],function(error, result){
        cb(error == false ? false : result)
  })
};

readArticles = function(cb){
  fs.readdir('./articles', function(err, files){
    async.waterfall([
        function(callback){
          async.map(files, function(file, call){
            readPageTitle(file, function(error, info){
              call(null, info);
            });
          },callback);
        },
        //sort by creation date
        function(page, callback){
          callback(null,page.sort(function(last,cur){
            if(cur.stats.ctime - last.stats.ctime > 0) return 1
            if(cur.stats.ctime - last.stats.ctime < 0) return -1 
            return 0;
          }));
        },
        // year sort
        function(page, callback){
          var current = 0;
          var they = new Object();
          async.each(page, function(comp, call){
            //console.log(comp)
            if(comp.stats.ctime.getUTCFullYear() != current){
              current = comp.stats.ctime.getUTCFullYear();
              they[current] = []
            }
            they[current].push(comp);
            call()
          }, function(err){/* TODO */ });
          callback(null,they);
        }
      ], function (err, result){
        cb(result);
      });
  });
}

exportfuncts = {
  readAll: readArticles,
  readSingle: readOne
}
module.exports = exports = exportfuncts;
//module.exports = exports = 1;
