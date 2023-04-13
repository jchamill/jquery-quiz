;(function(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  'use strict';

  $.quiz = function(el, options) {
    var base = this;

    // Access to jQuery version of element
    base.$el = $(el);

    // Add a reverse reference to the DOM object
    base.$el.data('quiz', base);

    base.options = $.extend($.quiz.defaultOptions, options);

    var questions = base.options.questions,
      numQuestions = questions.length,
      startScreen = base.options.startScreen,
      $startScreen = base.$el.find(startScreen),
      startButton = base.options.startButton,
      homeButton = base.options.homeButton,
      resultsScreen = base.options.resultsScreen,
      $resultsScreen = base.$el.find(resultsScreen),
      gameOverScreen = base.options.gameOverScreen,
      $gameOverScreen = base.$el.find(gameOverScreen),
      nextButtonText = base.options.nextButtonText,
      finishButtonText = base.options.finishButtonText,
      restartButtonText = base.options.restartButtonText,
      currentQuestion = 1,
      score = 0,
      answerLocked = false,
      $quizResults = null,
      $quizNextBtn = null,
      $quizFinishBtn = null,
      $quizRestartBtn = null,
      $quizControls = null,
      $questions = null,
      $quizCounter = null,
      $quizResponse = null,
      $questionContainer = null;

    base.methods = {
      init: function() {
        base.methods.setup();

        base.$el.off();

        base.$el.on('click', startButton, function(e) {
          e.preventDefault();
          base.methods.start();
        });

        base.$el.on('click', homeButton, function(e) {
          e.preventDefault();
          base.methods.home();
        });

        base.$el.on('click', '.answers a', function(e) {
          e.preventDefault();
          base.methods.answerQuestion(this);
        });

        base.$el.on('click', '.quiz-next-btn', function(e) {
          e.preventDefault();
          base.methods.nextQuestion();
        });

        base.$el.on('click', '.quiz-finish-btn', function(e) {
          e.preventDefault();
          base.methods.finish();
        });

        base.$el.on('click', '.quiz-restart-btn, .quiz-retry-btn', function(e) {
          e.preventDefault();
          base.methods.restart();
        });
      },
      setup: function() {
        var quizHtml = '';

        if (base.options.counter) {
          quizHtml += '<div class="quiz-counter"></div>';
        }

        quizHtml += '<div class="questions">';
        $.each(questions, function(i, question) {
          quizHtml += '<div class="question-container">';
          quizHtml += '<p class="question">' + question.q + '</p>';
          quizHtml += '<ul class="answers">';
          $.each(question.options, function(index, answer) {
            quizHtml += '<li><a href="#" data-index="' + index + '">' + answer + '</a></li>';
          });
          quizHtml += '</ul>';
          quizHtml += '</div>';
        });
        quizHtml += '</div>';

        // if results screen not in DOM, add it
        if ($resultsScreen.length === 0) {
          quizHtml += '<div class="' + resultsScreen.substr(1) + '">';
          quizHtml += '<p class="quiz-results"></p>';
          quizHtml += '</div>';
        }

        quizHtml += '<div class="quiz-controls">';
        quizHtml += '<p class="quiz-response"></p>';
        quizHtml += '<div class="quiz-buttons">';
        quizHtml += '<a href="#" class="quiz-next-btn">' + nextButtonText + '</a>';
        quizHtml += '<a href="#" class="quiz-finish-btn">' + finishButtonText + '</a>';
        quizHtml += '<a href="#" class="quiz-restart-btn">' + restartButtonText + '</a>';
        quizHtml += '</div>';
        quizHtml += '</div>';

        base.$el.append(quizHtml).addClass('quiz-container quiz-start-state');

        if ($resultsScreen.length === 0) {
          $resultsScreen = base.$el.find(resultsScreen);
        }
        $quizResults = base.$el.find('.quiz-results');
        $quizControls = base.$el.find('.quiz-controls');
        $questions = base.$el.find('.questions');
        $quizCounter = base.$el.find('.quiz-counter');
        $quizResponse = base.$el.find('.quiz-response');
        $questionContainer = base.$el.find('.question-container');
        $quizNextBtn = base.$el.find('.quiz-next-btn');
        $quizFinishBtn = base.$el.find('.quiz-finish-btn');
        $quizRestartBtn = base.$el.find('.quiz-restart-btn');

        $quizCounter.hide();
        $questionContainer.hide();
        $gameOverScreen.hide();
        $resultsScreen.hide();
        $quizControls.hide();

        if (typeof base.options.setupCallback === 'function') {
          base.options.setupCallback();
        }
      },
      start: function() {
        base.$el.removeClass('quiz-start-state').addClass('quiz-questions-state');
        $startScreen.hide();
        $quizControls.hide();
        $quizFinishBtn.hide();
        $quizRestartBtn.hide();
        $questions.show();
        $quizCounter.show();
        $questionContainer.first().show().addClass('active-question');
        base.methods.updateCounter();
      },
      answerQuestion: function(answerEl) {
        if (answerLocked) {
          return;
        }
        answerLocked = true;

        var $answerEl = $(answerEl),
          response = '',
          selected = $answerEl.data('index'),
          currentQuestionIndex = currentQuestion - 1,
          correct = questions[currentQuestionIndex].correctIndex;

        if (selected === correct) {
          $answerEl.addClass('correct');
          response = questions[currentQuestionIndex].correctResponse;
          score++;
        } else {
          $answerEl.addClass('incorrect');
          response = questions[currentQuestionIndex].incorrectResponse;
          if (!base.options.allowIncorrect) {
            base.methods.gameOver(response);
            return;
          }
        }

        // check to see if we are at the last question
        if (currentQuestion++ === numQuestions) {
          $quizNextBtn.hide();
          $quizFinishBtn.show();
        }

        $quizResponse.html(response);
        $quizControls.fadeIn();

        if (typeof base.options.answerCallback === 'function') {
          base.options.answerCallback(currentQuestion, selected, questions[currentQuestionIndex]);
        }
      },
      nextQuestion: function() {
        answerLocked = false;

        base.$el.find('.active-question')
          .hide()
          .removeClass('active-question')
          .next('.question-container')
          .show()
          .addClass('active-question');

        $quizControls.hide();

        base.methods.updateCounter();

        if (typeof base.options.nextCallback === 'function') {
          base.options.nextCallback();
        }
      },
      gameOver: function(response) {
        // if gameover screen not in DOM, add it
        if ($gameOverScreen.length === 0) {
          var quizHtml = '';
          quizHtml += '<div class="' + gameOverScreen.substr(1) + '">';
          quizHtml += '<p class="quiz-gameover-response"></p>';
          quizHtml += '<p><a href="#" class="quiz-retry-btn">' + restartButtonText + '</a></p>';
          quizHtml += '</div>';
          base.$el.append(quizHtml);
        }
        base.$el.find('.quiz-gameover-response').html(response);
        $quizCounter.hide();
        $questions.hide();
        $quizFinishBtn.hide();
        $gameOverScreen.show();
      },
      finish: function() {
        base.$el.removeClass('quiz-questions-state').addClass('quiz-results-state');
        base.$el.find('.active-question').hide().removeClass('active-question');
        $quizCounter.hide();
        $quizResponse.hide();
        $quizFinishBtn.hide();
        $quizNextBtn.hide();
        $quizRestartBtn.show();
        $resultsScreen.show();
        var resultsStr = base.options.resultsFormat.replace('%score', score).replace('%total', numQuestions);
        $quizResults.html(resultsStr);

        if (typeof base.options.finishCallback === 'function') {
          base.options.finishCallback();
        }
      },
      restart: function() {
        base.methods.reset();
        base.$el.addClass('quiz-questions-state');
        $questions.show();
        $quizCounter.show();
        $questionContainer.first().show().addClass('active-question');
        base.methods.updateCounter();
      },
      reset: function() {
        answerLocked = false;
        currentQuestion = 1;
        score = 0;
        base.$el.find('.answers a').removeClass('correct incorrect');
        base.$el.removeClass().addClass('quiz-container');
        $quizRestartBtn.hide();
        $gameOverScreen.hide();
        $resultsScreen.hide();
        $quizControls.hide();
        $quizResponse.show();
        $quizNextBtn.show();
        $quizCounter.hide();
        base.$el.find('.active-question').hide().removeClass('active-question');

        if (typeof base.options.resetCallback === 'function') {
          base.options.resetCallback();
        }
      },
      home: function() {
        base.methods.reset();
        base.$el.addClass('quiz-start-state');
        $startScreen.show();

        if (typeof base.options.homeCallback === 'function') {
          base.options.homeCallback();
        }
      },
      updateCounter: function() {
        var countStr = base.options.counterFormat.replace('%current', currentQuestion).replace('%total', numQuestions);
        $quizCounter.html(countStr);
      }
    };

    base.methods.init();
  };

  $.quiz.defaultOptions = {
    allowIncorrect: true,
    counter: true,
    counterFormat: '%current/%total',
    startScreen: '.quiz-start-screen',
    startButton: '.quiz-start-btn',
    homeButton: '.quiz-home-btn',
    resultsScreen: '.quiz-results-screen',
    resultsFormat: 'You got %score out of %total correct!',
    gameOverScreen: '.quiz-gameover-screen',
    nextButtonText: 'Next',
    finishButtonText: 'Finish',
    restartButtonText: 'Restart'
  };

  $.fn.quiz = function(options) {
    return this.each(function() {
      new $.quiz(this, options);
    });
  };
}));