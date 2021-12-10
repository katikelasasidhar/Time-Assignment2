const express = require('express');
const app = express();
const axios = require('axios');
const dotenv=require('dotenv');
dotenv.config();


const PORT = process.env.PORT||4000;

const routes = express.Router();



var requiredOutput = [];
var requiredItem = {
  title: '',
  link: '',
};

const URL = 'https://time.com';

app.use('/getLatestStories', routes);

routes.route('/').get(function (req, res) {
   
  axios(URL)                  //promise status of pending
  
    .then((response) => {
       //console.log(response) //need data from the response
      const html = response.data; //response from page is stored in html
     // console.log(html)
      var lines = html.split('\n'); //split method to split the html into lines
   //  console.log(lines)// array of each line
      res.json(getLatestNews(lines));
    })
    .catch((err)=>{
        console.log(err)
    });
});

app.listen(PORT, function () {
  console.log('Server is running on Port: ' + PORT);
});

function getLatestNews(lines) {
  requiredOutput = [];
  var collection = '';
  var temp = '';
  var i = 0;
  var isClassLatest = false;
  var count = 0;
  var url = '';
  var title = '';

  for (let line of lines) {
    collection = line.split(' '); // splitting line into words
    

    for (let str of collection) {
      i++;
       
      if (str == 'class="homepage-module' && collection[i] == 'latest"') {
        
          //<section class="homepage-module latest" data-module_name="Latest Stories">
        //verifying the class of the html; required class is 'homepage-module latest'
        isClassLatest = true; //if the class is found we need to access contents of the class
      }
      if (isClassLatest && str == '<h2') {
       
        //to get h2 tag in the class 'homepage-module latest'
       //  <h2 class="title"><a href=/6127331/jussie-smollett-guilty-staged-attack/>Jussie Smollett Convicted of Lying About Attack</a></h2>
        temp = line.split('>');
/*[
  '                  <h2 class="title"',
  '<a href=/6127331/jussie-smollett-guilty-staged-attack/',
  'Jussie Smollett Convicted of Lying About Attack</a',
  '</h2',
  ''
]*/

        title = temp[2].split('<')[0]; //collects the text in h2 tag which is the title of the news
       //[ 'Jussie Smollett Convicted of Lying About Attack', '/a' ]
       
        url = URL.concat(temp[1].split('=')[1]); //this breaks href='link', collects the link and concatenates it to the base URL
//[ '<a href', '/6127331/jussie-smollett-guilty-staged-attack/' ]
        requiredItem = {
          title: title,
          link: url,
        };
        

        requiredOutput.push(requiredItem); //link and title are pushed to the requiredOutput
        count++;
      }
    
    }
    if (count == 5) {
        break;
      }
    i = 0;
  }
  return requiredOutput;
}
