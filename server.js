var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";
var mongoClient = require ("mongodb").MongoClient;

http.createServer(function (req, res) 
{
	var urlObj = url.parse(req.url, true, false);

	if (urlObj.pathname.indexOf("comment") != -1)
	{
		if (req.method == "POST")
		{
			var jsonData = "";
			var reqObj = "";  
			req.on('data', function(lump)
			{
				jsonData += lump;
			});

			console.log("flag");
			console.log(reqObj);
			req.on('end', function ()
			{
				reqObj = JSON.parse(jsonData);
				mongoClient.connect("mongodb://localhost/comments", function(err, db)
				{
					if (err) throw err;

					db.collection('comments').insert(reqObj, function(err, records)
					{
						console.log(reqObj);
						console.log("Record added as "+records[0]._id);
					});
				});
			});
			res.writeHead(200);
			res.end("");

		}
		else if (req.method == "GET")
		{
			console.log("get");
			mongoClient.connect("mongodb://localhost/comments", function(err, db)
			{
				if (err) throw err;

				db.collection("comments", function (err, comments)
				{
					if (err) throw err;
					comments.find(function (err, items)
					{
						items.toArray(function (err, itemArray)
						{
							res.writeHead(200);
							res.end(JSON.stringify(itemArray));
						});
					});
				});
			});
		}

	}
	else
	{
		fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) 
		{
			if (err) 
			{
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
		});
	}
}).listen(80);
