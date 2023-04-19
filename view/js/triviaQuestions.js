function getNumberOfQuestions() {
    const radios = document.getElementsByName('num-questions');
    let numOfQuestions = '';
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
        numOfQuestions = radios[i].value;
        break;
        }
    }
    return numOfQuestions;
}

function getDifficulty() {
    const radios = document.getElementsByName('difficulty');
    let difficulty = '';
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            difficulty = radios[i].value;
        break;
        }
    }
    return difficulty;
} 

$('#play-quiz-btn').click((event) => {
    event.preventDefault();
    let numOfQuestions = getNumberOfQuestions();
    let difficulty = getDifficulty();
    $("#loading").show();

    $.ajax({
        url: '/trivia',
        type: 'GET',
        contentType: 'application/json',
        data: {
            numOfQuestions: numOfQuestions,
            difficulty: difficulty
        },
        success: function(response){
            console.log("success", response);
            $("#loading").hide(); // hide loading animation
            let questions = response.setOfQuestions;
            let allCorrectAnswers = response.allCorrectAnswers;
            let divQuestion = $("<div>");
            for (let i = 0; i < questions.length; i++){
                let question = $("<p>").text(`Question ${i+1}: `+ questions[i]);
                let divAnswer = $("<div>").css({
                    "margin-bottom": "10px",
                });
                for (let j = 0; j < response.availableOptions[i].length; j++) {
                    let answer = $("<input>").attr({
                        type: "radio",
                        name: `question-${i+1}-answers`,
                        value: response.availableOptions[i][j]
                    });
                    let answerText = $("<label>").text(response.availableOptions[i][j]);
                    answerText.css('margin-right', '10px');
                    divAnswer.append(answer, answerText);
                }
                divQuestion.append(question, divAnswer);
            }
            $("#display-questions").html(divQuestion);

            let submitBtn = $("<button>").text("Submit");
            submitBtn.click(function(){
                let selectedOptions = [];
                for (let i = 0; i < questions.length; i++){
                    let selectedAnswer = $(`input[name='question-${i+1}-answers']:checked`).val();
                    selectedOptions.push(selectedAnswer);
                }
                $.ajax({
                    url: '/trivia/game',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        setOfQuestions: questions,
                        allCorrectAnswers: allCorrectAnswers,
                        selectedOptions: selectedOptions
                    }),
                    success: function(response){
                        console.log(response);
                        let correctAns;
                        let resultDiv = $("<div>");
                        for(let k= 0; k < response.selectedOptions.length; k++){
                            correctAns = $("<p>").text(response.selectedOptions[k]);
                            resultDiv.append(correctAns);
                        }
                        let score = $("<p>").text(`Your quiz score is ${response.score}%`);
                        resultDiv.append(score);
                        $("#display-result").append(resultDiv);
                    },
                    error: function(xhr, status, error){
                        var errorMessage = xhr.status + ': ' + xhr.statusText
                        alert('Error - ' + errorMessage);
                    }
                });
            });
            $("#display-questions").append(submitBtn);


        },
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });

});