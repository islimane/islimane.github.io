/////////////////
/// Functions ///
/////////////////

// This function pops a random element
// from the given array
var getRandom = function(arr){
  var randIndex = Math.floor(Math.random()*arr.length);
  return arr[randIndex];
}

///////////
/// APP ///
///////////

var VocabularyMenu = React.createClass({
  loadWordsFromServer: function() {
    var data = getJSON(url);
    if(data!==null){
      this.setState({
        data: data,
        words: data[0].words,
        wordNode: getRandom(data[0].words)
      });
    }
  },

  // Get the json file
	componentDidMount: function() {
		this.loadWordsFromServer();
	},

  render: function(){
    return(
      <div>
        <h1>Select a subject:</h1>
      </div>
    );
  }
});

var VocabularHeaderApp = React.createClass({
  handleClick: function(e){
    e.preventDefault();

    var subject_file = e.target.id;

    this.props.onUserChangeSubject(subject_file);
  },

  render: function(){
    return(
      <div>
        <h1>Choose a vocabulary subject</h1>
        <div>
          <a href=""
              className="subject"
              onClick={this.handleClick}
              id="el_cuerpo">El Cuerpo</a>

          <a href=""
              className="subject"
              onClick={this.handleClick}
              id="vocabulary">Mixed Vocabulary</a>
          <a href=""
              className="subject"
              onClick={this.handleClick}
              id="la_familia">La familia</a>
        </div>
      </div>
    );
  }
});

var VocabularyApp = React.createClass({
  // // "props" are immutable, to implement interactions we add
	// // "state".
	getInitialState: function() {
      // data: are all word objects contained in the json file
      // wordNode: is the current word that we are specting to
      //           be translated
	    return {
        wordNode: getRandom(this.props.words),
        vocabularyStyle: "hideWords",
        showWords: false,
        inputTextValue: '',
        inputTextStyle: "input-text-wrong"
      };
	},

  handleClick: function(e){
    // Prevent the browser's default action of submitting the form
    e.preventDefault();

    if(!this.state.showWords)
      this.setState({
        vocabularyStyle: "ar-word",
        showWords: true
      });
    else
      this.setState({
        vocabularyStyle: "hideWords",
        showWords: false
      });
  },

  handleChange: function(){
    var input = React.findDOMNode(this.refs.userInput).value;
    var correct = input.trim()===this.state.wordNode.es_word;
    if(correct){
      this.setState({
        inputTextValue: input,
        inputTextStyle: "input-text-right"
      });
    }else{
      this.setState({
        inputTextValue: input,
        inputTextStyle: "input-text-wrong"
      });
    }
  },

  handleAnotherWord: function(e){
    e.preventDefault();

    var nextWord = this.state.wordNode;

    while(nextWord===this.state.wordNode){
      nextWord = getRandom(this.props.words)
    }

    this.setState({
      wordNode: nextWord,
      inputTextValue: ""
    });
  },

  cleanInput: function(){
    this.setState({
      inputTextValue: "",
      inputTextStyle: "input-text-wrong"
    });
  },

  componentWillReceiveProps: function(nextProps){
    this.setState({
      wordNode: getRandom(nextProps.words),
      vocabularyStyle: "hideWords",
      showWords: false,
      inputTextValue: '',
      inputTextStyle: "input-text-wrong"
    });
  },

  render: function(){
    console.log("RENDER: VocabularyApp");

    if(this.props.words!==null)
      var wordsNodes = this.props.words.map(function(wordNode){
        // In some cases, React requires that each returned element
        // has its own key
        return (
  				<div className="word-sol" key={wordNode.ar_word}>
  					{wordNode.ar_word}: {wordNode.es_word}
  				</div>
  			);
  		});

    // This manage the show/hide vocabulay button
    if(this.state.showWords)
      var vocText = "Hide Vocabulary";
    else
      var vocText = "Show Vocabulary";

    return(
      <div>
        <form onSubmit={this.handleAnotherWord}>
          <span className="ar-word">{this.state.wordNode.ar_word}</span>:
          <input type="text"
                  placeholder="Translation..."
                  ref="userInput"
                  value={this.state.inputTextValue}
                  className={this.state.inputTextStyle}
                  onChange={this.handleChange}/>
        </form>

        <div>
          <p><a href="" onClick={this.handleAnotherWord}>Give me another word...</a></p>
        </div>

        <div>
          <p><a href="" onClick={this.handleClick}>{vocText}</a></p>
          <div className={this.state.vocabularyStyle}>
            {wordsNodes}
          </div>
        </div>
      </div>
    );
  }
});

var VocabularyBox = React.createClass({
  getInitialState: function() {
    return {
      subject: null,
      subject_file: null,
      data: null,
      words: null,
      clean: false
    };
  },

  loadData: function(url, subject) {
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log("data:");
        console.log(data);
        this.setState({
          subject: subject,
          subject_file: url,
          data: data,
          words: data[0].words,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
        return null;
      }.bind(this)
    });
  },

  loadWordsFromServer: function(subject) {
    if(this.props.url!==null){
      var file_path = "vocabulary/" + subject + ".json"
      console.log(file_path);
      this.loadData(file_path, subject);
    }
	},

  handleChangeSubject: function(subject){
    console.log("subject: " + subject);
    this.loadWordsFromServer(subject);
    if(this.refs['VocabularyApp']!==undefined)
      this.refs['VocabularyApp'].cleanInput();
  },

  render: function(){
    console.log(this.state.subject);
    if(this.state.subject!==null){
      var tile = this.state.subject;
      var vocabularyApp = <div>
                            <h3>{tile}</h3>
                            <p>Translate the next word:</p>
                            <VocabularyApp url={this.state.subject_file}
                                            words={this.state.words}
                                            ref="VocabularyApp"/>

                          </div>;
    }else{
      var title = "";
      var vocabularyApp = "";
    }

    return(
      <div>
        <VocabularHeaderApp onUserChangeSubject={this.handleChangeSubject} />
        {vocabularyApp}
      </div>
    );
  }
});

// This call render all components that
// we have defined before
React.render(
  <VocabularyBox/>,
  document.getElementById('content')
);
