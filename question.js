var dataurl = "https://jsonbin.org/yinchengchen/plasm";
fetch('https://api.jsonbin.io/b/5ed9f78c655d87580c443b75', {
    headers: {
        "secret-key": '$2b$10$Zk61rj6afq40ft7wTAfRj.Xagrp3DKcML/QNyEHurtvhxFSeXRp4S',
    }
}).then(res => res.json()).then(res => {

    var data = res.data;
    /* initialize */
    // set chapter range
    var chapterList = new Set();
    var repeatList = new Set();
    data.forEach(function (element) {
        chapterList.has(element.chapter) ? repeatList.add(element.chapter) : chapterList.add(element.chapter);
    });
    // create option
    setChapterList(chapterList);
    /*Event*/
    // go to selection page
    var newGameButton = document.getElementById("new-game");
    newGameButton.addEventListener("click", event => {
        //console.log("event", event);
        // clear all session storage
        // close main page and set selection page
        document.getElementById("main-page").setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center d-none");
        document.getElementById("selection-page").setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center");
        sessionStorage.clear();
    }, false);
    // go to the test page
    var startOption = document.getElementById("start-chapter");
    var endOption = document.getElementById("end-chapter");
    var numberInput = document.getElementById("question-number");
    var testButton = document.getElementById("test-start");
    var resultWrong = document.getElementById("wrong");
    var resultCorrect = document.getElementById("correct");
    testButton.addEventListener("click", function () {
        console.log("start ", startOption.value, "end ", endOption.value, numberInput.value);
        if(!numberInput.value){
            alert("請填寫題數.");
            return;
        }else{
            var scoreObject = {
                "number": numberInput.value,
                "correctNum": 0,
                "wrongNum": 0,
                "order": 1,
            };
            updateSessionStorage(scoreObject, "score");
            var selectionpage = document.getElementById("selection-page");
            selectionpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center d-none");
            var testpage = document.getElementById("test-page");
            testpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center");
            setTestList(data, parseInt(startOption.value), parseInt(endOption.value));
        }
    });
    var nextButton = document.getElementById("next");
    nextButton.addEventListener("click", function () {
        console.log("next one");        
        resultWrong.setAttribute("class", "row mr-1 ml-1 d-none");        
        resultCorrect.setAttribute("class", "row mr-1 ml-1 d-none");
        document.querySelectorAll(".answer-option").forEach(function (item) {
            item.removeAttribute("disabled");
        });
        setTestList(data, parseInt(startOption.value), parseInt(endOption.value));
    });
    var finalButton = document.getElementById("final");
    finalButton.addEventListener("click", function () {
        console.log("final Result");
        resultWrong.setAttribute("class", "row mr-1 ml-1 d-none");        
        resultCorrect.setAttribute("class", "row mr-1 ml-1 d-none");
        document.getElementById("test-page").setAttribute("class", "row main-view mt-4 mr-1 ml-1 d-none");
        document.getElementById("score-page").setAttribute("class", "container");
        document.querySelectorAll(".answer-option").forEach(function (item) {
            item.removeAttribute("disabled");
        });
        showScoreResult();        
    });
    var restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", function(){
        document.getElementById("score-page").setAttribute("class", "container d-none");
        document.getElementById("main-page").setAttribute("class","row main-view mt-4 mr-1 ml-1");
        sessionStorage.clear();
    });
});

