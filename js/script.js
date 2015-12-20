var corpus;
var dict = {};
var endWords = {};
var startWords = [];
var order = 2;
var min_words =20;

var fred = 'images/Fred.png';

//chrome.exe --allow-file-access-from-files

//gets a file from user and create dictionnary
function readSingleFile(evt) {
    var f = evt.target.files[0]; 

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
          var contents = e.target.result;
          corpus = contents;
          corpus = corpus.replace(/\s+/g, ' ').trim();
          dict = {};
          createDict();
      }
      r.readAsText(f, 'ISO-8859-1');
    } else { 
        alert("Failed to load file");
    }
}

var choice = function (a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
}

//create dictionnary from the text
//For each word, keep track of the possible following words
// order 2 do the same for each serie of 2 words 
// keep a record of words at start and end of sentences
var createDict = function(){
    dict = {};
    endWords = {};
    startWords = [];

    if (order == 1)
        createDict1()
    else if (order == 2)
        createDict2()
    else
        createDict3()
    console.log(dict);
}

var createDict1 = function(){
    var words = corpus.split(' ');
    for (var i = 0; i < words.length - 1; i++) {
        // endwords finish with . ? ! or )
        if (words[i].charAt([words[i].length-1]) == '.' || words[i].charAt([words[i].length-1]) == '?'|| words[i].charAt([words[i].length-1]) == '!'|| words[i].charAt([words[i].length-1]) == ')'){
            endWords[words[i]] = true;
            startWords.push(words[i+1]);
        }
        // if key already in dict, add a new possible value
        if ( words[i] in dict) {
            dict[words[i]].push(words[i+1])
        } 
        // else create new key-value
        else {
            dict[words[i]] = [words[i+1]]
        }    
    }
}

var createDict2 = function(){
    var words = corpus.split(' ');
    for (var i = 0; i < words.length - 2; i++) {
        // endwords finish with . ? ! or )
        if (words[i].charAt([words[i].length-1]) == '.' || words[i].charAt([words[i].length-1]) == '?'|| words[i].charAt([words[i].length-1]) == '!'|| words[i].charAt([words[i].length-1]) == ')'){
            endWords[words[i]] = true;
            startWords.push([words[i+1],words[i+2]]);
        }
        // if key already in dict, add a new possible value
        if ( words[i] in dict && words[i+1] in dict[words[i]] ) {
            dict[words[i]][words[i+1]].push(words[i+2])
        } 
        // else create new key-value
        else {
            if (dict[words[i]]== undefined){
             dict[words[i]] ={}
            }
            dict[words[i]][words[i+1]] = [words[i+2]]
        }    
    }
}

var createDict3 = function(){
    var words = corpus.split(' ');
    for (var i = 0; i < words.length - 3; i++) {
        // endwords finish with . ? ! or )
        if (words[i].charAt([words[i].length-1]) == '.' || words[i].charAt([words[i].length-1]) == '?'|| words[i].charAt([words[i].length-1]) == '!'|| words[i].charAt([words[i].length-1]) == ')'){
            endWords[words[i]] = true;
            startWords.push([words[i+1],words[i+2],words[i+3]]);
        }
        // if key already in dict, add a new possible value
        if ( words[i] in dict && words[i+1] in dict[words[i]] && words[i+2] in dict[words[i]][words[i+1]]) {
            dict[words[i]][words[i+1]][words[i+2]].push(words[i+3])
        } 
        // else create new key-value
        else {
            if (dict[words[i]]== undefined){
             dict[words[i]] ={}
            }
            if (dict[words[i]][words[i+1]]== undefined){
             dict[words[i]][words[i+1]] ={}
            }
            dict[words[i]][words[i+1]][words[i+2]] = [words[i+3]]
        }    
    }
}




//Pick a random starting word, look into dictionnary for possible next word
// stops when post length > min length and last word is a endword
var make_post = function(min_length){
    var result;
    if (order == 1)
        result =  make_post_order1(min_length);
    else if (order == 2)
        result = make_post_order2(min_length);
    else if (order == 3)
        result = make_post_order3(min_length);

    if (result.length < min_length) return make_post(min_length);
    return result.join(' ');t;}

var make_post_order1 = function (min_length) {
    word = choice(startWords);
    var phrase = [word];
    while (dict.hasOwnProperty(word)) {
        var next_words = dict[word];
        word = choice(next_words);
        phrase.push(word);
        if (phrase.length > min_length && endWords.hasOwnProperty(word)) break;
    }

    return phrase
}

var make_post_order2 = function (min_length) {
    var w = choice(startWords);
    word = w[0];
    word2 = w[1]
    var phrase = [word,word2];

    var p1 = phrase[phrase.length-2];
    var p2 = phrase[phrase.length-1];

    while (p1 in dict && p2 in dict[p1]) {

        var next_words = dict[p1][p2];
        word = choice(next_words);
        phrase.push(word)

        p1 = phrase[phrase.length-2];
        p2 = phrase[phrase.length-1];

        if (phrase.length > min_length && endWords.hasOwnProperty(word))  break;
    }
    return phrase
    
}

var make_post_order3 = function (min_length) {
    var w = choice(startWords);
    word = w[0];
    word2 = w[1];
    word3 = w[2];
    var phrase = [word,word2,word3];


    var p1 = phrase[phrase.length-3];
    var p2 = phrase[phrase.length-2];
    var p3 = phrase[phrase.length-1];

    while (p1 in dict && p2 in dict[p1] && p3 in dict[p1][p2]) {

        var next_words = dict[p1][p2][p3];
        word = choice(next_words);
        phrase.push(word)
        console.log(word)

        p1 = phrase[phrase.length-3];
        p2 = phrase[phrase.length-2];
        p3 = phrase[phrase.length-1];

        if (phrase.length > min_length && endWords.hasOwnProperty(word))  break;
    }

    return phrase
}



$(document).ready(function(){
    document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
    var title = make_post(min_words);
        $("#generated_title").html(title);

    $('#fred').attr('src', fred);

    $("#generate").on('click', function () {
        var title = make_post(min_words);
        $("#generated_title").html(title);
      });

    $("#radioOrder").on('change', function () {
        order = $("input[name=order]:checked").val();
        dict = {};
        createDict();
      });

    $("#minWords").on('change', function () {
        min_words = $("input[name=minWords]").val();
      });
})



var request = new XMLHttpRequest();

request.open("GET", "test.txt", false);
request.overrideMimeType('text/xml; charset=iso-8859-1');
request.send(null);
corpus = request.responseText;
corpus = corpus.replace(/\s+/g, ' ');
createDict();
make_post(min_words);
