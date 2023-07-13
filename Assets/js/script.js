// loads json file that contains the question data
var questions = $.getJSON({'url': "./questions.json", 'async': false});
questions = JSON.parse(questions.responseText);

//'randomizes the array
questions = questions.sort((a, b) => 0.5 - Math.random());
//useful global variables
var rootEl = $('#root');
var headerEl = $('#header');
var paraEl = $('#paragraph');
var startButton = $('#start-button');
var correctText = $('#correct');
var timerEl = $('#timer');
var time = 0;
var timer
var score = 0;
var questionIndex = 0;

function Game() {
    //entrypoint for the quiz
    time = 75
    console.log('Game started');
    
    renderQuestion(questionIndex);
    timer = setInterval(decrementTime, 1000);
}

function HighScores() {
    //fetches and parses the highscores from local storage
    const savedScores = localStorage.getItem('highscore') || '[]' // get the score, or the initial value if empty
    const highscores = [...JSON.parse(savedScores)]

    //removes any unwanted elements from the dom and sets some styling
    rootEl.children('.highscore').remove()
    rootEl.children('div').remove();
    rootEl.css('align-items', 'start');
    //prevents timer from ticking
    clearInterval(timer)
    //adds an element for every score in highscore
    for (var i = 0; i < highscores.length; i++){
        var j = i+1
        rootEl.append('<p class="highscore">'+ j + ". " + highscores[i].initial +': ' + highscores[i].score)
    }
    
    //changes text and styles
    headerEl.text("Highscores");
    paraEl.text("")
    startButton.css('display', 'none')
    rootEl.children('.answer-btn').remove();
    //buttons
    rootEl.append('<div>')
    rootEl.children('div').css("display", "inline")
    rootEl.children('div').append('<button type="button" class="go-home btn btn-primary btn-sm custom-button"> Go Back')
    rootEl.children('div').append('<button type="button" class="clear-storage btn btn-primary btn-sm mx-2 custom-button"> Clear Storage')
}

function endGame() {
    clearInterval(timer)
    headerEl.text("All Done!!");
    paraEl.text("Your score: " + score);
    //funny bootstrap form thingy

    rootEl.children('div').remove()
    //adds buttons and input field from bootstrap
    rootEl.children('.answer-btn').remove();
    rootEl.append('<div class="input-group mb-3">');
    rootEl.children('div').append('<input type="text" class="form-control" placeholder="Initials" aria-describedby="button-addon2">')
    rootEl.children('div').append('<button class="btn btn-outline-secondary custom-button" type="button" id="submit">');
    rootEl.children('div').children('button').text("Submit");

}

function renderQuestion(index) {
    //changes text
    headerEl.text(questions[index].question);
    paraEl.text('');
    timerEl.text('Time: ' + time);
    startButton.css('display', 'none')

    rootEl.css('align-items', 'start')
    rootEl.children('.answer-btn').remove();
    //adds answer buttons
    for (var i = 0; i < 4; i++) {
        //stupid way to get id checks to work, i know this is bad code
        rootEl.append('<button type="button" class="answer-btn btn btn-primary btn-sm my-1 custom-button" id='+
        questions[index].answers[i].split(" ").join("-")+'>'+ (i+1).toString() + ". " + 
        questions[index].answers[i]);
    }

}

function onQuestionAnswer(evt) {
    //hacky way of getting id checks to work, im too close to the deadline to find anything
    // better or refactor
    if (evt.target.id == questions[questionIndex].correct.split(" ").join("-")){
        score++; 
        //displays if the answer was right or wrong
        correctText.text('Correct!')
        correctText.css('display', 'block');
    }
    else{
        // ends the game if there is less than ten seconds left
        if (time > 10){
            time -= 10;
            timerEl.text('Time: ' + time);
            //displays if the answer is right or wrong
            correctText.text('Wrong!')
            correctText.css('display', 'block');
        }
        else {
            endGame()
        }
    }
    setTimeout(function(){
        correctText.css('display', 'none')
    }, 1000)

    questionIndex++;
    nextQuestion(questionIndex)
}

function decrementTime() {
    //ends the game if time is 0
    if (time){
        time--;
    }
    else {
        endGame();
    };
    timerEl.text('Time: ' + time);
}

function nextQuestion(index){
    // goes to next question or ends the game if there is no questions left
    if (index < questions.length) {
        renderQuestion(index)
    }
    else {
        endGame();
    }
}

function submitInitial(evt) {
    evt.preventDefault()
    //gets initials from form
    const result = {initial: $('input[type="text"]').val(), score: score};

    const savedScores = localStorage.getItem('highscore') || '[]' // get the score, or the initial value if empty
    // sorts and appends the new results to local storage
    const highscores = [...JSON.parse(savedScores), result] // add the result
    .sort((a, b) => b.score- a.score) // sort descending

    localStorage.setItem('highscore', JSON.stringify(highscores))
    HighScores();
}

function reset() {
    //sets everything to the default state so the user can try again
    //clears all of highscore dom stuff
    $('.highscore').remove()
    $('.go-home').remove()
    $('.clear-storage').remove()

    time = 0;
    timer
    score = 0;
    questionIndex = 0;

    rootEl.css('align-items', 'center')
    headerEl.text('Coding Quiz Challenge');
    paraEl.text(
    "Try to answer the following code-related questions within the time limit. " +
    "Keep in mind that incorrect answers will penalize your time by ten seconds.");
    startButton.css('display', 'flex')
}


//event handlers
$('#start-button').click(Game)
rootEl.on('click', '.answer-btn', onQuestionAnswer);
rootEl.on('click', '#submit', submitInitial);
rootEl.on('click', '.go-home', reset);
rootEl.on('click', '.clear-storage', function() {
    localStorage.clear();
    HighScores();
})
$('body').on('click', '#highscore', HighScores);