// get Random list
function setTestList(data, startChapter, endChapter) {
    console.log(data);
    var selectionList = data.filter(function (element) {
        return element.chapter >= startChapter && element.chapter <= endChapter;
    });
    var numberList = Object.values(selectionList).map(item => item.number);
    // get Random number
    var randomList = getArrayItems(numberList, 4);
    var questionList = Object.values(selectionList).filter(function (item) {
        if (randomList.indexOf(item.number) >= 0) {
            return item;
        }
    });
    var orderList = [1, 2, 3, 4];
    var order = getArrayItems(orderList, 1);
    // Create test view
    displayTest(order, questionList);
}
// Get the chapter list
function setChapterList(data) {
    var startInput = document.getElementById("start-chapter");
    var endInput = document.getElementById("end-chapter");
    data.forEach(element => {
        var option = document.createElement("OPTION");
        option.setAttribute("value", element);
        option.textContent = element;
        startInput.appendChild(option);
    });
    data.forEach(element => {
        var option = document.createElement("OPTION");
        option.setAttribute("value", element);
        option.textContent = element;
        endInput.appendChild(option);
    });
}
function getArrayItems(arr, num) {
    //新建一個陣列,將傳入的陣列複製過來,用於運算,而不要直接操作傳入的陣列;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的數值項,儲存在此陣列
    var return_array = new Array();
    for (var i = 0; i < num; i++) {
        //判斷如果陣列還有可以取出的元素,以防下標越界
        if (temp_array.length > 0) {
            //在陣列中產生一個隨機索引
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            //將此隨機索引的對應的陣列元素值複製出來
            return_array[i] = temp_array[arrIndex];
            //然後刪掉此索引的陣列元素,這時候temp_array變為新的陣列
            temp_array.splice(arrIndex, 1);
        } else {
            //陣列中資料項取完後,退出迴圈,比如陣列本來只有10項,但要求取出20項.
            break;
        }
    }
    return return_array;
}
function setCountTimer() {
    // set TIMER
    var start = true;     // flags that you want the countdown to start
    var stopIn = 10000;    // how long the timer should run
    var stopTime = 0;     // used to hold the stop time
    var stop = false;     // flag to indicate that stop time has been reached
    var timeTillStop = 0; // holds the display time
    function update(timer) {
        var ptext = document.getElementById("timer");
        if (start) {  // do we need to start the timer
            stopTime = timer + stopIn; // yes the set the stoptime
            start = false;             // clear the start flag
        } else {                         // waiting for stop
            if (timer >= stopTime) {     // has stop time been reached?
                stop = true;           // yes the flag to stop
            }
        }
        timeTillStop = stopTime - timer;      // for display of time till stop
        // log() should be whatever you use to display the time.
        //console.log(Math.floor(timeTillStop / 1000));  // to display in 1/100th seconds
        ptext.textContent = Math.floor(timeTillStop / 1000) + 1;

        //element.style.transform = 'translateX(' + Math.min(timeTillStop / 1000, 10) + 'px)';
        if (!stop) {
            requestAnimationFrame(update); // continue animation until stop
        } else {
            showAnswerResult();
        }
    }

    requestAnimationFrame(update);  // start the animation
}

function displayTest(order, data) {
    console.log("type:", order);
    order = order - 1;
    // Set question
    // check the number of question
    var score = loadSessionStorage("score");
    console.log("Show quesition number : ", score.number);
    
    var nextButton = document.getElementById("next");
    var finalButton = document.getElementById("final");
    if (parseInt(score.number) === 1) {
        nextButton.setAttribute("class", "set d-none");
        finalButton.setAttribute("class", "set");
        finalButton.setAttribute("disabled", true);
    } else {
        finalButton.setAttribute("class", "set d-none");
        nextButton.setAttribute("class", "set");
        nextButton.setAttribute("disabled", true);
    }
    document.getElementById("question-order").textContent = "題目 " + String(score.order);
    var questionView = document.getElementById("question-title");
    var verseView = document.querySelectorAll(".verse-view");
    questionView.textContent = data[order].question;
    var answerOject = {
        "chapter": data[order].chapter,
        "verse": data[order].verse,
        "correct": data[order].answer,
    };
    updateSessionStorage(answerOject, "answer");
    verseView[1].textContent = data[order].chapter + ":" + data[order].verse;
    // Set answer
    var answerViews = document.querySelectorAll(".answer-option");
    console.log("lsit: ", answerViews);
    answerViews.forEach(function (item, index) {
        if (index === order) {
            item.textContent = data[order].answer;
            item.setAttribute("data-ch", data[order].chapter);
            item.setAttribute("data-vr", data[order].verse);
        } else {
            item.textContent = data[index].answer;
            item.setAttribute("data-ch", data[index].chapter);
            item.setAttribute("data-vr", data[index].verse);
        }
    });
    setCountTimer();
    checkAnswer();
}

function updateLocalStorage(dataObject, localStorageName) {
    var updateOject = JSON.stringify(dataObject);
    localStorage.setItem(localStorageName, updateOject);
}
function loadLocalStorage(localStorageName) {
    var loadItem = localStorage.getItem(localStorageName);
    return JSON.parse(loadItem);
}
function updateSessionStorage(dataObject, sessionStorageName) {
    var updateOject = JSON.stringify(dataObject);
    sessionStorage.setItem(sessionStorageName, updateOject);
}
function loadSessionStorage(sessionStorageName) {
    var loadItem = sessionStorage.getItem(sessionStorageName);
    return JSON.parse(loadItem);
}

