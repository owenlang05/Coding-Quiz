// loads json file that contains the question data
var questions = $.getJSON({'url': "./questions.json", 'async': false});
questions = JSON.parse(questions.responseText);

//'randomizes the array
questions = questions.sort((a, b) => 0.5 - Math.random());

var rootEl = $('#root');
var headerEl = $('#header');
var paraEl = $('#paragraph');
var startButton = $('#start-button');
var timerEl = $('#timer');
var time = 0;
var score = 0;
var questionIndex = 0;

function Game() {
    time = 75
    console.log('Game started');
    
    renderQuestion(questionIndex);
    setInterval(decrementTime, 1000);
}

function endGame() {

}

function renderQuestion(index) {

    headerEl.text(questions[index].question);
    paraEl.text('');
    timerEl.text('Time: ' + time);
    startButton.css('display', 'none')

    rootEl.css('align-items', 'start')
    rootEl.children('.answer-btn').remove();
    for (var i = 0; i < 4; i++) {
        rootEl.append('<button type="button" class="answer-btn btn btn-primary btn-sm my-1 custom-button" id='+questions[0].answers[i]+'>'+ i + ". " + 
        questions[index].answers[i]);
    }

}

function onQuestionAnswer(evt) {
    console.log(evt.target.id);
    if (evt.target.id === questions[0].correct){
        score++;
        
    }
    else{
        if (time > 10){
            time -= 10;
            timerEl.text('Time: ' + time);
        }
        else {
            endGame()
        }
    }
    questionIndex++;
    nextQuestion(questionIndex)
}

function decrementTime() {
    if (time) {
        time--;
        timerEl.text('Time: ' + time);
    }
}

function nextQuestion(index){
    console.log(questions.length)
    if (index < questions.length) {
        renderQuestion(index)
    }
    else {
        endGame();
    }
}
$('#start-button').click(Game)
rootEl.on('click', '.answer-btn', onQuestionAnswer);