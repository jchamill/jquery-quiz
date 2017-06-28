# jQuery Quiz Plugin

A simple jQuery quiz plugin.

## Disclaimer

This is a very simple quiz plugin I created to port quizzes from
an existing platform. It creates simple multiple choice quizzes.
You can customize most of the screens that are displayed, as well
as the text displayed.

## Usage

### HTML

```
<div id="quiz">
  <div id="quiz-header">
    <h1>Basic Quiz Demo</h1>
    <!-- Optionally add a home button -->
    <p><a id="quiz-home-btn">Home</a></p>
  </div>
  <div id="quiz-start-screen">
    <p><a href="#" id="quiz-start-btn" class="quiz-button">Start</a></p>
  </div>
</div>
```

You may optionally add other HTML, this is just the markup
required by the plugin (although home button is optional).

### Javascript

```javascript
$('#quiz').quiz({
  questions: [
    {
      'q': 'A smaple question?',
      'options': [
        'Answer 1',
        'Answer 2',
        'Answer 3',
        'Answer 4'
      ],
      'correctIndex': 1,
      'correctResponse': 'Custom correct response.',
      'incorrectResponse': 'Custom incorrect response.'
    }
  ]
});
```

Add as many questions as you like. You may also specify a
different number of options (answers) for each question.

Don't forget to include jQuery.

#### Options

`allowIncorrect: boolean [default: true]`
> If false, the quiz will show the gameOver screen if a
> question is answered incorrectly. This will force the user
> to get a perfect score to complete the quiz.

`counter: boolean [default: true]`
> If true, a counter will be shown displaying the current
> question and how many questions there are. The output
> of the counter can be customized using `counterFormat`.

`counterFormat: string [default: '%current/%total']`
> Specify the counter format. The placehoder `%current`
> displays which question you are currently on. The placeholder
> `%total` displays the total number of questions.

`startScreen: string [default: '#quiz-start-screen']`
> The id selector of the start screen. The start screen should
> contain the start button.

`startButton: string [default: '#quiz-start-btn']`
> The id selector of the start button.

`homeButton: string [default: '#quiz-home-btn']`
> The id selector of the home button.

`resultsScreen: string [default: '#quiz-results-screen']`
> The id selector of the results screen. This screen will
> display the number of questions correct.

`resultsFormat: string [default: 'You got %score out of %total correct!']`
> Specify the results format. The placehoder `%score`
> displays how many questions you got correct. The placeholder
> `%total` displays the total number of questions.

`gameOverScreen: string [default: '#quiz-gameover-screen']`
> The id selector of the game over screen. This screen is
> used when `allowIncorrect` is set to false.

`nextButtonText: string [default: 'Next']`
> The text to display on the next button.

`finishButtonText: string [default: 'Finish']`
> The text to display on the finish button.

`restartButtonText: string [default: 'Restart']`
> The text to display on the restart button.

#### Callbacks

`answerCallback: function [default: undefined]`
> Callback fired after an answer is selected.

`nextCallback: function [default: undefined]`
> Callback fired after the next button is clicked.

`finishCallback: function [default: undefined]`
> Callback fired after the finish button is clicked.

`homeCallback: function [default: undefined]`
> Callback fired after the home button is clicked.