function checkAnswer() {
    var answerCheck = loadSessionStorage("answer");
    var questionTitle = document.getElementById("question-title");
    var verseTitle = document.getElementById("verse-title");
    var fatherNode = document.getElementById("test-page");
    var checkObject = {
        "check": false,
        "verse": verseTitle.textContent,
        "question": questionTitle.textContent,
        "correct": answerCheck.correct,
        "answer": "未作答",
    };
    updateSessionStorage(checkObject, "check");
    fatherNode.addEventListener("click", function (e) {
        if (e.target.nodeName !== "BUTTON" || e.target.id === "next" || e.target.id === "final") {
            return;
        } else {
            //console.log(e.target.dataset.ch, typeof (e.target.dataset.ch), e.target.dataset.vr, typeof (e.target.dataset.vr));
            //console.log(answerCheck);
            if (answerCheck.chapter === parseInt(e.target.dataset.ch) && answerCheck.verse === parseInt(e.target.dataset.vr)) {
                console.log("correct!");
                checkObject = {
                    "check": true,
                    "verse": verseTitle.textContent,
                    "question": questionTitle.textContent,
                    "correct": answerCheck.correct,
                    "answer": e.target.textContent,
                };
            } else {
                console.log("wrong!!!");
                checkObject = {
                    "check": false,
                    "verse": verseTitle.textContent,
                    "question": questionTitle.textContent,
                    "correct": answerCheck.correct,
                    "answer": e.target.textContent,
                };
                // record all wrong verse
            }
            updateSessionStorage(checkObject, "check");
        }
    }, false);
}
function showAnswerResult() {
    //console.log("End time");
    var answer = loadSessionStorage("check");
    var score = loadSessionStorage("score");
    score.number = score.number - 1;
    score.order = score.order + 1;
    var nextButton = document.getElementById("next");
    nextButton.removeAttribute("disabled");
    var finalButton = document.getElementById("final");
    finalButton.removeAttribute("disabled");
    var buttonViews = document.querySelectorAll(".answer-option");
    buttonViews.forEach(function (item) {
        item.setAttribute("disabled", true);
    });
    var resultView;
    // Show result
    if (answer.check === true) {
        resultView = document.getElementById("correct");
        clearNode(resultView);
        resultView.setAttribute("class", "row mr-1 ml-1");
        var innerHtmlOfCorrect = '<div class="col-12 pt-1 pb-1 resultcorrect">正確 ' +
            answer.verse + '<hr>' + answer.question + answer.correct +
            '</div></div>';
        resultView.innerHTML = innerHtmlOfCorrect;
        score.correctNum = score.correctNum + 1;
        updateSessionStorage(score, "score");
    } else {
        resultView = document.getElementById("wrong");
        clearNode(resultView);
        resultView.setAttribute("class", "row mr-1 ml-1");
        var innerHtmlOfWrong = '<div class="col-12 pt-1 pb-1 resultcorrect">正確 ' +
            answer.verse + '<hr>' + answer.question + answer.correct +
            '</div><div class="col-12 mt-3 mb-3 pt-1 pb-1 resultwrong">錯誤<hr>' + answer.answer +
            '</div></div>';
        resultView.innerHTML = innerHtmlOfWrong;
        score.wrongNum = score.wrongNum + 1;
        updateSessionStorage(score, "score");
        recordWrongAnswer(answer);
    }
}

function showScoreResult() {
    var score = loadSessionStorage("score");
    var record = loadSessionStorage("record-wrong");
    document.getElementById("total").textContent = parseInt(score.correctNum) + parseInt(score.wrongNum);
    document.getElementById("correct-num").textContent = score.correctNum;
    document.getElementById("wrong-num").textContent = score.wrongNum;
    var recordList = document.getElementById("record-list");
    clearNode(recordList);
    recordList.textContent = "答錯紀錄";
    record.forEach(function (item) {
        var verseRecord = document.createElement("DIV");
        var correctRecord = document.createElement("DIV");
        var wrongRecord = document.createElement("DIV");
        verseRecord.setAttribute("class", "record");
        correctRecord.setAttribute("class", "resultcorrect");
        wrongRecord.setAttribute("class", "resultwrong");
        verseRecord.textContent = item.verse;
        correctRecord.textContent = item.question + item.correct;
        wrongRecord.textContent = item.answer;
        recordList.appendChild(verseRecord);
        recordList.appendChild(correctRecord);
        recordList.appendChild(wrongRecord);
    });
}

function recordWrongAnswer(dataObject) {
    var recordList = loadSessionStorage("record-wrong") || [];
    if (recordList) {
        var tmp = {
            "verse": dataObject.verse,
            "question": dataObject.question,
            "correct": dataObject.correct,
            "answer": dataObject.answer,
        };
        recordList.push(tmp);
    } else {
        recordList = [{
            "verse": dataObject.verse,
            "question": dataObject.question,
            "correct": dataObject.correct,
            "answer": dataObject.answer,
        }];
    }
    updateSessionStorage(recordList, "record-wrong");
}

function clearNode(fatherNode) {
    while (fatherNode.firstChild) {
        fatherNode.removeChild(fatherNode.firstChild);
    }
}

